"use client";

import { FooterProvider, useFooterBackground } from "@/lib/FooterContext";
import { Credits } from "@/components/Credits";
import { DARK_BG } from "@/lib/theme";

function FooterOrNothing() {
  const { background } = useFooterBackground();
  if (background === "hidden") return null;
  return (
    <Credits
      style={{
        backgroundColor: background ?? DARK_BG,
      }}
    />
  );
}

export function LayoutWithFooter({ children }: { children: React.ReactNode }) {
  return (
    <FooterProvider>
      <div className="flex-1 flex flex-col">{children}</div>
      <FooterOrNothing />
    </FooterProvider>
  );
}
