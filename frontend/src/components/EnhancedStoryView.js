import React, { useState, useEffect, useRef } from 'react';
import { Home, Volume2, VolumeX } from 'lucide-react';
 
const EnhancedStoryView = ({ 
  currentStory, 
  currentChoices, 
  handleChoice, 
  goHome, 
  character, 
  storyImage,
  isImageLoading 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageHasError, setImageHasError] = useState(false);
  const [videoHasError, setVideoHasError] = useState(false);
  const videoRef = useRef(null);
  const characterAnimationComplete = true; // Keep this logic gate for now
  const [isShaking, setIsShaking] = useState(false);

  // New state for chunked text display
  const [storyChunks, setStoryChunks] = useState([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(0);

  // Effect to split the story into chunks
  useEffect(() => {
    if (currentStory && characterAnimationComplete) {
      // Split the story by sentences ending in '.', '!', or '?'
      const chunks = currentStory.split(/(?<=[.!?])\s*/).filter(chunk => chunk.trim().length > 0);
      setStoryChunks(chunks);
      setCurrentChunkIndex(0);
      setWaitingForInput(false);
      setShowChoices(false);
      setSelectedChoiceIndex(0); // Reset selected choice on new story
      setDisplayedText('');
    }
  }, [currentStory, characterAnimationComplete]);

  // Typewriter effect
  useEffect(() => {
    if (storyChunks.length === 0 || currentChunkIndex >= storyChunks.length) {
      return;
    }

    const chunkToDisplay = storyChunks[currentChunkIndex];
    setWaitingForInput(false); // Reset waiting state for the new chunk
    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < chunkToDisplay.length) {
        setDisplayedText(chunkToDisplay.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        setWaitingForInput(true); // Stop and wait for user input
        clearInterval(typeInterval);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [storyChunks, currentChunkIndex]);

  // Effect to listen for 'Enter' key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && waitingForInput && !isTyping) { 
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500); // Reset after animation duration
        setCurrentChunkIndex(prevIndex => prevIndex + 1); // Just advance the chunk index
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [waitingForInput, isTyping]);

  // Effect for choice navigation with arrow keys
  useEffect(() => {
    if (!showChoices) return;

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        setSelectedChoiceIndex(prevIndex => (prevIndex + 1) % currentChoices.length);
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        setSelectedChoiceIndex(prevIndex => (prevIndex - 1 + currentChoices.length) % currentChoices.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (currentChoices[selectedChoiceIndex]) {
          handleChoice(currentChoices[selectedChoiceIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showChoices, selectedChoiceIndex, currentChoices, handleChoice]);

  // Reset image error state when a new image URL is provided
  useEffect(() => {
    setImageHasError(false);
  }, [storyImage]);

  // Reset video error state when a new video URL is provided
  useEffect(() => {
    setVideoHasError(false);
  }, [storyImage]);

  // Helper to detect common video file extensions
  const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
  };

  // Text-to-speech function
  const speakText = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(displayedText);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  // Show choices when all story chunks have been displayed
  useEffect(() => {
    if (storyChunks.length > 0 && currentChunkIndex >= storyChunks.length) {
      setShowChoices(true);
    }
  }, [currentChunkIndex, storyChunks]);

  const choiceEmojis = ['🎯', '🌟', '💪', '🔍', '💡', '🛡️'];
  const getRandomEmoji = (index) => choiceEmojis[index % choiceEmojis.length];

  const isVideo = isVideoUrl(storyImage);

  return (
    <div
      className="fixed inset-0 animate-fade-in z-50 text-white"
      style={{
        backgroundColor: !storyImage || (isVideo ? videoHasError : imageHasError) ? '#111827' : 'transparent',
        overflow: 'hidden', // Prevent any potential overflow from the container
      }}
    >
      {/* Loading or Fallback Content */}
      {isImageLoading ? (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-900/80">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-semibold">Creating your scene...</p>
          </div>
        </div>
      ) : (!storyImage || imageHasError) && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-900">
          <span className="text-gray-400">Scene unavailable</span>
        </div>
      )}
      {/* Render video when the URL appears to be a video, otherwise render image background. */}
      {isVideo && !videoHasError && !isImageLoading ? (
        <video
          ref={videoRef}
          src={storyImage}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setVideoHasError(true)}
        />
      ) : (!isVideo && storyImage && !imageHasError && !isImageLoading) ? (
        <img src={storyImage} onError={() => setImageHasError(true)} className="absolute inset-0 w-full h-full object-cover" alt="Story illustration" />
      ) : null}

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

      {/* Home Button */}
      <button 
        onClick={goHome} 
        className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 transition-colors"
        title="Go Home"
      >
        <Home className="w-6 h-6" /> {/* Changed from X to Home icon */}
      </button>

      {/* Main Content Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10 flex flex-col items-center text-center">
        <div className="w-full max-w-6xl mx-auto flex items-end gap-8">
          {/* Character Model - always visible */}
          <div className="w-1/3 flex-shrink-0">
            <img src={character.avatar} alt={character.name} className={`w-full h-auto object-contain ${
              isShaking ? 'animate-shake-vertical' : ''
            }`} />
          </div>

          {/* Dialogue or Choices */}
          <div className="w-2/3">
            {showChoices ? (
              // Choices View
              <div className="animate-fade-in space-y-6 text-center">
                <h3 className="text-3xl font-bold">What will you do? 🤔</h3>
                <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
                  {currentChoices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleChoice(choice)}
                      onMouseEnter={() => setSelectedChoiceIndex(index)}
                      className={`group w-full text-center bg-black/50 backdrop-blur-sm rounded-xl p-4 border-2 transition-all duration-200 ease-in-out transform ${
                        selectedChoiceIndex === index ? 'border-primary scale-105 bg-primary/20' : 'border-white/20 hover:border-primary/50'
                      }`}
                    >
                      <p className="font-semibold leading-snug text-lg">
                        <span className="text-primary mr-3">{getRandomEmoji(index)}</span>
                        {choice.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Narration View
              <div className="animate-slide-up-fade">
                <div className="relative bg-black/60 backdrop-blur-md rounded-2xl p-4 md:p-5 border-2 border-white/20 w-full">
                  <p className="text-lg md:text-xl leading-relaxed text-left">
                    {displayedText}
                    {isTyping && <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" />}
                    {waitingForInput && (
                      <span className="absolute bottom-2 right-3 text-primary animate-pulse">▼</span>
                    )}
                  </p>
                  {typeof window !== 'undefined' && 'speechSynthesis' in window && !isTyping && (
                    <button
                      onClick={speakText}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      title={isSpeaking ? "Stop reading" : "Read aloud"}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* choice display handled by effect in component body */}

    
    </div>
  );
};

export default EnhancedStoryView;