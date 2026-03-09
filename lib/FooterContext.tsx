"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type FooterBackgroundValue = string | null | "hidden";

const FooterContext = createContext<{
  background: FooterBackgroundValue;
  setBackground: (value: FooterBackgroundValue) => void;
}>({
  background: null,
  setBackground: () => {},
});

export function useFooterBackground() {
  return useContext(FooterContext);
}

export function FooterProvider({ children }: { children: ReactNode }) {
  const [background, setBackground] = useState<FooterBackgroundValue>(null);
  const setter = useCallback((value: FooterBackgroundValue) => setBackground(value), []);
  return (
    <FooterContext.Provider value={{ background, setBackground: setter }}>
      {children}
    </FooterContext.Provider>
  );
}
