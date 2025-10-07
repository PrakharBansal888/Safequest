/**
 * Video Configuration for Interest Themes
 * 
 * Centralized configuration for video assets per interest theme.
 * This makes it easy to swap videos by updating paths in one place.
 * 
 * Video files should be placed in: frontend/public/assets/videos/
 * 
 * Supported formats: MP4, WebM, OGG
 * Recommended: MP4 with H.264 codec for broad compatibility
 */

export const VIDEO_CONFIG = {
  space: {
    primary: '/assets/videos/space-adventure.mp4',
    fallback: '/assets/images/space-fallback.jpg',
    alt: 'Space adventure scene with stars and rockets'
  },
  animals: {
    primary: '/assets/videos/animal-friends.mp4',
    fallback: '/assets/images/animals-fallback.jpg',
    alt: 'Peaceful meadow with animals playing'
  },
  sports: {
    primary: '/assets/videos/sports-hero.mp4',
    fallback: '/assets/images/sports-fallback.jpg',
    alt: 'Dynamic sports arena with action scenes'
  },
  tech: {
    primary: '/assets/videos/tech-wizard.mp4',
    fallback: '/assets/images/tech-fallback.jpg',
    alt: 'Futuristic tech environment with digital effects'
  },
  art: {
    primary: '/assets/videos/creative-artist.mp4',
    fallback: '/assets/images/art-fallback.jpg',
    alt: 'Artist studio with colorful paint and brushes'
  },
  nature: {
    primary: '/assets/videos/nature-explorer.mp4',
    fallback: '/assets/images/nature-fallback.jpg',
    alt: 'Serene forest with wildlife and flowing water'
  }
};

/**
 * Get video configuration for a specific theme
 * @param {string} themeId - The interest theme identifier
 * @returns {object} Video configuration object
 */
export const getVideoConfig = (themeId) => {
  return VIDEO_CONFIG[themeId] || {
    primary: null,
    fallback: null,
    alt: 'Interest theme background'
  };
};

/**
 * Check if a video file exists (client-side check)
 * @param {string} videoUrl - URL to check
 * @returns {Promise<boolean>} Whether the video exists and is accessible
 */
export const checkVideoExists = async (videoUrl) => {
  if (!videoUrl) return false;
  
  try {
    const response = await fetch(videoUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Video availability check failed:', error);
    return false;
  }
};

/**
 * Preload videos for better performance
 * @param {string[]} videoUrls - Array of video URLs to preload
 */
export const preloadVideos = (videoUrls) => {
  videoUrls.forEach(url => {
    if (url) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = url;
    }
  });
};

/**
 * Get all available video URLs for preloading
 * @returns {string[]} Array of video URLs
 */
export const getAllVideoUrls = () => {
  return Object.values(VIDEO_CONFIG)
    .map(config => config.primary)
    .filter(Boolean);
};