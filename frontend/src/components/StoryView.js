import React, { useState, useEffect } from 'react';
import { Pause } from 'lucide-react';
import AudioNarration from './features/AudioNarration';
import HintSystem from './features/HintSystem';
import AnimatedTransition from './features/AnimatedTransition';

const StoryView = ({ currentStory, currentChoices, imageUrl, handleChoice, goHome }) => {
  const [safeChoices, setSafeChoices] = useState(0);
  const [totalChoices, setTotalChoices] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, [currentStory]);

  const handleChoiceWithAnimation = async (choice) => {
    setIsVisible(false);
    setTotalChoices(prev => prev + 1);
    if (choice.isSafe) {
      setSafeChoices(prev => prev + 1);
    }

    // If this is the end of the story, update achievements
    if (choice.isEnding) {
      try {
        await fetch('/api/achievements/update-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({
            safeChoices,
            totalChoices: totalChoices + 1,
            isComplete: true
          })
        });
      } catch (error) {
        console.error('Error updating achievements:', error);
      }
    }

    setTimeout(() => {
      handleChoice(choice);
    }, 500);
  };

  return (
    <AnimatedTransition isVisible={isVisible}>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in bg-card p-6 md:p-8 rounded-xl shadow-lg border border-border">
        {imageUrl ? (
            <img src={imageUrl} alt="Story illustration" className="rounded-lg w-full h-auto object-cover aspect-video shadow-lg" />
          ) : (
            <div className="w-full aspect-video bg-background rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Loading image...</p>
            </div>
          )}

        <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg border border-border">
          <div className="flex justify-between items-start mb-4">
          <AudioNarration text={currentStory} />
          <HintSystem choices={currentChoices} />
          </div>
          <div className="prose prose-lg max-w-none prose-invert">
            <p className="text-lg leading-relaxed text-foreground">
              {currentStory}
            </p>
          </div>
        </div>

        <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg border border-border">
          <h3 className="text-xl font-bold text-foreground text-center mb-4">
            What do you do?
          </h3>
          <div className="space-y-4">
            {currentChoices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleChoiceWithAnimation(choice)}
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
      </div>
    </AnimatedTransition>
  );
};

export default StoryView;