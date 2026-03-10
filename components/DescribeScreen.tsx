"use client";

import { useMemo, useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { submitDescription } from "@/lib/room";
import { contrastColor, toCssHex, isLighterThan } from "@/lib/colorContrast";
import { useFooterBackground } from "@/lib/FooterContext";
import { useTranslations } from "@/lib/i18n";
import { LeaveGameButton } from "@/components/LeaveGameButton";

export function DescribeScreen({
  roomCode,
  referenceColor,
}: {
  roomCode: string;
  referenceColor: string;
}) {
  const { t } = useTranslations();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const bgHex = useMemo(() => toCssHex(referenceColor), [referenceColor]);
  const textColor = useMemo(() => contrastColor(referenceColor), [referenceColor]);
  const useDarkLogo = useMemo(() => isLighterThan(bgHex, "#BBBBBB"), [bgHex]);
  const { setBackground } = useFooterBackground();
  useEffect(() => {
    setBackground(bgHex);
    return () => setBackground(null);
  }, [bgHex, setBackground]);

  async function handleSend() {
    const text = description.trim();
    if (!text) return;
    setLoading(true);
    try {
      await submitDescription(roomCode, text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="flex flex-1 min-h-0 flex-col p-6 pt-10 transition-colors duration-150"
      style={{ backgroundColor: bgHex, color: textColor }}
    >
      <LeaveGameButton roomCode={roomCode} backgroundColor={bgHex} />
      <div className="w-full flex justify-center">
        {useDarkLogo ? (
          <img
            src="/chromoscientia_logo_dark.svg"
            alt="Chromoscientia"
            className="mb-8 h-8 w-auto max-w-full"
            width={322}
            height={32}
          />
        ) : (
          <Logo className="mb-8" />
        )}
      </div>
      <h1 className="text-xl font-bold mb-3">{t("describe.title")}</h1>
      <p className="text-sm mb-8 opacity-90">
        {t("describe.subtitle")}
      </p>
      <label htmlFor="desc" className="block text-sm font-medium mb-2">
        {t("describe.yourDescription")}
      </label>
      <textarea
        id="desc"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t("describe.placeholder")}
        className="w-full rounded-lg border-2 px-4 py-3 text-base min-h-[100px] mb-6 placeholder:opacity-70"
        style={{
          backgroundColor: textColor,
          color: bgHex,
          borderColor: textColor,
        }}
        maxLength={200}
      />
      <button
        onClick={handleSend}
        disabled={loading || !description.trim()}
        className="w-full rounded-lg px-6 py-3 font-medium transition-opacity disabled:opacity-50"
        style={{
          backgroundColor: textColor,
          color: bgHex,
        }}
      >
        {t("describe.send")}
      </button>
    </main>
  );
}
