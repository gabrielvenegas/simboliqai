import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import QueryClientProvider from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI SVG Logo Generator",
  description: "Create beautiful SVG logos in seconds using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <QueryClientProvider>{children}</QueryClientProvider>
        <Toaster theme="light" richColors />
      </body>
    </html>
  );
}
