"use client";

import { useLocale } from "@/lib/i18n";
import { TEXT_LIGHT } from "@/lib/theme";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="fixed top-4 left-4 z-40 flex items-center gap-1 text-sm font-medium"
      style={{ color: TEXT_LIGHT }}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className="rounded px-2 py-1 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
        style={{
          opacity: locale === "en" ? 1 : 0.6,
          backgroundColor: locale === "en" ? "rgba(255,255,255,0.15)" : "transparent",
        }}
        aria-pressed={locale === "en"}
        aria-label="English"
      >
        EN
      </button>
      <span style={{ opacity: 0.5 }} aria-hidden>|</span>
      <button
        type="button"
        onClick={() => setLocale("es")}
        className="rounded px-2 py-1 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
        style={{
          opacity: locale === "es" ? 1 : 0.6,
          backgroundColor: locale === "es" ? "rgba(255,255,255,0.15)" : "transparent",
        }}
        aria-pressed={locale === "es"}
        aria-label="Español"
      >
        ES
      </button>
    </div>
  );
}
