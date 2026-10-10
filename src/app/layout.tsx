import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Citi Bike Dock Finder",
  description: "Find the nearest Citi Bike station with a free bike or an open dock.",
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 py-6">
          <header className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight">Citi Bike Dock Finder</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              The nearest stations with a free bike or an open dock, from Citi Bike&apos;s live
              feed.
            </p>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-8 text-xs text-slate-500 dark:text-slate-400">
            Data: Citi Bike public GBFS feed, refreshed every 60 seconds. Not affiliated with Citi
            Bike or Lyft.
          </footer>
        </div>
      </body>
    </html>
  );
}
