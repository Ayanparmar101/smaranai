
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthContext } from '@/App';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { openaiService } from '@/services/openaiService';
import { ChapterPDFUploader } from '@/components/ChapterPDFUploader';
import { PDFService } from '@/services/pdfService';
import { supabase } from '@/integrations/supabase/client';
import ChapterSelector, { books } from './ChapterSelector';
import ChapterContent from './ChapterContent';
import QuestionAnswerSection from './QuestionAnswerSection';

const TeacherPageContainer: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string>("8");
  const [selectedBook, setSelectedBook] = useState<string>("honeydew");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chapterContent, setChapterContent] = useState<string>("");
  const [uploadedPDFs, setUploadedPDFs] = useState<Record<string, { file: File, url: string | null }>>({});
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in when accessing the page
  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to access the teacher features');
      navigate('/auth');
    }
  }, [user, navigate]);

  // Handle API key setup
  useEffect(() => {
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envApiKey) {
      openaiService.setApiKey(envApiKey);
    } else {
      const savedApiKey = localStorage.getItem('openaiApiKey');
      if (savedApiKey) {
        openaiService.setApiKey(savedApiKey);
      }
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setQuestion(transcript);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast.error(`Speech recognition error: ${event.error}`);
        };
        
        recognitionRef.current.onend = () => {
          if (isListening) {
            try {
              recognitionRef.current?.start();
            } catch (error) {
              console.error('Failed to restart speech recognition', error);
            }
          }
        };
      }
    } else {
      toast.error('Speech recognition is not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        
        if (isListening) {
          try {
            recognitionRef.current.stop();
          } catch (error) {
            console.error('Error stopping speech recognition:', error);
          }
        }
      }
    };
  }, [isListening]);

  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in this browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Failed to start speech recognition');
      }
    }
  };

  // Load chapter content when a chapter is selected
  useEffect(() => {
    if (selectedChapter) {
      const loadChapterContent = async () => {
        try {
          const chapterId = `${selectedBook}-${selectedChapter}`;
          
          // Check if we have the PDF in our uploadedPDFs state
          if (uploadedPDFs[chapterId]) {
            const content = await PDFService.extractTextFromPDF(uploadedPDFs[chapterId].file);
            setChapterContent(content);
            setPdfUrl(uploadedPDFs[chapterId].url);
            return;
          }
          
          // If not, try to get it from Supabase storage
          const pdfResponse = await PDFService.getPDF(chapterId);
          if (pdfResponse) {
            // Convert the response to a file
            const blob = await pdfResponse.blob();
            const file = new File([blob], `${chapterId}.pdf`, { type: 'application/pdf' });
            
            // Extract text and update state
            const content = await PDFService.extractTextFromPDF(file);
            setChapterContent(content);
            
            // Update uploadedPDFs state
            const { data: { publicUrl } } = supabase.storage
              .from('chapter_pdfs')
              .getPublicUrl(`${chapterId}/${chapterId}.pdf`);
              
            setPdfUrl(publicUrl);
            
            setUploadedPDFs(prev => ({
              ...prev,
              [chapterId]: { file, url: publicUrl }
            }));
          } else {
            // No PDF found
            setChapterContent("No PDF uploaded for this chapter yet. Please upload a PDF to view content.");
            setPdfUrl(null);
          }
        } catch (error) {
          console.error('Error loading chapter content:', error);
          toast.error('Failed to load chapter content');
          setChapterContent("Error loading chapter content. Please try again.");
          setPdfUrl(null);
        }
      };
      
      loadChapterContent();
    }
  }, [selectedChapter, selectedBook, uploadedPDFs]);

  // Ask a question about the chapter
  const askQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    if (!openaiService.getApiKey()) {
      toast.error('Please set your OpenAI API key first');
      return;
    }
    
    if (!chapterContent) {
      toast.error('No chapter content loaded. Please upload a PDF for this chapter.');
      return;
    }
    
    setIsLoading(true);
    setAnswer("");
    
    try {
      const book = books.find(b => b.id === selectedBook);
      const chapter = book?.chapters.find(c => c.id === selectedChapter);
      
      const systemPrompt = `You are a helpful, educational assistant specializing in English literature for Class ${selectedClass} students. 
      You will answer questions about the chapter "${chapter?.name}" based on the provided content. 
      Be thorough but keep your explanations at an appropriate level for the student's grade. 
      Always base your responses on the provided chapter content.`;
      
      // Use streaming to show answer as it's generated
      await openaiService.createCompletion(
        systemPrompt,
        `Chapter Content: ${chapterContent}\n\nQuestion: ${question}`,
        {
          stream: true,
          onChunk: (chunk) => {
            setAnswer(prev => prev + chunk);
            if (answerRef.current) {
              answerRef.current.scrollTop = answerRef.current.scrollHeight;
            }
          }
        }
      );
    } catch (error) {
      console.error('Error getting answer:', error);
      toast.error('Failed to get answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (file: File, publicUrl: string | null) => {
    const chapterId = `${selectedBook}-${selectedChapter}`;
    if (file) {
      setUploadedPDFs(prev => ({
        ...prev,
        [chapterId]: { file, url: publicUrl }
      }));
      setPdfUrl(publicUrl);
      toast.success(`PDF uploaded for ${chapterId}`);
      
      // Update chapter content with extracted text
      PDFService.extractTextFromPDF(file).then(content => {
        setChapterContent(content);
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Teacher</CardTitle>
          <CardDescription>
            Select your class and chapter, then ask questions about the content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChapterSelector
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            selectedBook={selectedBook}
            setSelectedBook={setSelectedBook}
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
          />
          
          <div className="mb-4">
            <div className="flex justify-end items-center">
              {selectedChapter && (
                <ChapterPDFUploader 
                  onFileUpload={handleFileUpload}
                  chapterId={`${selectedBook}-${selectedChapter}`}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChapterContent 
          chapterContent={chapterContent} 
          pdfUrl={pdfUrl} 
        />
        
        <QuestionAnswerSection
          question={question}
          setQuestion={setQuestion}
          answer={answer}
          isListening={isListening}
          toggleListening={toggleListening}
          askQuestion={askQuestion}
          isLoading={isLoading}
          selectedChapter={selectedChapter}
        />
      </div>
    </div>
  );
};

export default TeacherPageContainer;
