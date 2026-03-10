"use client";

import { useTranslations } from "@/lib/i18n";
import { TEXT_LIGHT } from "@/lib/theme";

export function Credits({
  style = {},
}: {
  style?: React.CSSProperties;
}) {
  const { t } = useTranslations();
  const color = style?.color ?? TEXT_LIGHT;
  return (
    <footer
      className="w-full flex justify-center items-center gap-2 py-3 shrink-0 border-0 border-t-0"
      style={{ color: TEXT_LIGHT, ...style }}
      aria-label="Credits"
    >
      <span className="text-sm opacity-50">{t("common.createdBy")}</span>
      <span
        className="shrink-0 opacity-50"
        aria-hidden
        style={{
          display: "inline-block",
          width: 60,
          height: 40,
          backgroundColor: color,
          mask: "url(/logo_jdp.svg) no-repeat center",
          maskSize: "contain",
          WebkitMask: "url(/logo_jdp.svg) no-repeat center",
          WebkitMaskSize: "contain",
        }}
      />
    </footer>
  );
}
