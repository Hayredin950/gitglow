import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitGlow ✨ — Polish Your GitHub Profile with AI",
  description:
    "Transform your GitHub profile from empty to elite in 3 minutes. AI-generated README, projects, contribution history, and more. 100% free.",
  openGraph: {
    title: "GitGlow ✨ — Polish Your GitHub Profile with AI",
    description: "Transform your GitHub profile in 3 minutes with AI.",
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitGlow ✨",
    description: "Transform your GitHub profile in 3 minutes with AI.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-[#09090b] text-zinc-50 antialiased">
          <SessionProvider>{children}</SessionProvider>
        </body>
    </html>
  );
}
