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
        <div className="flex min-h-dvh flex-col">
          <div className="flex-1">{children}</div>
          <footer className="mx-auto w-full max-w-page px-4 pb-6 text-xs text-muted desktop:px-6">
            Data: Citi Bike&apos;s public GBFS feed. Counts can be about a minute behind; reload the
            page for the latest. Not affiliated with Citi Bike or Lyft.
          </footer>
        </div>
      </body>
    </html>
  );
}
