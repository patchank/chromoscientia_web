"use client";

import { TEXT_LIGHT } from "@/lib/theme";

export function Credits({
  style = {},
}: {
  style?: React.CSSProperties;
}) {
  return (
    <footer
      className="w-full flex justify-center items-center gap-2 py-3 shrink-0 border-0 border-t-0"
      style={{ color: TEXT_LIGHT, ...style }}
      aria-label="Credits"
    >
      <span className="text-sm opacity-50">created by patchank</span>
      <img
        src="/logo_jdp.svg"
        alt=""
        className="h-10 w-auto opacity-50"
        aria-hidden
      />
    </footer>
  );
}
