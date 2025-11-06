const PEXELS_API_KEY = 'imY45DES967sZGy0D3e3wz8XAx6iNXvIzdbzmzDSlQPr5OmZlhNtMedH';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

/**
 * Fetch images from Pexels API
 * @param {string} query - Search query
 * @param {number} perPage - Number of images to fetch
 * @returns {Promise<Array>} Array of image objects
 */
export const fetchPexelsImages = async (query, perPage = 10) => {
  try {
    const response = await fetch(
      `${PEXELS_API_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch images from Pexels');
    }

    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error('Error fetching Pexels images:', error);
    return [];
  }
};

/**
 * Fetch curated images from Pexels
 * @param {number} perPage - Number of images to fetch
 * @returns {Promise<Array>} Array of curated image objects
 */
export const fetchCuratedImages = async (perPage = 10) => {
  try {
    const response = await fetch(
      `${PEXELS_API_URL}/curated?per_page=${perPage}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch curated images from Pexels');
    }

    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error('Error fetching curated images:', error);
    return [];
  }
};

/**
 * Get specific image sizes from Pexels photo object
 * @param {Object} photo - Pexels photo object
 * @returns {Object} Object with different image sizes
 */
export const getImageSizes = (photo) => {
  return {
    original: photo.src.original,
    large: photo.src.large,
    medium: photo.src.medium,
    small: photo.src.small,
    portrait: photo.src.portrait,
    landscape: photo.src.landscape,
    tiny: photo.src.tiny,
  };
};
