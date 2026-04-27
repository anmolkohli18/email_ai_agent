# Content Structure

## Frontmatter Schema

All blog posts should include the following frontmatter at the top of the markdown file:

```yaml
---
title: "Post Title"
date: "2026-04-12"
category: "AI" # or "Business" or "Technology"
excerpt: "Brief description for preview and SEO"
tags: ["tag1", "tag2", "tag3"]
featured: true # Optional: display on homepage
image: "/images/post-cover.jpg" # Optional: cover image
author: "Your Name" # Optional
---
```

## Required Fields

- **title**: The post title (displayed as H1)
- **date**: Publication date in YYYY-MM-DD format
- **category**: Must be one of: "AI", "Business", or "Technology"
- **excerpt**: Short description (1-2 sentences) for post previews
- **tags**: Array of tags for categorization and filtering

## Optional Fields

- **featured**: Boolean to display post on homepage featured section
- **image**: Path to cover image (relative to /public)
- **author**: Author name (defaults to site owner)

## File Naming Convention

Use kebab-case for markdown filenames:
- `my-first-ai-post.md`
- `business-strategy-2026.md`
- `understanding-neural-networks.md`

The filename (without .md) becomes the URL slug: `/blog/my-first-ai-post`

## Directory Structure

```
content/
└── posts/
    ├── my-first-ai-post.md
    ├── business-strategy.md
    └── tech-trends-2026.md

public/
├── images/
│   └── post-covers/
├── models/
│   └── *.gltf, *.glb
└── notebooks/
    └── *.ipynb
```
