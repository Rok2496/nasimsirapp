'use client';

import { useState, useEffect } from 'react';
import { publicApi } from '@/lib/api';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import ProductImageGallery from '@/components/ProductImageGallery';
import SmartLoader from '@/components/SmartLoader';

// Determine the API base URL for images and videos
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

export default function Home() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, getCartItemsCount } = useCart();

  // Remove chat-related states and order form states as they're now handled separately

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const products = await publicApi.getProducts();
      if (products.length > 0) {
        setProduct(products[0]);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      setError('Failed to load product information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      // Show success message or notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 md:top-6 md:right-6';
      notification.textContent = 'Product added to cart!';
      document.body.appendChild(notification);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };





  if (loading) {
    return <SmartLoader />;
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Product</h1>
          <p className="text-gray-600 mt-2">{error || 'Product not found'}</p>
          <button 
            onClick={fetchProduct}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-1.5 sm:py-2">
            <div className="flex items-center group">
              <div className="relative">
                <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  SmartTech
                </h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-blue-50 px-2 py-1 rounded-full border border-emerald-200">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-slate-700 font-medium text-xs">📞 01678-134547</span>
              </div>
              
              {/* Cart Button */}
              <Link 
                href="/cart"
                className="relative bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center space-x-1"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="font-medium text-xs">Cart</span>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-pulse">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
              
              <Link 
                href="/admin" 
                className="hidden sm:block bg-gradient-to-r from-slate-600 to-slate-700 text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs"
              >
                Admin
              </Link>
              
              {/* Mobile Admin Button */}
              <Link 
                href="/admin" 
                className="sm:hidden bg-gradient-to-r from-slate-600 to-slate-700 text-white p-1.5 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-1/4 left-1/3 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 mb-4 sm:mb-6 md:mb-8">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 text-[10px] sm:text-xs md:text-sm font-medium">RK3588 Powered • AI Enhanced • 4K Ready</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Interactive
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Smart Board</span>
            </h2>
            
            <p className="text-sm sm:text-base md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-12 max-w-4xl mx-auto text-white/80 leading-relaxed">
              Transform your workspace with our cutting-edge <span className="text-blue-300 font-semibold">RK3588</span> Interactive Smart Board. 
              Perfect for education, business meetings, and collaborative presentations with 
              <span className="text-purple-300 font-semibold"> AI-powered features</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 md:mb-16">
              <button 
                onClick={handleAddToCart}
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-10 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center justify-center space-x-1.5 sm:space-x-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Add to Cart</span>
                </span>
                <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              </button>
              
              <Link 
                href="/cart"
                className="group relative bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-10 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-xl transform hover:-translate-y-1"
              >
                <span className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <span>View Cart ({getCartItemsCount()})</span>
                </span>
              </Link>
            </div>
            
            {/* Floating Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20">
                <div className="text-base sm:text-xl md:text-2xl font-bold text-blue-300">48MP</div>
                <div className="text-white/70 text-[10px] sm:text-xs md:text-sm">AI Camera</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20">
                <div className="text-base sm:text-xl md:text-2xl font-bold text-purple-300">16GB</div>
                <div className="text-white/70 text-[10px] sm:text-xs md:text-sm">RAM</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20">
                <div className="text-base sm:text-xl md:text-2xl font-bold text-cyan-300">4K</div>
                <div className="text-white/70 text-[10px] sm:text-xs md:text-sm">Display</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20">
                <div className="text-base sm:text-xl md:text-2xl font-bold text-emerald-300">Smart</div>
                <div className="text-white/70 text-[10px] sm:text-xs md:text-sm">Touch</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-8 sm:py-12 md:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-16 items-center">
            {/* Product Images */}
            <ProductImageGallery product={product} />

            {/* Product Details */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <div>
                <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-blue-50 border border-blue-200 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 mb-2 sm:mb-3 md:mb-4">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-700 text-[10px] sm:text-xs md:text-sm font-medium">Latest Technology</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 md:mb-6 leading-tight">{product.name}</h3>
                <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">{product.description}</p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-4 md:p-8 rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-200">
                <h4 className="text-base sm:text-lg md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-slate-900 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 mr-1.5 sm:mr-2 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Key Specifications
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-6">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="bg-white p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-slate-200 hover:shadow-md transition-shadow duration-300">
                      <span className="font-semibold text-slate-800 capitalize block mb-1 text-xs sm:text-sm md:text-base">
                        {key.replace('_', ' ')}
                      </span>
                      <span className="text-slate-600 font-medium text-xs sm:text-sm md:text-base">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 md:p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg sm:rounded-xl md:rounded-2xl border border-emerald-200">
                <div className="mb-3 sm:mb-0">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    ${product.price.toLocaleString()}
                  </div>
                  <div className="text-slate-600 font-medium text-xs sm:text-sm md:text-base">Competitive Pricing</div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 justify-center sm:justify-end">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-700 font-semibold text-xs sm:text-sm md:text-base">{product.stock_quantity} units</span>
                  </div>
                  <div className="text-slate-500 text-[10px] sm:text-xs md:text-sm">In Stock</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center space-x-1.5 sm:space-x-2 md:space-x-3"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Add to Cart</span>
                </button>
                
                <Link 
                  href="/cart"
                  className="bg-white border-2 border-blue-600 text-blue-600 py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-1.5 sm:space-x-2 md:space-x-3"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <span>View Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {product.video_url && (
        <section className="py-8 sm:py-12 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 md:mb-16">
              <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 mb-3 sm:mb-4 md:mb-6">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-white/90 text-[10px] sm:text-xs md:text-sm font-medium">Live Demo</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                See It In Action
              </h3>
              <p className="text-sm sm:text-base md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Watch how our Interactive Smart Board transforms presentations, meetings, and educational experiences
              </p>
            </div>
            
            <div className="relative group">
              {/* Video Container */}
              <div className="relative aspect-video rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm bg-white/5">
                <video 
                  controls 
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl md:rounded-3xl"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23grad)'/%3E%3Ctext x='600' y='337.5' font-family='Arial, sans-serif' font-size='48' fill='white' text-anchor='middle' dominant-baseline='middle'%3EInteractive Smart Board Demo%3C/text%3E%3C/svg%3E"
                  onClick={(e) => {
                    const video = e.currentTarget;
                    if (video.muted) {
                      video.muted = false;
                    }
                  }}
                >
                  <source src={`${API_BASE_URL}${product.video_url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 md:w-8 md:h-8 text-white ml-0.5 sm:ml-1 md:ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-1 -left-1 w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 bg-blue-500/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 sm:w-16 sm:h-16 md:w-32 md:h-32 bg-purple-500/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            </div>
            
            {/* Video Features */}
            <div className="mt-6 sm:mt-8 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
              <div className="text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 border border-white/20">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2">4K Quality</h4>
                <p className="text-white/70 text-xs sm:text-sm md:text-base">Crystal clear 4K resolution for stunning visual presentations</p>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 border border-white/20">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2">Touch Interface</h4>
                <p className="text-white/70 text-xs sm:text-sm md:text-base">Intuitive multi-touch interface for seamless interaction</p>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 border border-white/20">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2">Fast Response</h4>
                <p className="text-white/70 text-xs sm:text-sm md:text-base">Lightning-fast response time for real-time collaboration</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-8 sm:py-12 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-5 left-5 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute bottom-5 right-5 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-16">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-white/60 backdrop-blur-sm border border-blue-200/50 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 mb-3 sm:mb-4 md:mb-6">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-700 text-[10px] sm:text-xs md:text-sm font-semibold">Why Choose SmartTech</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent leading-tight">
              Premium Features
            </h3>
            <p className="text-sm sm:text-base md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Experience the perfect blend of cutting-edge technology and intuitive design
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-8 lg:gap-12">
            <div className="group relative">
              <div className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-slate-800 group-hover:text-blue-700 transition-colors">High Performance</h4>
                  <p className="text-slate-600 leading-relaxed mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">RK3588 processor with 16GB RAM for smooth operation and multitasking capabilities.</p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-[10px] sm:text-xs md:text-sm">Learn More</span>
                    <svg className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-slate-800 group-hover:text-purple-700 transition-colors">AI-Powered</h4>
                  <p className="text-slate-600 leading-relaxed mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">48MP AI camera with facial recognition and advanced interaction features.</p>
                  <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-[10px] sm:text-xs md:text-sm">Learn More</span>
                    <svg className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-slate-800 group-hover:text-emerald-700 transition-colors">Secure & Reliable</h4>
                  <p className="text-slate-600 leading-relaxed mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Fingerprint scanner, NFC support, and enterprise-grade security features.</p>
                  <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-[10px] sm:text-xs md:text-sm">Learn More</span>
                    <svg className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Feature Highlights */}
          <div className="mt-6 sm:mt-8 md:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 md:gap-8">
            <div className="text-center group">
              <div className="text-xl sm:text-2xl md:text-4xl font-bold text-blue-600 mb-1 group-hover:scale-110 transition-transform duration-300">16GB</div>
              <div className="text-slate-600 font-medium text-[10px] sm:text-xs md:text-base">RAM Memory</div>
            </div>
            <div className="text-center group">
              <div className="text-xl sm:text-2xl md:text-4xl font-bold text-purple-600 mb-1 group-hover:scale-110 transition-transform duration-300">4K</div>
              <div className="text-slate-600 font-medium text-[10px] sm:text-xs md:text-base">Ultra HD Display</div>
            </div>
            <div className="text-center group">
              <div className="text-xl sm:text-2xl md:text-4xl font-bold text-emerald-600 mb-1 group-hover:scale-110 transition-transform duration-300">48MP</div>
              <div className="text-slate-600 font-medium text-[10px] sm:text-xs md:text-base">AI Camera</div>
            </div>
            <div className="text-center group">
              <div className="text-xl sm:text-2xl md:text-4xl font-bold text-orange-600 mb-1 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-slate-600 font-medium text-[10px] sm:text-xs md:text-base">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-2 left-2 w-10 h-10 sm:w-20 sm:h-20 md:w-40 md:h-40 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl"></div>
            <div className="absolute bottom-2 right-2 w-10 h-10 sm:w-20 sm:h-20 md:w-40 md:h-40 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl"></div>
          </div>
        </div>
        
        <div className="relative py-6 sm:py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-12 mb-6 sm:mb-8 md:mb-12">
              {/* Company Info */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                    SmartTech
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base md:text-lg">Adapting the Future</p>
                </div>
                <p className="text-slate-400 leading-relaxed text-xs sm:text-sm md:text-base">
                  Leading provider of Interactive Smart Board solutions with cutting-edge RK3588 technology, 
                  AI-powered features, and enterprise-grade security.
                </p>
                <div className="flex space-x-2 sm:space-x-3 md:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white">Quick Links</h4>
                <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                  <a href="#features" className="block text-slate-400 hover:text-white transition-colors hover:translate-x-1 duration-300 text-xs sm:text-sm md:text-base">
                    Product Features
                  </a>
                  <a href="#specifications" className="block text-slate-400 hover:text-white transition-colors hover:translate-x-1 duration-300 text-xs sm:text-sm md:text-base">
                    Technical Specs
                  </a>
                  <a href="#support" className="block text-slate-400 hover:text-white transition-colors hover:translate-x-1 duration-300 text-xs sm:text-sm md:text-base">
                    Support Center
                  </a>
                  <a href="#downloads" className="block text-slate-400 hover:text-white transition-colors hover:translate-x-1 duration-300 text-xs sm:text-sm md:text-base">
                    Downloads
                  </a>
                  <a href="#warranty" className="block text-slate-400 hover:text-white transition-colors hover:translate-x-1 duration-300 text-xs sm:text-sm md:text-base">
                    Warranty Info
                  </a>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white">Contact Us</h4>
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm">Phone</p>
                      <p className="text-white font-semibold text-xs sm:text-sm md:text-base">01678-134547</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm">Email</p>
                      <p className="text-white font-semibold text-xs sm:text-sm md:text-base">info@smarttech.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm">Support Hours</p>
                      <p className="text-white font-semibold text-xs sm:text-sm md:text-base">24/7 Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="border-t border-slate-700 pt-4 sm:pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-slate-400 text-center sm:text-left mb-2 sm:mb-0 text-[10px] sm:text-xs md:text-sm">
                © 2024 SmartTech. All rights reserved. | Interactive Smart Board Solutions
              </p>
              <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 text-slate-400 text-[10px] sm:text-xs md:text-sm">
                <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#cookies" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat */}
      <FloatingAIAssistant />
    </div>
  );
}