import React, { useState } from 'react';
import { HelpCircle, Lightbulb } from 'lucide-react';

const HintSystem = ({ choices }) => {
  const [showHint, setShowHint] = useState(false);

  const getHint = () => {
    const safeChoices = choices.filter(choice => choice.safe);
    if (safeChoices.length === 0) return "Think carefully about safety!";
    
    // Give a subtle hint without directly revealing the answer
    return "Look for choices that prioritize your safety and well-being!";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowHint(!showHint)}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-600 rounded-full hover:bg-yellow-500/20 transition-colors"
      >
        {showHint ? <Lightbulb className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
        <span className="text-sm font-medium">
          {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </span>
      </button>

      {showHint && (
        <div className="absolute top-full mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg max-w-xs">
          <p className="text-sm text-yellow-800">{getHint()}</p>
        </div>
      )}
    </div>
  );
};

export default HintSystem;