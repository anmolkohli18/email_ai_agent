export interface PostFrontmatter {
  title: string;
  date: string;
  category: 'Personalization' | 'Automation' | 'Strategy';
  excerpt: string;
  tags: string[];
  featured?: boolean;
  image?: string;
  author?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime?: string;
}

export type Category = 'Personalization' | 'Automation' | 'Strategy';
