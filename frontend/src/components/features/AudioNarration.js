import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioNarration = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState('speechSynthesis' in window);

  const speak = () => {
    if (!isSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch for engagement
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  if (!isSupported) return null;

  return (
    <button
      onClick={speak}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
    >
      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      <span className="text-sm font-medium">
        {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
      </span>
    </button>
  );
};

export default AudioNarration;