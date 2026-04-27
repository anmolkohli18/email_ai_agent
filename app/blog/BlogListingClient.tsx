'use client';

import { useState, useMemo } from 'react';
import { Post, Category } from '@/types/post';
import BlogCard from '@/components/BlogCard';

interface BlogListingClientProps {
  posts: Post[];
  initialCategory?: Category;
}

export default function BlogListingClient({
  posts,
  initialCategory,
}: BlogListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>(
    initialCategory || 'All'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const categories: (Category | 'All')[] = ['All', 'Personalization', 'Automation', 'Strategy'];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.frontmatter.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        post.frontmatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.frontmatter.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.frontmatter.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const categoryColors: Record<Category | 'All', string> = {
    All: 'border-[#FFC700] text-[#FFC700]',
    Personalization: 'border-[#7C3AED] text-[#7C3AED]',
    Automation: 'border-[#10B981] text-[#10B981]',
    Strategy: 'border-[#F59E0B] text-[#F59E0B]',
  };

  const categoryBgColors: Record<Category | 'All', string> = {
    All: 'bg-[#FFC700] text-black',
    Personalization: 'bg-[#7C3AED] text-white',
    Automation: 'bg-[#10B981] text-white',
    Strategy: 'bg-[#F59E0B] text-white',
  };

  return (
    <div className="min-h-screen py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-none">
            BLOG
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl">
            Email marketing strategies, AI personalization tips, and outreach best practices.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 ${
                  selectedCategory === category
                    ? categoryBgColors[category]
                    : `bg-[#1A1A1A] ${categoryColors[category]} border-2 hover:bg-[#232323]`
                }`}
              >
                {category === 'All' ? 'ALL POSTS' : category.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1A] border-2 border-[#2A2A2A] focus:border-[#FFC700] text-white placeholder-neutral-600 px-6 py-4 rounded-full transition-all duration-300 outline-none"
            />
            <svg
              className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-neutral-500 mb-8 text-sm tracking-wide">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'POST' : 'POSTS'} FOUND
        </p>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-neutral-600 mb-4">
              <svg
                className="w-20 h-20 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">NO POSTS FOUND</h3>
            <p className="text-neutral-400">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
