"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslations } from "@/lib/i18n";
import { ACCENT, ACCENT_BUTTON_TEXT, DARK_BG, TEXT_LIGHT } from "@/lib/theme";

export default function StartPage() {
  const { t } = useTranslations();
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  return (
    <main
      className="flex flex-1 flex-col items-center justify-center p-6 min-h-0 relative"
      style={{ backgroundColor: DARK_BG, color: TEXT_LIGHT }}
    >
      <LanguageSwitcher />
      <button
        type="button"
        onClick={() => setInstructionsOpen(true)}
        className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full border-0 opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        aria-label={t("start.howToPlay")}
      >
        <img
          src="/help_button.svg"
          alt=""
          width={32}
          height={39}
          className="h-8 w-auto opacity-90"
        />
      </button>
      <Logo className="mb-8 w-48 max-w-full" />
      <h1 className="sr-only">Chromoscientia</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/create"
          className="rounded-lg px-6 py-3 text-center font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: ACCENT, color: ACCENT_BUTTON_TEXT }}
        >
          {t("start.createRoom")}
        </Link>
        <Link
          href="/join"
          className="rounded-lg border-2 px-6 py-3 text-center font-medium transition-opacity hover:opacity-90"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          {t("start.joinWithCode")}
        </Link>
      </div>

      {instructionsOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 overflow-auto"
          style={{ backgroundColor: "rgba(0,0,0,0.85)", color: TEXT_LIGHT }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-to-play-title"
        >
          <div className="w-full max-w-md rounded-xl p-6 shadow-xl" style={{ backgroundColor: DARK_BG }}>
            <h2 id="how-to-play-title" className="text-xl font-bold mb-4" style={{ color: ACCENT }}>
              {t("start.howToPlayTitle")}
            </h2>
            <div className="text-sm space-y-4 opacity-90 overflow-y-auto max-h-[70vh] pr-2">
              <section>
                <h3 className="font-semibold mb-1">{t("start.instructions.getEveryoneIn")}</h3>
                <p>{t("start.instructions.getEveryoneInText")}</p>
              </section>
              <section>
                <h3 className="font-semibold mb-1">{t("start.instructions.yourTurnToDescribe")}</h3>
                <p>{t("start.instructions.yourTurnToDescribeText")}</p>
              </section>
              <section>
                <h3 className="font-semibold mb-1">{t("start.instructions.everyoneElseGuesses")}</h3>
                <p>{t("start.instructions.everyoneElseGuessesText")}</p>
              </section>
              <section>
                <h3 className="font-semibold mb-1">{t("start.instructions.whoGetsPoints")}</h3>
                <p>{t("start.instructions.whoGetsPointsText")}</p>
              </section>
              <section>
                <h3 className="font-semibold mb-1">{t("start.instructions.howYouWin")}</h3>
                <p>{t("start.instructions.howYouWinText")}</p>
              </section>
            </div>
            <button
              type="button"
              onClick={() => setInstructionsOpen(false)}
              className="w-full mt-6 rounded-lg px-6 py-3 font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: ACCENT, color: ACCENT_BUTTON_TEXT }}
            >
              {t("start.gotIt")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
