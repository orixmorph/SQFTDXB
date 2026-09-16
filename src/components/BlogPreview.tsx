import React from 'react';
import { blogPosts, BlogPost } from '../data/blogData';
import { BookOpen, Clock, ArrowRight, ArrowUpRight } from 'lucide-react';

interface BlogPreviewProps {
  onViewAllBlog: () => void;
  onSelectPost: (post: BlogPost) => void;
}

export const BlogPreview: React.FC<BlogPreviewProps> = ({
  onViewAllBlog,
  onSelectPost,
}) => {
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <section className="w-full py-16 md:py-24 bg-[#FAFAF9] border-b border-[#F0F0EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#171717] border border-[#EAEAEA] mb-2.5">
              <BookOpen className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>Secondary Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171717] tracking-tight">
              Dubai Secondary Market Insights
            </h2>
            <p className="text-sm sm:text-base text-[#6F6F6F] mt-2 max-w-xl">
              Data-backed market analysis, title deed legal guides, and community investment comparisons.
            </p>
          </div>

          <button
            onClick={onViewAllBlog}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#171717] hover:text-[#CF9F5D] transition-colors group cursor-pointer self-start md:self-auto"
          >
            <span>Explore All Guides</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="group bg-white rounded-3xl border border-[#EAEAEA] overflow-hidden hover:shadow-lg hover:border-[#CF9F5D]/50 transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-[#8A8A8A] mb-2">
                    <span>{post.publishedDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#171717] group-hover:text-[#CF9F5D] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#6F6F6F] mt-2 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0F0EE] flex items-center justify-between text-xs">
                  <span className="text-[#8A8A8A] font-medium">{post.author.name}</span>
                  <span className="font-bold text-[#171717] group-hover:text-[#CF9F5D] flex items-center gap-1">
                    Read Guide
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
