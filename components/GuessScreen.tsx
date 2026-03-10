"use client";

import { useMemo, useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { submitGuess } from "@/lib/room";
import { contrastColor, toCssHex, isLighterThan } from "@/lib/colorContrast";
import { useFooterBackground } from "@/lib/FooterContext";
import { useTranslations } from "@/lib/i18n";
import { LeaveGameButton } from "@/components/LeaveGameButton";
import { ColorPicker, randomFullSaturationHex } from "./ColorPicker";

export function GuessScreen({
  roomCode,
  description,
}: {
  roomCode: string;
  description: string;
}) {
  const { t } = useTranslations();
  const [color, setColor] = useState(() => randomFullSaturationHex());
  const [loading, setLoading] = useState(false);

  const bgHex = useMemo(() => toCssHex(color), [color]);
  const textColor = useMemo(() => contrastColor(color), [color]);
  const useDarkLogo = useMemo(() => isLighterThan(bgHex, "#BBBBBB"), [bgHex]);
  const { setBackground } = useFooterBackground();
  useEffect(() => {
    setBackground(bgHex);
    return () => setBackground(null);
  }, [bgHex, setBackground]);

  async function handleChoose() {
    setLoading(true);
    try {
      await submitGuess(roomCode, color);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="flex flex-1 min-h-0 flex-col p-6 transition-colors duration-150"
      style={{ backgroundColor: bgHex, color: textColor }}
    >
      <LeaveGameButton roomCode={roomCode} backgroundColor={bgHex} />
      <div className="w-full flex justify-center shrink-0" style={{ minHeight: 32 }}>
        {useDarkLogo ? (
          <img
            src="/chromoscientia_logo_dark.svg"
            alt="Chromoscientia"
            className="mb-4 h-8 w-auto max-w-full"
            width={322}
            height={32}
          />
        ) : (
          <Logo className="mb-4" />
        )}
      </div>
      <h1 className="text-xl font-bold mb-2">{t("guess.title")}</h1>
      <p className="mb-4 italic opacity-90">
        &ldquo;{description}&rdquo;
      </p>
      <ColorPicker value={color} onChange={setColor} />
      <button
        onClick={handleChoose}
        disabled={loading}
        className="w-full mt-6 rounded-lg px-6 py-3 font-medium disabled:opacity-50 transition-opacity"
        style={{
          backgroundColor: textColor,
          color: bgHex,
        }}
      >
        {t("guess.choose")}
      </button>
    </main>
  );
}
