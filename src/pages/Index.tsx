
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Image, Mic, MessageCircle, HelpCircle } from 'lucide-react';
import DoodleCard from '@/components/DoodleCard';
import DoodleButton from '@/components/DoodleButton';
import DoodleDecoration from '@/components/DoodleDecoration';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  <span className="block">Learn English</span>
                  <span className="gradient-text">
                    The Fun Way!
                  </span>
                </h1>
                <p className="text-xl mb-8 text-gray-700">
                  Interactive lessons, story generators, and AI tutors to help students in grades 1-8 master English.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/grammar">
                    <DoodleButton color="blue" size="lg">
                      Get Started
                    </DoodleButton>
                  </Link>
                  <Link to="/grammar">
                    <DoodleButton color="purple" size="lg" variant="outline">
                      Explore Lessons
                    </DoodleButton>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="relative">
                  <img 
                    src="https://img.freepik.com/free-vector/hand-drawn-colorful-doodle-background_23-2149019438.jpg" 
                    alt="Colorful doodles" 
                    className="rounded-2xl shadow-lg" 
                  />
                  <div className="absolute -top-6 -right-6">
                    <DoodleDecoration type="star" color="yellow" size="lg" />
                  </div>
                  <div className="absolute -bottom-6 -left-6">
                    <DoodleDecoration type="heart" color="red" size="lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background decorations */}
          <div className="absolute top-20 left-10 opacity-20">
            <DoodleDecoration type="cloud" color="blue" size="lg" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-20">
            <DoodleDecoration type="circle" color="green" size="lg" />
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="section-title">Learn With Fun Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              <DoodleCard
                title="English Grammar"
                description="Learn grammar rules with interactive lessons and fun exercises."
                icon={<BookOpen className="w-8 h-8" />}
                color="green"
                to="/grammar"
              />
              
              <DoodleCard
                title="Story Image Generator"
                description="Create beautiful images to illustrate your stories and writing."
                icon={<Image className="w-8 h-8" />}
                color="yellow"
                to="/story-images"
              />
              
              <DoodleCard
                title="Spoken English"
                description="Practice pronunciation and speaking with audio lessons."
                icon={<Mic className="w-8 h-8" />}
                color="red"
                to="/spoken-english"
              />
              
              <DoodleCard
                title="Voice Chat Bot"
                description="Talk with an AI tutor that listens and responds to your voice."
                icon={<MessageCircle className="w-8 h-8" />}
                color="purple"
                to="/voice-bot"
              />
              
              <DoodleCard
                title="Socratic Tutor"
                description="Learn through guided questions that help you discover answers."
                icon={<HelpCircle className="w-8 h-8" />}
                color="orange"
                to="/socratic-tutor"
              />
              
              <div className="card-doodle border-kid-pink flex flex-col items-center justify-center bg-gradient-to-br from-white to-pink-100 p-6">
                <DoodleDecoration type="heart" color="pink" size="md" />
                <h3 className="text-xl font-bold mt-4 mb-2">Coming Soon</h3>
                <p className="text-gray-600 text-center">More exciting features are on the way!</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Age Groups Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="section-title">For All Age Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              {[
                { grade: '1-2', title: 'Early Learners', color: 'bg-kid-green' },
                { grade: '3-4', title: 'Building Skills', color: 'bg-kid-blue' },
                { grade: '5-6', title: 'Growing Confident', color: 'bg-kid-purple' },
                { grade: '7-8', title: 'Advanced English', color: 'bg-kid-red' },
              ].map((group, index) => (
                <div 
                  key={index} 
                  className="card-doodle transition-all duration-300 hover:scale-105"
                >
                  <div className={`${group.color} text-white text-sm font-medium px-3 py-1 rounded-full w-fit mb-4`}>
                    Grades {group.grade}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{group.title}</h3>
                  <p className="text-gray-600">
                    Lessons and activities specifically designed for this age group's learning needs.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-kid-blue/10 to-kid-purple/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Learning?</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Begin your English learning journey with our interactive and fun tools designed for students of all levels.
            </p>
            <DoodleButton color="purple" size="lg">
              Get Started Now
            </DoodleButton>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
