'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductImageGalleryProps {
  product: Product;
}

// Determine the API base URL for images
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side runtime
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    // Default to Render deployment in production
    if (process.env.NODE_ENV === 'production') {
      return 'https://nasimsir.onrender.com';
    }
  }
  // Server-side or fallback
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<number, boolean>>({});
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});

  // Reset index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageLoadErrors({});
    setImageLoading({});
  }, [product.id]);

  const handleImageLoadStart = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: true }));
  };

  const handleImageLoadComplete = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
    setImageLoadErrors(prev => ({ ...prev, [index]: true }));
  };

  if (!product.images || product.images.length === 0) {
    return (
      <div className="h-64 sm:h-[500px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-inner">
        <div className="text-center">
          <svg className="w-12 h-12 sm:w-20 sm:h-20 text-slate-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-slate-500 font-medium text-base sm:text-lg">No images available</span>
        </div>
      </div>
    );
  }

  // Use the correct base URL for images
  const currentImageSrc = `${API_BASE_URL}${product.images[currentImageIndex]}`;
  const hasLoadError = imageLoadErrors[currentImageIndex];

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-6">
      {/* Main Image Display */}
      <div className="relative h-48 sm:h-64 md:h-80 lg:h-[500px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group bg-gradient-to-br from-slate-50 to-slate-100">
        {imageLoading[currentImageIndex] && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 border-2 sm:border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {!hasLoadError ? (
          <Image
            src={currentImageSrc}
            alt={`${product.name} - Image ${currentImageIndex + 1}`}
            fill
            className={`object-contain transition-opacity duration-300 ${imageLoading[currentImageIndex] ? 'opacity-0' : 'opacity-100'}`}
            onLoadingComplete={() => handleImageLoadComplete(currentImageIndex)}
            onError={() => handleImageError(currentImageIndex)}
            onLoad={() => handleImageLoadStart(currentImageIndex)}
            priority={currentImageIndex === 0}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 sm:h-12 lg:w-16 lg:h-16 text-slate-400 mb-1 sm:mb-2 md:mb-3 lg:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-slate-500 font-medium text-xs sm:text-sm md:text-base lg:text-lg">Failed to load image</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Image Navigation Arrows */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
              className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-1 sm:p-1.5 md:p-2 lg:p-3 rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 group z-20"
              aria-label="Previous image"
            >
              <svg className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 text-slate-700 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => (prev + 1) % product.images.length)}
              className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-1 sm:p-1.5 md:p-2 lg:p-3 rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 group z-20"
              aria-label="Next image"
            >
              <svg className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 text-slate-700 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Image Counter */}
        <div className="absolute top-1 sm:top-2 md:top-4 right-1 sm:right-2 md:right-4 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium z-20">
          {currentImageIndex + 1} / {product.images.length}
        </div>
        
        {/* Zoom Indicator */}
        {!hasLoadError && (
          <div className="absolute bottom-1 sm:bottom-2 md:bottom-4 right-1 sm:right-2 md:right-4 bg-white/80 backdrop-blur-sm text-slate-700 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-2 rounded-full text-[10px] sm:text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 inline mr-0.5 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            <span className="hidden sm:inline">Hover to zoom</span>
            <span className="sm:hidden">Zoom</span>
          </div>
        )}
      </div>
      
      {/* Thumbnail Gallery */}
      {product.images.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-1.5 md:gap-2 lg:gap-3">
          {product.images.map((image, index) => {
            // Use the correct base URL for thumbnails
            const imageSrc = `${API_BASE_URL}${image}`;
            const isCurrent = index === currentImageIndex;
            const hasError = imageLoadErrors[index];
            const isLoading = imageLoading[index];
            
            return (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-10 sm:h-12 md:h-16 lg:h-24 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden transition-all duration-300 ${
                  isCurrent 
                    ? 'ring-1 sm:ring-2 md:ring-4 ring-blue-500 shadow-lg scale-105' 
                    : 'hover:scale-105 hover:shadow-md ring-1 ring-slate-200 sm:ring-transparent hover:ring-slate-300'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                {!hasError ? (
                  <Image
                    src={imageSrc}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoadingComplete={() => handleImageLoadComplete(index)}
                    onError={() => handleImageError(index)}
                    onLoad={() => handleImageLoadStart(index)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <svg className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {isCurrent && !hasError && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 lg:w-3 lg:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
      
      {/* Quick View Options */}
      <div className="flex justify-center space-x-1.5 sm:space-x-2 md:space-x-4">
        <button className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 rounded-lg sm:rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 text-xs sm:text-sm">
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="font-medium">Share</span>
        </button>
        <button className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 rounded-lg sm:rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 text-xs sm:text-sm">
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM15 11a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="font-medium">Full Screen</span>
        </button>
      </div>
    </div>
  );
}
