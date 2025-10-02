import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingScreen = ({ text = "Crafting your adventure..." }) => {
  return (
    <div className="text-center space-y-4 animate-fade-in">
      <div className="inline-block p-5 bg-card rounded-full shadow-lg border border-border">
        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">
        {text}
      </h2>
    </div>
  );
};

export default LoadingScreen;