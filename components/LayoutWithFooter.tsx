"use client";

import { FooterProvider, useFooterBackground } from "@/lib/FooterContext";
import { Credits } from "@/components/Credits";
import { DARK_BG, TEXT_LIGHT } from "@/lib/theme";

function FooterOrNothing() {
  const { background, foreground } = useFooterBackground();
  if (background === "hidden") return null;
  return (
    <Credits
      style={{
        backgroundColor: background ?? DARK_BG,
        color: foreground ?? TEXT_LIGHT,
      }}
    />
  );
}

export function LayoutWithFooter({ children }: { children: React.ReactNode }) {
  return (
    <FooterProvider>
      <div className="flex-1 flex flex-col border-0 border-b-0 shadow-none min-h-0">{children}</div>
      <FooterOrNothing />
    </FooterProvider>
  );
}
