"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type FooterBackgroundValue = string | null | "hidden";

const FooterContext = createContext<{
  background: FooterBackgroundValue;
  foreground: string | null;
  setBackground: (value: FooterBackgroundValue) => void;
  setForeground: (value: string | null) => void;
}>({
  background: null,
  foreground: null,
  setBackground: () => {},
  setForeground: () => {},
});

export function useFooterBackground() {
  return useContext(FooterContext);
}

export function FooterProvider({ children }: { children: ReactNode }) {
  const [background, setBackground] = useState<FooterBackgroundValue>(null);
  const [foreground, setForeground] = useState<string | null>(null);
  const setBg = useCallback((value: FooterBackgroundValue) => setBackground(value), []);
  const setFg = useCallback((value: string | null) => setForeground(value), []);
  return (
    <FooterContext.Provider value={{ background, foreground, setBackground: setBg, setForeground: setFg }}>
      {children}
    </FooterContext.Provider>
  );
}
