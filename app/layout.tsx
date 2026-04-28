import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/auth-context";

export const metadata: Metadata = {
  title: {
    default: "Email Agent | AI-Powered Email Personalization Platform",
    template: "%s | Email Agent",
  },
  description: "Transform your email outreach with AI-driven personalization at scale. Generate personalized emails, manage contacts, and track campaign performance.",
  keywords: ["AI email marketing", "personalized email", "email automation", "bulk email", "email campaign", "outreach tool", "email personalization", "AI writing"],
  authors: [{ name: "Email Agent" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://emailagent.com",
    siteName: "Email Agent",
    title: "Email Agent | AI-Powered Email Personalization Platform",
    description: "Transform your email outreach with AI-driven personalization at scale.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Email Agent | AI-Powered Email Personalization",
    description: "Transform your email outreach with AI-driven personalization at scale.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
