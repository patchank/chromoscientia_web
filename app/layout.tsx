import type { Metadata, Viewport } from "next";
import { LayoutWithFooter } from "@/components/LayoutWithFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chromoscientia",
  description: "Turn-based color guessing game for 3–8 players",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <LayoutWithFooter>{children}</LayoutWithFooter>
      </body>
    </html>
  );
}
