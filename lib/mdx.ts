import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/**
 * Compile MDX content with plugins and custom components
 */
export async function compileMDXContent(source: string, components: Record<string, React.ComponentType<any>>) {
  return await compileMDX({
    source,
    options: {
      parseFrontmatter: false, // Frontmatter already parsed by gray-matter
      mdxOptions: {
        remarkPlugins: [
          remarkGfm, // GitHub Flavored Markdown (tables, strikethrough, etc.)
          remarkMath, // Math support
        ],
        rehypePlugins: [
          rehypeHighlight, // Syntax highlighting
          rehypeSlug, // Add IDs to headings
          [rehypeAutolinkHeadings, { behavior: 'wrap' }], // Add links to headings
          rehypeKatex, // Render math equations
        ],
      },
    },
    components,
  });
}
