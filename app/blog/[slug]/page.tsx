import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostBySlug, generateTableOfContents } from '@/lib/posts';
import TableOfContents from '@/components/TableOfContents';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MDXComponents from '@/components/MDXComponents';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const { frontmatter } = post;
  
  return {
    title: frontmatter.title,
    description: frontmatter.excerpt,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      type: 'article',
      publishedTime: frontmatter.date,
      authors: frontmatter.author ? [frontmatter.author] : undefined,
      images: frontmatter.image ? [frontmatter.image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.excerpt,
      images: frontmatter.image ? [frontmatter.image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content, readingTime } = post;
  const toc = generateTableOfContents(content);

  const categoryColors = {
    AI: 'bg-[#7C3AED] text-white',
    Business: 'bg-[#10B981] text-white',
    Technology: 'bg-[#F59E0B] text-white',
  };

  return (
    <article className="max-w-7xl mx-auto px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Article Header */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase ${categoryColors[frontmatter.category]}`}>
              {frontmatter.category}
            </span>
            <span className="text-neutral-500 text-sm">
              {format(new Date(frontmatter.date), 'MMMM d, yyyy')}
            </span>
            {readingTime && (
              <>
                <span className="text-neutral-700">•</span>
                <span className="text-neutral-500 text-sm">{readingTime}</span>
              </>
            )}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
            {frontmatter.title}
          </h1>
          
          <p className="text-2xl text-neutral-400 leading-relaxed mb-8">
            {frontmatter.excerpt}
          </p>
          
          <div className="flex flex-wrap gap-3 mt-8">
            {frontmatter.tags.map((tag) => (
              <span key={tag} className="bg-[#232323] text-neutral-400 px-4 py-2 rounded-full text-sm border border-[#2A2A2A]">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Cover Image */}
        {frontmatter.image && (
          <div className="mb-16 rounded-3xl overflow-hidden border border-[#2A2A2A]">
            <img
              src={frontmatter.image}
              alt={frontmatter.title}
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Table of Contents - Desktop */}
          {toc.length > 0 && (
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className={`prose prose-lg max-w-none ${toc.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={MDXComponents}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Table of Contents - Mobile */}
        {toc.length > 0 && (
          <div className="lg:hidden mt-12">
            <TableOfContents items={toc} />
          </div>
        )}

        {/* Author Section */}
        {frontmatter.author && (
          <div className="mt-20 pt-12 border-t border-[#2A2A2A]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFC700] to-[#FF6B00] flex items-center justify-center text-black font-bold text-xl">
                {frontmatter.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-neutral-500 text-sm uppercase tracking-wider mb-1">Written by</p>
                <p className="text-white font-semibold text-lg">{frontmatter.author}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: frontmatter.title,
            description: frontmatter.excerpt,
            datePublished: frontmatter.date,
            author: {
              '@type': 'Person',
              name: frontmatter.author || 'Blog Author',
            },
            image: frontmatter.image,
          }),
        }}
      />
    </article>
  );
}
