"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ACCENT, ACCENT_BUTTON_TEXT, DARK_BG, TEXT_LIGHT } from "@/lib/theme";

export default function StartPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-6"
      style={{ backgroundColor: DARK_BG, color: TEXT_LIGHT }}
    >
      <Logo className="mb-8 w-48 max-w-full" />
      <h1 className="sr-only">Chromoscientia</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/create"
          className="rounded-lg px-6 py-3 text-center font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: ACCENT, color: ACCENT_BUTTON_TEXT }}
        >
          Create room
        </Link>
        <Link
          href="/join"
          className="rounded-lg border-2 px-6 py-3 text-center font-medium transition-opacity hover:opacity-90"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          Join with code
        </Link>
      </div>
    </main>
  );
}
