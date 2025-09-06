'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi, authUtils } from '@/lib/api';
import { DashboardStats, Order, Admin, FileItem } from '@/types';
import { useRouter } from 'next/navigation';
import SmartLoader from '@/components/SmartLoader';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'files'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{type: 'order' | 'file', id: number | string, filename?: string, fileType?: 'images' | 'videos'} | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string}>({type: 'success', message: ''});
  const router = useRouter();

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

  const fetchAdminData = useCallback(async () => {
    try {
      const [adminProfile, stats] = await Promise.all([
        adminApi.getProfile(),
        adminApi.getDashboardStats()
      ]);
      setAdmin(adminProfile);
      setDashboardData(stats);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      handleLogout();
    }
  }, []);

  useEffect(() => {
    if (authUtils.isAuthenticated()) {
      setIsAuthenticated(true);
      fetchAdminData();
    }
  }, [fetchAdminData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      await adminApi.login(loginForm);
      setIsAuthenticated(true);
      await fetchAdminData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setLoginError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authUtils.logout();
    setIsAuthenticated(false);
    setAdmin(null);
    setDashboardData(null);
    setLoginForm({ username: '', password: '' });
  };

  const fetchOrders = async () => {
    try {
      const ordersData = await adminApi.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchFiles = async (type: 'images' | 'videos') => {
    try {
      const filesData = await adminApi.listFiles(type);
      setFiles(filesData.files);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  const showNotificationMessage = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleFileUpload = async (type: 'image' | 'video') => {
    if (!uploadFile) return;

    try {
      if (type === 'image') {
        await adminApi.uploadImage(uploadFile);
      } else {
        await adminApi.uploadVideo(uploadFile);
      }
      showNotificationMessage('success', 'File uploaded successfully!');
      setUploadFile(null);
      fetchFiles(type === 'image' ? 'images' : 'videos');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      showNotificationMessage('error', errorMessage);
    }
  };

  const handleDeleteFile = (type: 'images' | 'videos', filename: string) => {
    setDeleteTarget({ type: 'file', id: filename, filename, fileType: type });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'order') {
        await adminApi.deleteOrder(deleteTarget.id as number);
        showNotificationMessage('success', 'Order deleted successfully!');
        fetchOrders();
      } else if (deleteTarget.type === 'file' && deleteTarget.filename && deleteTarget.fileType) {
        await adminApi.deleteFile(deleteTarget.fileType, deleteTarget.filename);
        showNotificationMessage('success', 'File deleted successfully!');
        fetchFiles(deleteTarget.fileType);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      showNotificationMessage('error', errorMessage);
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await adminApi.updateOrder(orderId, { status: status as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' });
      showNotificationMessage('success', 'Order status updated successfully!');
      fetchOrders();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      showNotificationMessage('error', errorMessage);
    }
  };

  const handleDeleteOrder = (orderId: number) => {
    setDeleteTarget({ type: 'order', id: orderId });
    setShowDeleteModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative w-full max-w-md mx-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">Admin Portal</h1>
              <p className="text-white/70 text-xs sm:text-sm md:text-base">SmartTech E-commerce Dashboard</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4 md:space-y-6">
              <div>
                <label className="block text-white/90 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-xs sm:text-sm md:text-base"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/90 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-xs sm:text-sm md:text-base"
                  required
                />
              </div>
              
              {loginError && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm">
                  {loginError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm md:text-base"
              >
                {loading ? (
                  <SmartLoader variant="compact" message="Logging in..." />
                ) : (
                  <>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-3 sm:mt-4 md:mt-6 text-center">
              <button
                onClick={() => router.push('/')}
                className="text-white/70 hover:text-white transition-colors flex items-center justify-center space-x-1 sm:space-x-2 mx-auto text-xs sm:text-sm md:text-base"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-5 left-5 w-32 h-32 sm:top-10 sm:left-10 sm:w-48 sm:h-48 md:w-72 md:h-72 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute bottom-5 right-5 w-32 h-32 sm:bottom-10 sm:right-10 sm:w-48 sm:h-48 md:w-72 md:h-72 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-cyan-200/10 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-2 sm:py-3 md:py-4 lg:py-6 gap-2 sm:gap-3 md:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">Admin Dashboard</h1>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base">SmartTech Management Portal</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-3 w-full sm:w-auto">
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-white/30 w-full sm:w-auto justify-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px] sm:text-xs md:text-sm font-bold">{admin?.username?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-slate-700 font-medium text-xs sm:text-sm md:text-base truncate max-w-[80px] sm:max-w-[100px] md:max-w-none">Welcome, {admin?.username}</span>
              </div>
              
              <div className="flex space-x-1 sm:space-x-2 w-full sm:w-auto justify-center">
                <button
                  onClick={() => router.push('/')}
                  className="bg-white/60 backdrop-blur-sm border border-white/30 text-slate-700 px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl hover:bg-white/80 transition-all duration-300 flex items-center space-x-1 text-xs sm:text-sm"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="hidden xs:inline">View Site</span>
                  <span className="xs:hidden">Site</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-1 text-xs sm:text-sm"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden xs:inline">Logout</span>
                  <span className="xs:hidden">Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Navigation Tabs */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white/60 backdrop-blur-lg rounded-xl sm:rounded-2xl p-1 sm:p-2 border border-white/30 shadow-lg">
            <nav className="flex flex-wrap gap-1 sm:gap-2 justify-center">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                { key: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { key: 'files', label: 'Files', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key as 'dashboard' | 'orders' | 'files');
                    if (tab.key === 'orders') fetchOrders();
                    if (tab.key === 'files') fetchFiles('images');
                  }}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex-1 min-w-[80px] sm:min-w-[100px] md:min-w-0 justify-center ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span className="hidden xs:inline sm:inline md:inline">{tab.label}</span>
                  <span className="xs:hidden sm:hidden md:hidden">{tab.label.charAt(0)}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
              <div className="group relative">
                <div className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">{dashboardData.total_orders}</div>
                      </div>
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Total Orders</h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-600">All time orders placed</p>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-yellow-600 group-hover:text-yellow-700 transition-colors">{dashboardData.pending_orders}</div>
                      </div>
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-slate-800 group-hover:text-yellow-700 transition-colors">Pending Orders</h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-600">Awaiting confirmation</p>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors">${dashboardData.total_revenue.toLocaleString()}</div>
                      </div>
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-slate-800 group-hover:text-green-700 transition-colors">Total Revenue</h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-600">All time earnings</p>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">{dashboardData.total_customers}</div>
                      </div>
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-slate-800 group-hover:text-purple-700 transition-colors">Total Customers</h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-600">Registered customers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-800">Recent Orders</h3>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50">
                    {dashboardData.recent_orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                        <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-[10px] sm:text-xs">#{order.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-[8px] sm:text-xs md:text-sm">{order.customer.full_name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-medium text-slate-900">{order.customer.full_name}</div>
                              <div className="text-[10px] sm:text-xs text-slate-500 hidden md:block">{order.customer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                          <div className="text-sm sm:text-base md:text-lg font-bold text-green-600">${order.total_price.toLocaleString()}</div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
                            'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 sm:mr-2 ${
                              order.status === 'pending' ? 'bg-yellow-500' :
                              order.status === 'confirmed' ? 'bg-blue-500' :
                              order.status === 'shipped' ? 'bg-purple-500' :
                              order.status === 'delivered' ? 'bg-green-500' :
                              'bg-red-500'
                            }`}></div>
                            <span className="hidden xs:inline sm:inline md:inline">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                            <span className="xs:hidden sm:hidden md:hidden">{order.status.charAt(0).toUpperCase()}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-800">Order Management</h3>
                </div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold self-start sm:self-auto">
                  {orders.length} orders
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-[10px] sm:text-xs md:text-sm">#{order.id}</span>
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-slate-900">Order #{order.id}</div>
                            <div className="text-[10px] sm:text-xs text-slate-500">{new Date(order.order_date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-[8px] sm:text-xs md:text-sm">{order.customer.full_name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-slate-900">{order.customer.full_name}</div>
                            <div className="text-[10px] sm:text-xs text-slate-500 hidden md:block">{order.customer.city}, {order.customer.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                        <div>
                          <div className="text-xs sm:text-sm text-slate-900">{order.customer.email}</div>
                          <div className="text-[10px] sm:text-xs text-slate-500 hidden md:block">{order.customer.phone}</div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                        <div className="text-sm sm:text-base md:text-lg font-bold text-green-600">${order.total_price.toLocaleString()}</div>
                        <div className="text-[10px] sm:text-xs text-slate-500">Qty: {order.quantity}</div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-white/80 border-2 border-slate-200 rounded-lg sm:rounded-xl px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-slate-300 w-full"
                        >
                          <option value="pending">🕐 Pending</option>
                          <option value="confirmed">✅ Confirmed</option>
                          <option value="shipped">🚚 Shipped</option>
                          <option value="delivered">📦 Delivered</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                        <div className="flex gap-1 sm:gap-2">
                          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-1">
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="hidden xs:inline">View</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-1"
                          >
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="hidden xs:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {orders.length === 0 && (
              <div className="text-center py-4 sm:py-6 md:py-8 lg:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-medium text-slate-900 mb-1 sm:mb-2">No orders found</h3>
                <p className="text-slate-500 text-xs sm:text-sm md:text-base">Orders will appear here once customers start placing them.</p>
              </div>
            )}
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Upload Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-3 sm:p-4 md:p-6 lg:p-8">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 md:mb-6">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-800">File Upload</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="border-2 border-dashed border-slate-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 text-center hover:border-blue-400 transition-colors duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="block w-full text-[10px] sm:text-xs md:text-sm text-slate-500 file:mr-1 sm:file:mr-2 md:file:mr-4 file:py-1 sm:file:py-1.5 md:file:py-2 file:px-2 sm:file:px-3 md:file:px-4 file:rounded-lg sm:file:rounded-xl file:border-0 file:text-[10px] sm:file:text-xs md:file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white hover:file:from-blue-600 hover:file:to-purple-600 file:transition-all file:duration-300 file:shadow-lg hover:file:shadow-xl file:transform hover:file:-translate-y-0.5"
                  />
                  <p className="text-slate-500 text-[10px] sm:text-xs md:text-sm mt-2">Choose files to upload (images or videos)</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                  <button
                    onClick={() => handleFileUpload('image')}
                    disabled={!uploadFile}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Upload as Image</span>
                  </button>
                  <button
                    onClick={() => handleFileUpload('video')}
                    disabled={!uploadFile}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Upload as Video</span>
                  </button>
                </div>
              </div>
            </div>

            {/* File Management */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-800">File Management</h3>
                  </div>
                  <div className="flex gap-1 sm:gap-2 md:gap-3">
                    <button
                      onClick={() => fetchFiles('images')}
                      className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-1"
                    >
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Images</span>
                    </button>
                    <button
                      onClick={() => fetchFiles('videos')}
                      className="bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-1"
                    >
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Videos</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                {files.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                    {files.map((file) => (
                      <div key={file.filename} className="group bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors text-xs sm:text-sm md:text-base">{file.filename}</p>
                            <p className="text-slate-500 text-[10px] sm:text-xs md:text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-1 sm:gap-2">
                          <a
                            href={`${API_BASE_URL}${file.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-500 text-white px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 rounded-lg text-[10px] sm:text-xs font-medium hover:bg-blue-600 transition-all duration-300 text-center flex items-center justify-center space-x-1"
                          >
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>View</span>
                          </a>
                          <button
                            onClick={() => handleDeleteFile(file.type, file.filename)}
                            className="flex-1 bg-red-500 text-white px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 rounded-lg text-[10px] sm:text-xs font-medium hover:bg-red-600 transition-all duration-300 flex items-center justify-center space-x-1"
                          >
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 sm:py-6 md:py-8 lg:py-12">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-medium text-slate-900 mb-1 sm:mb-2">No files found</h3>
                    <p className="text-slate-500 text-xs sm:text-sm md:text-base">Upload some files to get started with file management.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20 max-w-xs sm:max-w-md w-full mx-2 sm:mx-4 transform animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-sm sm:text-base md:text-xl font-bold text-slate-800 mb-1 sm:mb-2">Confirm Deletion</h3>
              <p className="text-slate-600 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">
                {deleteTarget?.type === 'order' 
                  ? 'Are you sure you want to delete this order? This action cannot be undone.'
                  : `Are you sure you want to delete ${deleteTarget?.filename}? This action cannot be undone.`
                }
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 bg-slate-200/80 backdrop-blur-sm text-slate-700 py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-300/80 transition-all duration-300 text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs sm:text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Notification */}
      {showNotification && (
        <div className="fixed top-2 sm:top-4 md:top-6 right-2 sm:right-4 md:right-6 z-50 transform animate-in slide-in-from-right-full duration-300">
          <div className={`bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-2xl border border-white/20 flex items-center space-x-2 sm:space-x-3 min-w-[200px] sm:min-w-[280px] md:min-w-[300px] ${
            notification.type === 'success' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
          }`}>
            <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
              notification.type === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}>
              {notification.type === 'success' ? (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-xs sm:text-sm md:text-base ${
                notification.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {notification.type === 'success' ? 'Success!' : 'Error!'}
              </p>
              <p className="text-slate-600 text-[10px] sm:text-xs md:text-sm">{notification.message}</p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 sm:p-1 rounded-full hover:bg-slate-100/50 transition-colors"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}