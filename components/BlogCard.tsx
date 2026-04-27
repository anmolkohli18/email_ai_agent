import Link from 'next/link';
import { Post } from '@/types/post';

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const { slug, frontmatter, readingTime } = post;
  const { title, date, category, excerpt, tags, image } = frontmatter;

  const categoryColors = {
    Personalization: 'bg-[#7C3AED] text-white',
    Automation: 'bg-[#10B981] text-white',
    Strategy: 'bg-[#F59E0B] text-white',
  };

  const categoryColor = categoryColors[category] || 'bg-neutral-700 text-white';

  return (
    <Link href={`/blog/${slug}`}>
      <article
        className={`group bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#FFC700]/30 h-full flex flex-col ${
          featured ? 'md:col-span-1' : ''
        }`}
      >
        {/* Image */}
        {image && (
          <div className="aspect-video overflow-hidden bg-[#232323]">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="p-8 flex flex-col flex-grow">
          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${categoryColor}`}
            >
              {category}
            </span>
            {readingTime && (
              <span className="text-neutral-600 text-xs font-medium tracking-wide uppercase">
                {readingTime}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-white mb-4 leading-tight group-hover:text-[#FFC700] transition-colors duration-300 ${
              featured ? 'text-3xl md:text-4xl' : 'text-2xl'
            }`}
          >
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-neutral-400 leading-relaxed mb-6 flex-grow">
            {excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
            <time className="text-neutral-600 text-sm font-medium">
              {new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <span className="text-[#FFC700] text-sm font-semibold tracking-wide group-hover:translate-x-1 transition-transform duration-300">
              READ MORE →
            </span>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-neutral-500 bg-[#232323] px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
