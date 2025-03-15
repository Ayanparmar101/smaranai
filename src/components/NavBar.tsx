
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Image, Mic, MessageCircle, HelpCircle, Home, GraduationCap, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import AuthButton from './AuthButton';
import { ThemeToggle } from './ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const closeMenu = () => setIsOpen(false);
    window.addEventListener('resize', closeMenu);
    return () => window.removeEventListener('resize', closeMenu);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const navItems = [
    { 
      name: 'Home', 
      path: '/',
      icon: <Home className="w-6 h-6" />,
      color: 'bg-kid-blue'
    },
    { 
      name: 'Grammar', 
      path: '/grammar',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-kid-green'
    },
    { 
      name: 'Story Images', 
      path: '/story-images',
      icon: <Image className="w-6 h-6" />,
      color: 'bg-kid-yellow'
    },
    { 
      name: 'Spoken English', 
      path: '/spoken-english',
      icon: <Mic className="w-6 h-6" />,
      color: 'bg-kid-red'
    },
    { 
      name: 'Voice Bot', 
      path: '/voice-bot',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-kid-purple'
    },
    { 
      name: 'Socratic Tutor', 
      path: '/socratic-tutor',
      icon: <HelpCircle className="w-6 h-6" />,
      color: 'bg-kid-orange'
    },
    { 
      name: 'Teacher', 
      path: '/teacher',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'bg-kid-blue'
    }
  ];

  return (
    <nav className="bg-card shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center relative">
          {/* Hamburger Menu */}
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 rounded-md hover:bg-muted focus:outline-none">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 py-4">
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 w-full text-left",
                        location.pathname === item.path
                          ? `${item.color} text-white font-medium`
                          : "hover:bg-muted"
                      )}
                    >
                      {item.icon}
                      <span className="text-lg">{item.name}</span>
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Logo (Centered) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl bg-gradient-to-r from-kid-blue via-kid-purple to-kid-red bg-clip-text text-transparent">
                Smaran.ai
              </span>
            </Link>
          </div>
          
          {/* Mobile Logo (Left-aligned) */}
          <div className="md:hidden">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl bg-gradient-to-r from-kid-blue via-kid-purple to-kid-red bg-clip-text text-transparent">
                Smaran.ai
              </span>
            </Link>
          </div>

          {/* Auth Button and Theme Toggle */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthButton />
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggle} className="p-2 rounded-md bg-muted">
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`${isOpen ? 'flex' : 'hidden'} absolute top-16 left-0 right-0 flex-col bg-card shadow-lg md:hidden`}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-none transition-all duration-300 w-full text-left",
                location.pathname === item.path
                  ? `${item.color} text-white font-medium`
                  : "hover:bg-muted"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
