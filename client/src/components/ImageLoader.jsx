import { useState } from 'react';

export default function ImageLoader({ src, alt, className, fallback }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Loading skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
      )}
      
      {/* Image */}
      {!error && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      
      {/* Fallback */}
      {error && fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream-100">
          {fallback}
        </div>
      )}
    </div>
  );
}
