import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// next/font downloads Inter at build time and serves it from this site, so there is no
// request to Google when the page loads.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Citi Bike Dock Finder",
  description: "Find the nearest Citi Bike station with a free bike or an open dock.",
};

export const viewport: Viewport = {
  themeColor: "#0e1626",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        suppressHydrationWarning
        className="min-h-dvh bg-page font-sans text-[15px] text-fg antialiased"
      >
        <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 py-6">
          <header className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight">Citi Bike Dock Finder</h1>
            <p className="mt-1 text-sm text-muted">
              The nearest stations with a free bike or an open dock, from Citi Bike&apos;s live
              feed.
            </p>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-8 text-xs text-muted">
            Data: Citi Bike&apos;s public GBFS feed. Counts can be about a minute behind; reload the
            page for the latest. Not affiliated with Citi Bike or Lyft.
          </footer>
        </div>
      </body>
    </html>
  );
}
