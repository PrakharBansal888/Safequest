import React, { useEffect, useState } from 'react';

const PadlockLoader = ({ onComplete }) => {
  const [isRotating, setIsRotating] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [isHandleHidden, setIsHandleHidden] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showClickEffect, setShowClickEffect] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  useEffect(() => {
    // Start rotation after brief delay
    const rotateTimer = setTimeout(() => {
      setIsRotating(true);
    }, 600);

    // Start locking animation after rotation
    const lockTimer = setTimeout(() => {
      setIsLocking(true);
    }, 2200);

    // Hide handle and show click effect
    const hideHandleTimer = setTimeout(() => {
      setIsHandleHidden(true);
      setShowClickEffect(true);
      setIsLocked(true);
    }, 3200);

    // Hide click effect
    const hideClickTimer = setTimeout(() => {
      setShowClickEffect(false);
    }, 3600);

    // Start fade out
    const fadeTimer = setTimeout(() => {
      setShouldFadeOut(true);
    }, 4200);

    // Complete transition
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4700);

    return () => {
      clearTimeout(rotateTimer);
      clearTimeout(lockTimer);
      clearTimeout(hideHandleTimer);
      clearTimeout(hideClickTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center transition-all duration-700 ${shouldFadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Animated background with glowing orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-purple-500/5 to-transparent animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-2xl animate-float-slow"></div>
      </div>

      {/* Main padlock container */}
      <div className="relative z-10 flex flex-col items-center space-y-12 px-8">
        {/* Padlock SVG with enhanced animations */}
        <div className="relative">
          {/* Enhanced Lock effect */}
          {showClickEffect && (
            <div className="absolute top-[160px] left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-click-ripple opacity-80"></div>
              <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-60"></div>
              <div className="absolute inset-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-50"></div>
            </div>
          )}
          
          <svg
            width="280"
            height="320"
            viewBox="0 0 280 320"
            className="drop-shadow-2xl"
          >
            {/* Solid dark color definitions */}
            <defs>
              <linearGradient id="padlockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1f2937" />
                <stop offset="50%" stopColor="#374151" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
              
              <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1f2937" />
                <stop offset="50%" stopColor="#374151" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
              
              <filter id="cleanShadow">
                <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
              </filter>
            </defs>
            
            {/* Padlock body with clean lines */}
            <rect
              x="70"
              y="160"
              width="140"
              height="130"
              rx="20"
              ry="20"
              fill="none"
              stroke="url(#padlockGradient)"
              strokeWidth="8"
              filter="url(#cleanShadow)"
            />
            
            {/* Keyhole with clean design */}
            <circle
              cx="140"
              cy="205"
              r="12"
              fill="none"
              stroke="url(#padlockGradient)"
              strokeWidth="4"
              filter="url(#cleanShadow)"
            />
            <rect
              x="136"
              y="205"
              width="8"
              height="20"
              fill="none"
              stroke="url(#padlockGradient)"
              strokeWidth="4"
              filter="url(#cleanShadow)"
            />
            
            {/* Animated handle with realistic partial fade effect */}
            <g
              style={{
                transformOrigin: '140px 160px',
                transform: `
                  ${isRotating ? 'rotateY(180deg)' : 'rotateY(0deg)'}
                  ${isLocking ? 'translateY(20px)' : 'translateY(0px)'}
                `,
                transition: `
                  transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${isRotating ? '0s' : '0s'},
                  transform 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${isLocking ? '1.7s' : '0s'}
                `
              }}
            >
              {/* Visible part of handle (above padlock) */}
              <path
                d="M 90 160 Q 90 100, 140 100 Q 190 100, 190 160"
                fill="none"
                stroke="url(#padlockGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                filter="url(#cleanShadow)"
                style={{
                  clipPath: isLocking ? 'polygon(0 0, 100% 0, 100% 75%, 0 75%)' : 'none',
                  transition: 'clip-path 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  transitionDelay: isLocking ? '1.7s' : '0s'
                }}
              />
              
              {/* Hidden part of handle (inside padlock) - fades out */}
              {!isHandleHidden && (
                <path
                  d="M 90 160 Q 90 100, 140 100 Q 190 100, 190 160"
                  fill="none"
                  stroke="url(#padlockGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  filter="url(#cleanShadow)"
                  style={{
                    clipPath: 'polygon(0 75%, 100% 75%, 100% 100%, 0 100%)',
                    opacity: isLocking ? 0 : 1,
                    transition: 'opacity 0.8s ease-out',
                    transitionDelay: isLocking ? '2.2s' : '0s'
                  }}
                />
              )}
            </g>

            {/* Clean locked state indicator */}
            {isLocked && (
              <g className="animate-fade-in-scale">
                <circle
                  cx="140"
                  cy="160"
                  r="3"
                  fill="url(#padlockGradient)"
                  filter="url(#cleanShadow)"
                />
                <rect
                  x="137"
                  y="157"
                  width="6"
                  height="6"
                  rx="1"
                  fill="none"
                  stroke="url(#padlockGradient)"
                  strokeWidth="1"
                  filter="url(#cleanShadow)"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Enhanced loading text */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-wider animate-pulse">
            SafeQuest
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
          <p className="text-lg text-white/80 font-medium animate-fade-in transition-all duration-500">
            {isLocked ? '🔒 Locked & Secured' : isLocking ? 'Locking Mechanism...' : 'Securing Your Adventure...'}
          </p>
        </div>
      </div>
    </div>
  );
};

const LoadingScreen = ({ text = "Crafting your adventure...", onComplete }) => {
  // If onComplete is provided, show the padlock loader
  if (onComplete) {
    return <PadlockLoader onComplete={onComplete} />;
  }
  
  // Otherwise, show the regular loading screen for story generation
  return (
    <div className="text-center space-y-4 animate-fade-in">
      <div className="inline-block p-5 bg-card rounded-full shadow-lg border border-border">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-2xl font-bold text-foreground">
        {text}
      </h2>
    </div>
  );
};

export default LoadingScreen;