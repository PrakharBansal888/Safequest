import React from 'react';
import { Pause } from 'lucide-react';

const StoryView = ({ currentStory, currentChoices, handleChoice, goHome }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in bg-card p-6 md:p-8 rounded-xl shadow-lg border border-border">
      <div>
        <div className="prose prose-lg max-w-none prose-invert">
          <p className="text-lg leading-relaxed text-foreground">
            {currentStory}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground text-center mb-4">
          What do you do?
        </h3>
        {currentChoices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => handleChoice(choice)}
            className="w-full p-4 bg-background rounded-lg shadow-md transform hover:-translate-y-0.5 transition-all duration-200 text-left border border-border hover:border-primary"
          >
            <span className="text-md font-semibold text-foreground">
              {choice.text}
            </span>
          </button>
        ))}
         <div className="text-center mt-8">
          <button onClick={goHome} className="px-5 py-2 bg-amber-500/80 text-white text-sm font-semibold rounded-full shadow-sm hover:bg-amber-600 transition-colors flex items-center gap-2 mx-auto">
            <Pause className="w-5 h-5" /> Let's take a break
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryView;