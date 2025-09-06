'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { publicApi } from '@/lib/api';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderForm, setOrderForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    special_requirements: '',
    delivery_address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('smarttech_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart || []);
      } catch (error) {
        console.error('Error parsing cart data:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage
  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('smarttech_cart', JSON.stringify(items));
    setCartItems(items);
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    const updatedItems = cartItems.map(item =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedItems);
  };

  const removeItem = (productId: number) => {
    const updatedItems = cartItems.filter(item => item.product.id !== productId);
    saveCart(updatedItems);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit orders for each cart item
      for (const item of cartItems) {
        const orderData = {
          customer: {
            full_name: orderForm.full_name,
            email: orderForm.email,
            phone: orderForm.phone,
            address: orderForm.address,
            city: orderForm.city,
            country: orderForm.country
          },
          product_id: item.product.id,
          quantity: item.quantity,
          special_requirements: orderForm.special_requirements,
          delivery_address: orderForm.delivery_address || orderForm.address
        };
        
        await publicApi.createOrder(orderData);
      }
      
      // Clear cart and show success
      localStorage.removeItem('smarttech_cart');
      setCartItems([]);
      setShowCheckout(false);
      alert('Order placed successfully! You will receive a confirmation email shortly.');
      
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Your Cart is Empty</h1>
            <p className="text-slate-600 text-lg mb-8">Add some amazing SmartTech products to get started!</p>
            <Link
              href="/"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-2">
                Shopping Cart
              </h1>
              <p className="text-slate-600">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              // Safety check to ensure item and item.product exist
              if (!item || !item.product) {
                console.error('Invalid cart item:', item);
                return null;
              }
              
              return (
              <div key={item.product.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <div className="w-full md:w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                    {item.product.images && item.product.images.length > 0 ? (
                      <Image
                        src={`${API_BASE_URL}${item.product.images[0]}`}
                        alt={item.product.name || 'Product image'}
                        width={192}
                        height={192}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{item.product.name || 'Unnamed Product'}</h3>
                        <p className="text-slate-600 text-sm line-clamp-2">{item.product.description || 'No description available'}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="font-semibold text-lg min-w-[2rem] text-center">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                          </svg>
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ${((item.product.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">
                          ${(item.product.price || 0).toLocaleString()} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            }).filter(Boolean)}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">${getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-slate-800">Total</span>
                    <span className="text-lg font-bold text-blue-600">${getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Proceed to Checkout
              </button>
            </div>

            {/* Secure Checkout */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-800">Secure Checkout</h4>
              </div>
              <p className="text-sm text-slate-600">
                Your information is encrypted and secure. We accept all major payment methods.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Checkout
              </h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-slate-400 hover:text-slate-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleOrderSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={orderForm.full_name}
                    onChange={(e) => setOrderForm({...orderForm, full_name: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 bg-white"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={orderForm.email}
                    onChange={(e) => setOrderForm({...orderForm, email: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 bg-white"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 bg-white"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                  <input
                    type="text"
                    value={orderForm.city}
                    onChange={(e) => setOrderForm({...orderForm, city: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 bg-white"
                    placeholder="Enter your city"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Address *</label>
                <textarea
                  required
                  value={orderForm.address}
                  onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 bg-white"
                  rows={3}
                  placeholder="Enter your full address"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                <input
                  type="text"
                  value={orderForm.country}
                  onChange={(e) => setOrderForm({...orderForm, country: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 bg-white"
                  placeholder="Enter your country"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Special Requirements</label>
                <textarea
                  value={orderForm.special_requirements}
                  onChange={(e) => setOrderForm({...orderForm, special_requirements: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 bg-white"
                  rows={3}
                  placeholder="Any special requirements or notes"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Address</label>
                <textarea
                  value={orderForm.delivery_address}
                  onChange={(e) => setOrderForm({...orderForm, delivery_address: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 bg-white"
                  rows={3}
                  placeholder="Leave blank to use address above"
                ></textarea>
              </div>
              
              {/* Order Summary in Modal */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-4 sm:p-6 border border-slate-200">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <span className="text-slate-600 text-sm sm:text-base">{item.product.name} × {item.quantity}</span>
                      <span className="font-semibold text-sm sm:text-base">${((item.product.price || 0) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-300 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">${getTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 bg-slate-200 text-slate-700 py-3 sm:py-4 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Determine the API base URL
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
