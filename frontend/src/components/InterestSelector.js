import React from 'react';
import { Sparkles } from 'lucide-react';

const InterestSelector = ({ interests, selectedInterests, handleInterestToggle, startStory }) => {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          What interests you?
        </h2>
        <p className="text-md text-muted-foreground">
          Pick one or more topics you'd love to explore (choose at least one)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {interests.map(interest => (
          <button
            key={interest.id}
            onClick={() => handleInterestToggle(interest.id)}
            className={`p-6 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 text-foreground ${
              selectedInterests.includes(interest.id)
                ? `bg-primary/20 ring-2 ring-primary text-white`
                : 'bg-card hover:bg-accent'
            }`}
          >
            <div className="text-4xl mb-2">{interest.emoji}</div>
            <h3 className="text-lg font-bold">{interest.name}</h3>
          </button>
        ))}
      </div>

      <div className="text-center mt-8">
        <button onClick={startStory} disabled={selectedInterests.length === 0} className="px-8 py-3 bg-primary text-primary-foreground text-lg font-bold rounded-full shadow-lg hover:bg-primary/90 hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate My Adventure
          </span>
        </button>
      </div>
    </div>
  );
};

export default InterestSelector;