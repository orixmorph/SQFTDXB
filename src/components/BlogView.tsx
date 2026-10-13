import React, { useState } from 'react';
import { BlogPost, blogPosts } from '../data/blogData';
import {
  BookOpen,
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  Search,
  Sparkles,
  Share2,
  Bookmark,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface BlogViewProps {
  onNavigateToProperties: () => void;
  onOpenListProperty: () => void;
  initialPost?: BlogPost | null;
}

export const BlogView: React.FC<BlogViewProps> = ({
  onNavigateToProperties,
  onOpenListProperty,
  initialPost,
}) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(initialPost || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const categories = ['All', 'Market Insights', 'Secondary Guide', 'Investment', 'Legal & DLD'];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* If an article is open, render Full Article Reader */}
        {selectedPost ? (
          <article className="max-w-4xl mx-auto">
            {/* Back to Blog Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#171717] hover:text-[#CF9F5D] transition-colors mb-8 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all articles & guides</span>
            </button>

            {/* Article Header */}
            <div className="space-y-4 mb-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#F7F7F5] border border-[#EAEAEA] text-xs font-bold text-[#CF9F5D]">
                  {selectedPost.category}
                </span>
                <span className="text-xs text-[#8A8A8A] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedPost.readTime}
                </span>
                <span className="text-xs text-[#8A8A8A]">• {selectedPost.publishedDate}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight leading-tight">
                {selectedPost.title}
              </h1>

              <p className="text-base sm:text-lg text-[#6F6F6F] leading-relaxed">
                {selectedPost.excerpt}
              </p>

              {/* Author & Action Row */}
              <div className="flex items-center justify-between pt-4 border-t border-b border-[#F0F0EE] py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPost.author.avatar}
                    alt={selectedPost.author.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#EAEAEA]"
                  />
                  <div>
                    <div className="text-sm font-bold text-[#171717]">{selectedPost.author.name}</div>
                    <div className="text-xs text-[#6F6F6F]">{selectedPost.author.role} • SQFT DXB</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAEAEA] text-xs font-medium text-[#171717] hover:bg-[#F7F7F5] transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? 'Link Copied!' : 'Share'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="w-full h-80 sm:h-[450px] rounded-3xl overflow-hidden mb-10 border border-[#EAEAEA]">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Body */}
            <div className="space-y-6 text-[#2A2A2A] text-base sm:text-lg leading-relaxed font-normal">
              {selectedPost.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-[#F0F0EE] flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#8A8A8A] uppercase mr-2">Tags:</span>
              {selectedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-md bg-[#F7F7F5] text-xs font-medium text-[#4A4A4A]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Secondary Advisory Card */}
            <div className="mt-12 p-8 rounded-3xl bg-[#FAFAF9] border border-[#EAEAEA] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#CF9F5D] mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Powered by Jamoka Properties • RERA ORN 49679</span>
                </div>
                <h3 className="text-xl font-bold text-[#171717]">
                  Looking for verified ready properties in Dubai?
                </h3>
                <p className="text-xs sm:text-sm text-[#6F6F6F] mt-1">
                  Connect with our team for authenticated secondary inventory and direct title deed advisory.
                </p>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={onNavigateToProperties}
                  className="px-5 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-bold hover:bg-[#2A2A2A] transition-colors"
                >
                  Browse Homes
                </button>
                <button
                  onClick={onOpenListProperty}
                  className="px-5 py-2.5 rounded-xl border border-[#171717] text-[#171717] text-xs font-bold hover:bg-[#171717] hover:text-white transition-colors"
                >
                  List Property
                </button>
              </div>
            </div>
          </article>
        ) : (
          /* Main Blog Feed View */
          <div>
            {/* Header */}
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F5] border border-[#EAEAEA] text-xs font-semibold text-[#171717] mb-3">
                <BookOpen className="w-3.5 h-3.5 text-[#CF9F5D]" />
                <span>Secondary Market Intelligence & Guides</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight leading-tight">
                SQFT DXB Insights & Market Reports
              </h1>
              <p className="text-base sm:text-lg text-[#6F6F6F] mt-4 leading-relaxed">
                Expert analysis, legal step-by-step conveyancing guides, and rental yield breakdowns for ready-to-move secondary properties in Dubai.
              </p>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#F0F0EE]">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#171717] text-white shadow-sm'
                        : 'bg-[#F7F7F5] text-[#6F6F6F] hover:text-[#171717] hover:bg-[#EAEAEA]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search articles or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#FAFAF9] border border-[#EAEAEA] rounded-xl text-xs text-[#171717] placeholder-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#CF9F5D]/30 focus:border-[#CF9F5D]"
                />
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group rounded-3xl bg-white border border-[#EAEAEA] overflow-hidden hover:border-[#CF9F5D]/40 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-white">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-xs text-[#8A8A8A]">
                        <span>{post.publishedDate}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#171717] group-hover:text-[#CF9F5D] transition-colors leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#6F6F6F] line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#F0F0EE] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-[#171717]">
                          {post.author.name}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#171717] group-hover:text-[#CF9F5D] transition-colors">
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
