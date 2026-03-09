"use client";

import { TEXT_LIGHT } from "@/lib/theme";

/** JDP logo + "created by patchank" floating at bottom of screen (e.g. waiting screens). */
export function FloatingCredits() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 w-full flex justify-center items-center gap-2 py-3 z-20 pointer-events-none"
      style={{ color: TEXT_LIGHT, opacity: 0.5 }}
      aria-label="Credits"
    >
      <span className="text-sm">created by patchank</span>
      <img
        src="/logo_jdp.svg"
        alt=""
        className="h-10 w-auto"
        aria-hidden
      />
    </div>
  );
}
