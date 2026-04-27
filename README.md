# Personal Blog

A modern, feature-rich personal blog built with Next.js, React, Tailwind CSS, and MDX. Write blog posts in Markdown with support for advanced features like Jupyter notebooks, 3D models, YouTube embeds, and academic citations.

## Features

- **Rich Content Support**
  - Markdown/MDX for writing
  - Syntax-highlighted code blocks with copy button
  - Jupyter notebook rendering with download
  - Interactive 3D model viewer (GLTF/GLB)
  - YouTube video embeds
  - Academic paper citations (DOI/arXiv)
  - LaTeX math equations
  - Tables, blockquotes, and more

- **Category Organization**
  - Three main categories: AI, Business, Technology
  - Tag-based filtering
  - Featured posts on homepage
  - Search functionality

- **SEO Optimized**
  - Automatic sitemap generation
  - Open Graph tags
  - Structured data (JSON-LD)
  - Meta descriptions and keywords

- **Modern Design**
  - Responsive mobile-first design
  - Clean, professional aesthetic
  - Tailwind CSS styling
  - Smooth animations and transitions

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **MDX** - Enhanced markdown
- **React Three Fiber** - 3D rendering
- **React Syntax Highlighter** - Code highlighting
- **KaTeX** - Math equations

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal_blog
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Writing Blog Posts

### Create a New Post

1. Create a new `.md` file in `content/posts/` with a kebab-case filename:
```bash
content/posts/my-new-post.md
```

2. Add frontmatter at the top:
```yaml
---
title: "Your Post Title"
date: "2026-04-12"
category: "AI" # or "Business" or "Technology"
excerpt: "Brief description for preview and SEO"
tags: ["tag1", "tag2", "tag3"]
featured: true # Optional
image: "/images/cover.jpg" # Optional
author: "Your Name" # Optional
---
```

3. Write your content using Markdown and custom components

### Available Components

**Code Blocks**
````markdown
```python
def hello():
    print("Hello, world!")
```
````

**Jupyter Notebooks**
```markdown
<JupyterNotebook src="/notebooks/analysis.ipynb" />
```

**3D Models**
```markdown
<ThreeDViewer model="/models/design.gltf" />
```

**YouTube Videos**
```markdown
<YouTubeEmbed id="VIDEO_ID" title="Video Title" />
```

**Paper Citations**
```markdown
<Citation doi="10.1000/xyz" />
<Citation arxiv="2301.12345" />
```

**Math Equations**
```markdown
Inline: $E = mc^2$

Block:
$$
\int_{0}^{\infty} e^{-x} dx = 1
$$
```

### Adding Assets

- **Images**: Place in `public/images/`
- **3D Models**: Place in `public/models/` (.gltf or .glb)
- **Notebooks**: Place in `public/notebooks/` (.ipynb)

## Project Structure

```
personal_blog/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with nav/footer
│   ├── page.tsx           # Homepage
│   ├── blog/
│   │   ├── page.tsx       # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx   # Individual post
│   ├── globals.css        # Global styles
│   ├── sitemap.ts         # SEO sitemap
│   └── robots.ts          # robots.txt
├── components/            # React components
│   ├── MDXComponents.tsx  # Custom MDX components
│   ├── BlogCard.tsx       # Post preview card
│   ├── CodeBlock.tsx      # Syntax highlighting
│   ├── JupyterNotebook.tsx
│   ├── ThreeDViewer.tsx
│   ├── YouTubeEmbed.tsx
│   ├── PaperCitation.tsx
│   ├── Header.tsx         # Navigation
│   └── Footer.tsx
├── content/
│   └── posts/             # Blog post markdown files
├── lib/
│   ├── posts.ts           # Post utilities
│   └── mdx.ts             # MDX compilation
├── types/
│   └── post.ts            # TypeScript types
└── public/                # Static assets
    ├── images/
    ├── models/
    └── notebooks/
```

## Deployment

### Deploying to Vercel (Recommended)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo>
git push -u origin main
```

2. Go to [Vercel](https://vercel.com) and sign in with GitHub

3. Click "New Project" and import your repository

4. Vercel will auto-detect Next.js and configure settings

5. Click "Deploy"

Your blog will be live at `your-project.vercel.app`

### Custom Domain

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Automatic Deployments

Every push to the `main` branch automatically triggers a new deployment on Vercel.

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Customization

### Update Blog Name and Branding

1. Edit `components/Header.tsx` - Change logo text
2. Edit `components/Footer.tsx` - Update footer content
3. Edit `app/layout.tsx` - Update metadata (title, description)

### Change Colors

The design system uses these primary colors:
- Primary Blue: `#0056D2`
- Secondary Green: `#00A86B`
- Accent Orange: `#FF6B00`

Update in components or extend `tailwind.config.ts`

### Add Social Links

Edit `components/Footer.tsx` to update social media links

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For questions or issues, please open an issue on GitHub.
