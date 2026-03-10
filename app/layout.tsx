import type { Metadata, Viewport } from "next";
import { LocaleProvider } from "@/lib/i18n";
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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <LocaleProvider>
          <LayoutWithFooter>{children}</LayoutWithFooter>
        </LocaleProvider>
      </body>
    </html>
  );
}
