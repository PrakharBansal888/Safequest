import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * VideoBackground Component
 * 
 * A modular, accessible video background component with:
 * - Smooth Framer Motion transitions
 * - Graceful error handling and fallbacks
 * - Topic-specific video rendering
 * - Performance optimizations
 * - Accessibility features
 * - Maintains UI interactivity and pointer events
 */
const VideoBackground = ({ 
  videoSrc, 
  fallbackImageSrc,
  theme = 'default',
  className = '',
  onVideoError,
  onVideoLoad,
  crossfadeDuration = 0.6,
  enableVideoForTheme = null, // Only show video for specific theme
  ...props 
}) => {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Determine if video should be shown for this theme
  const shouldShowVideo = !enableVideoForTheme || enableVideoForTheme === theme;

  // Reset states when video source changes
  useEffect(() => {
    setVideoLoaded(false);
    setVideoError(false);
  }, [videoSrc, theme]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    if (onVideoLoad) onVideoLoad();
  };

  const handleVideoError = (error) => {
    console.warn(`Video failed to load for theme "${theme}":`, error);
    setVideoError(true);
    if (onVideoError) onVideoError(error);
  };

  const handleVideoCanPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(handleVideoError);
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} {...props}>
      <AnimatePresence mode="wait">
        {videoSrc && !videoError && shouldShowVideo && (
          <motion.video
            key={`${theme}-${videoSrc}`}
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
            aria-hidden="true"
            style={{ 
              filter: 'brightness(0.7) contrast(1.1)', // Subtle enhancement for better text overlay
              pointerEvents: 'none' // Ensure video doesn't interfere with UI
            }}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: videoLoaded ? 1 : 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ 
              duration: crossfadeDuration, 
              ease: 'easeInOut',
              scale: { duration: crossfadeDuration * 1.5 }
            }}
            onLoadedData={handleVideoLoad}
            onCanPlay={handleVideoCanPlay}
            onError={handleVideoError}
          />
        )}
        
        {/* Fallback image when video fails, isn't available, or theme doesn't match */}
        {(videoError || !videoSrc || !videoLoaded || !shouldShowVideo) && fallbackImageSrc && (
          <motion.img
            key={`${theme}-fallback`}
            src={fallbackImageSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: crossfadeDuration, ease: 'easeInOut' }}
          />
        )}
        
        {/* Default gradient background if no video or image is available */}
        {(videoError || !videoSrc || !shouldShowVideo) && !fallbackImageSrc && (
          <motion.div
            key={`${theme}-gradient`}
            className={`absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 opacity-80 pointer-events-none z-0`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: crossfadeDuration, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoBackground;