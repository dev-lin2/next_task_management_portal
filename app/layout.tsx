import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Content from "@/components/dashboard/content";
import HydrationZustand from "@/utils/Hydration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Management Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HydrationZustand>
          <div className="flex flex-col h-screen">
            {/* Sticky top bar */}
            <div className="w-full bg-slate-700 flex px-6 sticky top-0 z-10 border-b-2">
              <h1 className="py-4 text-3xl font-bold text-white">Task Management</h1>
            </div>
            {/* Main content area */}
            <Content>{children}</Content>
          </div>
        </HydrationZustand>
      </body>
    </html>
  );
}
