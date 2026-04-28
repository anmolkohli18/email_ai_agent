import { getAllPosts } from '@/lib/posts';
import BlogListingClient from './BlogListingClient';
import PublicLayout from '@/components/PublicLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Email Marketing & AI Insights',
  description: 'Learn about email marketing best practices, AI-powered personalization, outreach strategies, and automation tips.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <PublicLayout>
      <BlogListingClient posts={posts} />
    </PublicLayout>
  );
}
