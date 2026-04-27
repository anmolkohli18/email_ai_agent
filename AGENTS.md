# Wishlist Platform

A modern, clean, and professional web platform for structured content discovery and wishlist management built with Next.js, React, Tailwind CSS, Firebase, and Google Cloud Platform.

## Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS v3.4+** for styling
- Modern responsive design with mobile-first approach

### Backend & Infrastructure
- **Firebase v9+ (Modular SDK)**
  - Firestore for database
  - Firebase Authentication for user management
  - Firebase Storage for file uploads
  - Firebase Analytics for user insights
- **Google Cloud Platform**
  - Cloud Run for deployment (containerized Next.js)
  - Cloud Storage for static assets
  - Secret Manager for environment variables
  - Cloud Build for CI/CD

## Design System

The platform follows a comprehensive design system defined in `design.md` with:
- **Primary Color**: Vibrant blue (#0056D2) for branding and main actions
- **Secondary Color**: Fresh green (#00A86B) for success indicators
- **Accent Color**: Warm orange (#FF6B00) for highlights and CTAs
- Clean, modern aesthetic with generous whitespace
- Accessibility-first (4.5:1 contrast ratio, 44px touch targets)
- Mobile-first responsive behavior

Refer to `design.md` for complete specifications including typography, spacing scale, component patterns, and visual guidelines.

## Project Structure

```
wishlist/
├── app/                    # Next.js App Router pages and layouts
├── components/             # Reusable React components
├── lib/                    # Utilities, configurations, shared logic
│   └── firebase/          # Firebase initialization and helpers
├── types/                  # TypeScript type definitions
├── public/                # Static assets
├── infra/                 # Infrastructure as Code (Terraform)
└── .cursor/rules/         # Cursor AI coding rules
```

## Development Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm package manager
- Firebase CLI (`npm install -g firebase-tools`)
- Google Cloud CLI (optional, for GCP operations)

### Environment Variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Common Commands
```bash
npm install              # Install dependencies
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler checks
```

## Coding Conventions

### File Naming
- **Folders**: kebab-case (`user-profile`)
- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities/Hooks**: camelCase (`useAuth.ts`, `formatDate.ts`)

### Component Guidelines
- Server Components by default (no `"use client"` unless needed)
- Client Components only for interactivity, hooks, and browser APIs
- Use Server Actions for data mutations when possible
- Proper TypeScript typing with interfaces
- Single responsibility principle
- Composable and reusable patterns

### Styling Guidelines
- Tailwind CSS for all styling
- Follow the design system color palette and spacing scale
- Use `cn()` utility for conditional classes
- Group Tailwind classes: layout → spacing → colors → typography → effects
- Extract to components when class strings become too long

### Firebase Patterns
- Import functions individually (modular SDK)
- Initialize Firebase in `lib/firebase/config.ts`
- Use TypeScript types for all Firestore documents
- Server timestamps for createdAt/updatedAt
- Custom hooks for Firebase operations (`useAuthState`, `useFirestoreCollection`)

### Accessibility
- Minimum 4.5:1 contrast ratio for all text
- Proper ARIA attributes on interactive elements
- Focus indicators always visible
- Keyboard navigation support
- Touch targets minimum 44px

## Testing Approach

- Component testing with React Testing Library
- E2E testing with Playwright or Cypress
- Firebase Security Rules testing with emulators
- Type checking with TypeScript
- Linting with ESLint

## Deployment

### Production Deployment
1. Build Next.js app with standalone output mode
2. Containerize with Docker (multi-stage build)
3. Deploy to Google Cloud Run
4. Use Cloud CDN for static assets
5. Environment variables via Secret Manager

### CI/CD Pipeline
- Cloud Build triggers on git push
- Automated tests run in pipeline
- Build Docker image and push to Artifact Registry
- Deploy to Cloud Run with zero-downtime
- Traffic splitting for blue-green deployments

## Code Quality Standards

- **TypeScript**: Strict mode enabled, no implicit any
- **Linting**: Follow ESLint rules, no warnings in production
- **Formatting**: Consistent code style (Prettier recommended)
- **Performance**: Optimize bundle size, use dynamic imports when appropriate
- **Security**: Never expose secrets, validate all user input, use Firebase Security Rules

## Architecture Principles

- Mobile-first responsive design
- Server-first rendering with React Server Components
- Optimistic UI updates for better UX
- Proper error boundaries and loading states
- Scalable Firebase data modeling
- Cost-efficient GCP resource usage
- High availability and disaster recovery planning

## Additional Resources

- Next.js Documentation: https://nextjs.org/docs
- React 19 Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Firebase Documentation: https://firebase.google.com/docs
- GCP Documentation: https://cloud.google.com/docs

---

This AGENTS.md file provides AI coding assistants with comprehensive context about the Wishlist platform project structure, conventions, and best practices.
