import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Search,
  FileText,
  Globe,
  Sliders,
  Check,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Building2,
} from 'lucide-react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase';
import {
  LandingPageSettings,
  signInWithEmail,
  registerWithEmail,
  resetPassword,
  signInAdmin,
  signOutAdmin,
  checkAndRegisterAdmin,
  subscribeToBlogs,
  saveBlogPost,
  deleteBlogPost,
  seedInitialBlogs,
  subscribeToLandingSettings,
  saveLandingSettings,
  defaultLandingSettings,
} from '../../services/adminService';
import { BlogPost, blogPosts as defaultBlogPosts } from '../../data/blogData';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'landing_pages' | 'blogs';

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Email / Password Form state
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Active navigation tab (Landing Pages & Blogs only)
  const [activeTab, setActiveTab] = useState<TabType>('landing_pages');

  // Real-time collections data
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [landingSettings, setLandingSettings] = useState<LandingPageSettings>(defaultLandingSettings);
  const [savingLanding, setSavingLanding] = useState(false);
  const [landingToast, setLandingToast] = useState(false);

  // Blog editing modal state
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [blogFormSubmitting, setBlogFormSubmitting] = useState(false);
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('All');
  const [blogSearchQuery, setBlogSearchQuery] = useState('');

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          await checkAndRegisterAdmin(user);
        } catch (err) {
          console.warn('[Admin] Profile sync error:', err);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to Firestore collections when logged in
  useEffect(() => {
    if (!currentUser) return;

    const unsubBlogs = subscribeToBlogs((data) => {
      if (data.length === 0) {
        setBlogs(defaultBlogPosts);
      } else {
        setBlogs(data);
      }
    });

    const unsubLanding = subscribeToLandingSettings((data) => {
      setLandingSettings(data);
    });

    return () => {
      unsubBlogs();
      unsubLanding();
    };
  }, [currentUser]);

  if (!isOpen) return null;

  // Handle Email & Password Login / Register
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAuth(true);
    setAuthError(null);
    setAuthNotice(null);

    try {
      if (isRegistering) {
        const user = await registerWithEmail(emailInput, passwordInput);
        await checkAndRegisterAdmin(user);
        setAuthNotice('Admin account registered and logged in successfully!');
      } else {
        const user = await signInWithEmail(emailInput, passwordInput);
        await checkAndRegisterAdmin(user);
      }
    } catch (err: any) {
      console.error('[Admin] Auth error:', err);
      let msg = err.message || 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. If this is your first time, click "Create Admin Account" below.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in with your password.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setAuthError(msg);
    } finally {
      setSubmittingAuth(false);
    }
  };

  // Handle Password Reset
  const handleForgotPassword = async () => {
    if (!emailInput) {
      setAuthError('Please enter your email address first to receive a password reset link.');
      return;
    }
    try {
      await resetPassword(emailInput);
      setAuthNotice(`Password reset instructions sent to ${emailInput}. Check your inbox.`);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send reset email.');
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setSubmittingAuth(true);
    setAuthError(null);
    try {
      const user = await signInAdmin();
      await checkAndRegisterAdmin(user);
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in was cancelled.');
    } finally {
      setSubmittingAuth(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOutAdmin();
      setCurrentUser(null);
    } catch (err) {
      console.error('[Admin] Sign out error:', err);
    }
  };

  // Save Landing Page Settings
  const handleSaveLanding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLanding(true);
    try {
      await saveLandingSettings(landingSettings, currentUser?.email || 'Admin');
      setLandingToast(true);
      setTimeout(() => setLandingToast(false), 4000);
    } catch (err) {
      console.error('[Admin] Error saving landing config:', err);
    } finally {
      setSavingLanding(false);
    }
  };

  // Save Blog Post
  const handleSaveBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title || !editingBlog?.slug) return;
    setBlogFormSubmitting(true);
    try {
      await saveBlogPost(editingBlog as any);
      setIsBlogModalOpen(false);
      setEditingBlog(null);
    } catch (err) {
      console.error('[Admin] Error saving blog post:', err);
    } finally {
      setBlogFormSubmitting(false);
    }
  };

  // Delete Blog Post
  const handleDeleteBlog = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteBlogPost(id);
      } catch (err) {
        console.error('[Admin] Error deleting blog:', err);
      }
    }
  };

  // Seed default blogs
  const handleSeedBlogs = async () => {
    try {
      const count = await seedInitialBlogs();
      alert(`Synchronized ${count} default blog posts to Firebase.`);
    } catch (err) {
      console.error('[Admin] Seed error:', err);
    }
  };

  // Filtered blogs
  const filteredBlogs = blogs.filter((b) => {
    const matchCat = blogCategoryFilter === 'All' || b.category === blogCategoryFilter;
    const matchQuery =
      blogSearchQuery === '' ||
      b.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(blogSearchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[94vh] bg-[#FBFBFA] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#2A2A2A]">
        {/* Top Header Bar */}
        <div className="bg-[#171717] text-white px-6 py-4 flex items-center justify-between border-b border-[#2A2A2A] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#CF9F5D]/20 border border-[#CF9F5D]/40 flex items-center justify-center text-[#CF9F5D]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base text-white">SQFT DXB</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#CF9F5D] text-black">
                  Admin Panel
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Firebase Connected
                </span>
              </div>
              <p className="text-[11px] text-[#A0A0A0]">
                Landing Pages & Blogs Control Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#222222] border border-[#333333]">
                <div className="w-6 h-6 rounded-full bg-[#CF9F5D] text-black font-bold text-xs flex items-center justify-center">
                  {(currentUser.email || 'A')[0].toUpperCase()}
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold text-white block leading-none">
                    {currentUser.email}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-[#CF9F5D] block mt-0.5">
                    Authenticated Admin
                  </span>
                </div>
              </div>
            )}

            {currentUser && (
              <button
                onClick={handleSignOut}
                className="py-1.5 px-3 rounded-xl bg-[#222] hover:bg-[#333] text-[#A0A0A0] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close Admin Panel & Return to Site"
              aria-label="Close admin panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {authLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-10 h-10 border-3 border-[#CF9F5D] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-[#666]">Checking Firebase authentication...</p>
          </div>
        ) : !currentUser ? (
          /* Firebase Email & Password Login / Register Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEAEA] shadow-lg text-left space-y-5">
              <div className="text-center space-y-1.5">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#CF9F5D]/30 flex items-center justify-center mx-auto shadow-2xs">
                  <Lock className="w-7 h-7 text-[#CF9F5D]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#171717] tracking-tight">
                  {isRegistering ? 'Create Admin Account' : 'Admin Login'}
                </h3>
                <p className="text-xs text-[#6F6F6F]">
                  {isRegistering
                    ? 'Enter your email and a password to create an administrator profile on Firebase.'
                    : 'Sign in with your email and password authenticated by Firebase.'}
                </p>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{authNotice}</span>
                </div>
              )}

              <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. info@jamokaproperties.com or your email"
                    className="w-full p-3 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs font-semibold text-[#171717] outline-none focus:border-[#CF9F5D] transition-colors"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider">
                      Password
                    </label>
                    {!isRegistering && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] font-semibold text-[#CF9F5D] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-3 pr-10 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs font-semibold text-[#171717] outline-none focus:border-[#CF9F5D] transition-colors"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#171717] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingAuth}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingAuth ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{isRegistering ? 'Create Admin Account' : 'Sign In to Dashboard'}</span>
                      <ArrowRight className="w-4 h-4 text-[#CF9F5D]" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#EAEAEA]"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-[#8A8A8A]">
                  <span className="bg-white px-2">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={submittingAuth}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FBFBFA] hover:bg-[#F0F0EE] border border-[#EAEAEA] text-[#171717] font-semibold text-xs transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google Account</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setAuthError(null);
                    setAuthNotice(null);
                  }}
                  className="text-xs font-bold text-[#CF9F5D] hover:underline cursor-pointer"
                >
                  {isRegistering
                    ? 'Already have an admin account? Sign In'
                    : 'First time admin? Create an account with your email'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Focused Dashboard: Landing Pages & Blogs Only */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-white border-r border-[#EAEAEA] flex flex-col flex-shrink-0">
              <div className="p-4 space-y-1.5 flex-1">
                <button
                  onClick={() => setActiveTab('landing_pages')}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'landing_pages'
                      ? 'bg-[#171717] text-white shadow-xs'
                      : 'text-[#6F6F6F] hover:bg-[#F7F7F5] hover:text-[#171717]'
                  }`}
                >
                  <Globe className="w-4 h-4 text-[#CF9F5D]" />
                  <span>Landing Pages Control</span>
                </button>

                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'blogs'
                      ? 'bg-[#171717] text-white shadow-xs'
                      : 'text-[#6F6F6F] hover:bg-[#F7F7F5] hover:text-[#171717]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#CF9F5D]" />
                    <span>Blogs Control</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'blogs' ? 'bg-[#333] text-white' : 'bg-[#F0F0EE] text-[#6F6F6F]'}`}>
                    {blogs.length}
                  </span>
                </button>
              </div>

              {/* Bottom Quick Return Link */}
              <div className="p-4 border-t border-[#EAEAEA] bg-[#FBFBFA]">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-[#EAEAEA] hover:border-[#171717] text-xs font-bold text-[#171717] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#CF9F5D]" />
                  <span>Return to Website</span>
                </button>
              </div>
            </div>

            {/* Main Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8 space-y-6">
              {/* TAB 1: LANDING PAGES CONTROL */}
              {activeTab === 'landing_pages' && (
                <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#171717]">Landing Pages Control</h2>
                      <p className="text-xs text-[#6F6F6F]">
                        Customize hero banners, owner promotion headlines, and market guarantees saved directly to Firebase.
                      </p>
                    </div>

                    {landingToast && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                        <Check className="w-3.5 h-3.5" /> Saved to Firebase!
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSaveLanding} className="space-y-6">
                    {/* Section 1: Hero Banner */}
                    <div className="p-5 rounded-2xl bg-white border border-[#EAEAEA] shadow-2xs space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-[#F0F0EE]">
                        <Sliders className="w-4 h-4 text-[#CF9F5D]" />
                        <h3 className="text-sm font-bold text-[#171717]">Hero Section Banner</h3>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                            Main Headline
                          </label>
                          <input
                            type="text"
                            value={landingSettings.heroHeadline}
                            onChange={(e) => setLandingSettings({ ...landingSettings, heroHeadline: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs font-semibold text-[#171717] outline-none focus:border-[#CF9F5D]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                            Hero Supporting Subheadline
                          </label>
                          <textarea
                            rows={3}
                            value={landingSettings.heroSubheadline}
                            onChange={(e) => setLandingSettings({ ...landingSettings, heroSubheadline: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs text-[#171717] outline-none focus:border-[#CF9F5D]"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Owner Sell & Rent CTA Banner */}
                    <div className="p-5 rounded-2xl bg-white border border-[#EAEAEA] shadow-2xs space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F0F0EE]">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#CF9F5D]" />
                          <h3 className="text-sm font-bold text-[#171717]">Sell & Rent Owner Banner</h3>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={landingSettings.bannerEnabled}
                            onChange={(e) => setLandingSettings({ ...landingSettings, bannerEnabled: e.target.checked })}
                            className="rounded accent-[#CF9F5D]"
                          />
                          <span className="text-xs font-bold text-[#171717]">Enable Banner on Homepage</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                            Banner Headline
                          </label>
                          <input
                            type="text"
                            value={landingSettings.bannerTitle}
                            onChange={(e) => setLandingSettings({ ...landingSettings, bannerTitle: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs font-semibold text-[#171717] outline-none focus:border-[#CF9F5D]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                            Banner Subtitle / Value Text
                          </label>
                          <input
                            type="text"
                            value={landingSettings.bannerSubtitle}
                            onChange={(e) => setLandingSettings({ ...landingSettings, bannerSubtitle: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs text-[#171717] outline-none focus:border-[#CF9F5D]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            value={landingSettings.bannerCtaText}
                            onChange={(e) => setLandingSettings({ ...landingSettings, bannerCtaText: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs font-semibold text-[#171717] outline-none focus:border-[#CF9F5D]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Guarantee Copy */}
                    <div className="p-5 rounded-2xl bg-white border border-[#EAEAEA] shadow-2xs space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-[#F0F0EE]">
                        <ShieldCheck className="w-4 h-4 text-[#CF9F5D]" />
                        <h3 className="text-sm font-bold text-[#171717]">Secondary Market Guarantee</h3>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                            Guarantee Title
                          </label>
                          <input
                            type="text"
                            value={landingSettings.guaranteeHeadline}
                            onChange={(e) => setLandingSettings({ ...landingSettings, guaranteeHeadline: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs font-semibold text-[#171717] outline-none focus:border-[#CF9F5D]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                            Inspection & Title Deed Guarantee Copy
                          </label>
                          <textarea
                            rows={2}
                            value={landingSettings.guaranteeText}
                            onChange={(e) => setLandingSettings({ ...landingSettings, guaranteeText: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs text-[#171717] outline-none focus:border-[#CF9F5D]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 4: SEO Metadata */}
                    <div className="p-5 rounded-2xl bg-white border border-[#EAEAEA] shadow-2xs space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-[#F0F0EE]">
                        <Globe className="w-4 h-4 text-[#CF9F5D]" />
                        <h3 className="text-sm font-bold text-[#171717]">SEO & Meta Settings</h3>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                            SEO Meta Title
                          </label>
                          <input
                            type="text"
                            value={landingSettings.metaTitle}
                            onChange={(e) => setLandingSettings({ ...landingSettings, metaTitle: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs font-semibold text-[#171717] outline-none focus:border-[#CF9F5D]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                            SEO Meta Description
                          </label>
                          <textarea
                            rows={2}
                            value={landingSettings.metaDescription}
                            onChange={(e) => setLandingSettings({ ...landingSettings, metaDescription: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs text-[#171717] outline-none focus:border-[#CF9F5D]"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingLanding}
                      className="py-3 px-8 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {savingLanding ? 'Saving to Firebase...' : 'Save Landing Page Changes to Firebase'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: BLOGS CONTROL */}
              {activeTab === 'blogs' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#171717]">Blogs Control</h2>
                      <p className="text-xs text-[#6F6F6F]">
                        Manage articles, investment guides, and secondary market analysis saved in Firebase Firestore.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSeedBlogs}
                        className="py-2.5 px-3 rounded-xl bg-white border border-[#EAEAEA] hover:border-[#CF9F5D] text-xs font-semibold text-[#171717] transition-colors cursor-pointer"
                        title="Seed Default Articles"
                      >
                        Reset / Seed Defaults
                      </button>

                      <button
                        onClick={() => {
                          setEditingBlog({
                            id: `blog-${Date.now()}`,
                            title: '',
                            slug: '',
                            category: 'Market Insights',
                            readTime: '5 min read',
                            publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            author: {
                              name: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'SQFT Advisory',
                              role: 'Senior Market Specialist',
                              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                            },
                            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
                            content: [''],
                            tags: ['Secondary Market', 'Dubai Real Estate'],
                            excerpt: '',
                          });
                          setIsBlogModalOpen(true);
                        }}
                        className="py-2.5 px-4 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-[#CF9F5D]" />
                        <span>Add New Article</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Categories Bar */}
                  <div className="p-3 rounded-2xl bg-white border border-[#EAEAEA] flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search blog articles..."
                        value={blogSearchQuery}
                        onChange={(e) => setBlogSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-[#FBFBFA] border border-[#EAEAEA] rounded-xl text-xs text-[#171717] outline-none focus:border-[#CF9F5D]"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                      {['All', 'Market Insights', 'Secondary Guide', 'Investment', 'Legal & DLD'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setBlogCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                            blogCategoryFilter === cat
                              ? 'bg-[#171717] text-white'
                              : 'bg-[#FBFBFA] text-[#6F6F6F] hover:bg-[#EAEAEA]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Blog Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBlogs.map((blog) => (
                      <div
                        key={blog.id}
                        className="p-4 rounded-2xl bg-white border border-[#EAEAEA] hover:border-[#CF9F5D]/60 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-stone-100">
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold">
                              {blog.category}
                            </span>
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold">
                              Live in Firebase
                            </span>
                          </div>

                          <div>
                            <h3 className="font-extrabold text-sm text-[#171717] line-clamp-2 leading-snug">
                              {blog.title}
                            </h3>
                            <p className="text-xs text-[#6F6F6F] line-clamp-2 mt-1">
                              {blog.excerpt}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-[#F0F0EE] flex items-center justify-between">
                          <span className="text-[11px] text-[#8A8A8A]">
                            {blog.publishedDate}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingBlog(blog);
                                setIsBlogModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-[#F7F7F5] text-[#171717] transition-colors cursor-pointer"
                              title="Edit Article"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id, blog.title)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                              title="Delete Article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Blog Article Editor Modal */}
      {isBlogModalOpen && editingBlog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-[#EAEAEA]">
            <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between bg-[#FBFBFA]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#CF9F5D]" />
                <h3 className="font-extrabold text-sm text-[#171717]">
                  {editingBlog.id && blogs.some((b) => b.id === editingBlog.id) ? 'Edit Blog Article' : 'New Blog Article'}
                </h3>
              </div>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#171717] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBlogSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  value={editingBlog.title || ''}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/[\s_-]+/g, '-')
                      .replace(/^-+|-+$/g, '');
                    setEditingBlog({ ...editingBlog, title, slug });
                  }}
                  placeholder="e.g. Guide to Title Deed Transfers in Dubai 2026"
                  className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs font-bold text-[#171717] outline-none focus:border-[#CF9F5D]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                    Slug / URL Path
                  </label>
                  <input
                    type="text"
                    value={editingBlog.slug || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs text-[#171717] font-mono outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={editingBlog.category || 'Market Insights'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs font-bold text-[#171717] outline-none"
                  >
                    <option value="Market Insights">Market Insights</option>
                    <option value="Secondary Guide">Secondary Guide</option>
                    <option value="Investment">Investment</option>
                    <option value="Legal & DLD">Legal & DLD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={editingBlog.readTime || '5 min read'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs text-[#171717] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                  Excerpt Summary
                </label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  placeholder="Short introductory summary for cards..."
                  className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs text-[#171717] outline-none focus:border-[#CF9F5D]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={editingBlog.image || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs text-[#171717] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                  Article Content (Paragraphs)
                </label>
                <textarea
                  rows={8}
                  value={Array.isArray(editingBlog.content) ? editingBlog.content.join('\n\n') : (editingBlog.content || '')}
                  onChange={(e) => {
                    const paragraphs = e.target.value.split('\n\n').filter((p) => p.trim().length > 0);
                    setEditingBlog({ ...editingBlog, content: paragraphs });
                  }}
                  placeholder="Write article paragraphs separated by double enters..."
                  className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs text-[#171717] outline-none focus:border-[#CF9F5D]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={editingBlog.author?.name || ''}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        author: { ...(editingBlog.author || { role: '', avatar: '' }), name: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs text-[#171717] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={editingBlog.author?.role || ''}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        author: { ...(editingBlog.author || { name: '', avatar: '' }), role: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAEA] text-xs text-[#171717] outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-[#EAEAEA] text-xs font-semibold text-[#171717] hover:bg-[#F7F7F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={blogFormSubmitting}
                  className="py-2.5 px-6 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
                >
                  {blogFormSubmitting ? 'Saving to Firebase...' : 'Save & Publish to Firebase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
