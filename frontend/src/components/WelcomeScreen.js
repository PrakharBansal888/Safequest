import React from 'react';
import { BookOpen } from 'lucide-react';

const WelcomeScreen = ({ setStage }) => {
  return (
    <div className="text-center space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="inline-block p-5 bg-card rounded-full shadow-lg border border-border">
        <BookOpen className="w-16 h-16 text-primary" />
      </div>
      <h2 className="text-4xl font-bold text-foreground">
        Welcome to SafeQuest!
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Embark on interactive adventures where YOUR choices matter. 
        Learn to stay safe while having fun in exciting stories tailored just for you!
      </p>
      <button onClick={() => setStage('login')} className="px-8 py-3 bg-primary text-primary-foreground text-lg font-bold rounded-full shadow-lg hover:bg-primary/90 hover:scale-105 transform transition-all duration-200">
        Get Started
      </button>
    </div>
  );
};

export default WelcomeScreen;