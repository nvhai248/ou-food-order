import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import MyProvider from "@/providers/custom";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ou Food Order",
  description: "Food order",
  icons: "/icon.png",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <MyProvider>
          {children}
          <Toaster />
        </MyProvider>
      </body>
    </html>
  );
}
