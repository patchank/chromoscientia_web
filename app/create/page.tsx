"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { createRoom } from "@/lib/room";
import { isFirebaseConfigured } from "@/lib/firebase";
import { ACCENT, ACCENT_BUTTON_TEXT, DARK_BG, ERROR, TEXT_LIGHT } from "@/lib/theme";

export default function CreatePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const configured = isFirebaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const name = nickname.trim();
    if (!name) {
      setError("Enter a nickname");
      return;
    }
    setLoading(true);
    try {
      const code = await createRoom(name);
      router.push(`/room/${code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center p-6"
        style={{ backgroundColor: DARK_BG, color: TEXT_LIGHT }}
      >
        <Logo className="mb-6" />
        <p className="text-center mb-6 opacity-90">
          Firebase is not configured. Add your credentials to .env.local (see .env.example).
        </p>
        <Link href="/" className="underline hover:opacity-80" style={{ color: ACCENT }}>
          Back to start
        </Link>
      </main>
    );
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-6"
      style={{ backgroundColor: DARK_BG, color: TEXT_LIGHT }}
    >
      <Logo className="mb-6" />
      <h1 className="text-xl font-bold mb-6">Create room</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium mb-1 opacity-90">
            Your nickname
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g. Alex"
            className="w-full rounded-lg border-2 px-4 py-3 text-base placeholder:opacity-60"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderColor: "rgba(255,255,255,0.2)",
              color: TEXT_LIGHT,
            }}
            maxLength={20}
            autoFocus
          />
        </div>
        {error && (
          <p className="text-sm" style={{ color: ERROR }}>{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg px-6 py-3 font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: ACCENT, color: ACCENT_BUTTON_TEXT }}
        >
          {loading ? "Creating…" : "Create room"}
        </button>
      </form>
      <Link href="/" className="mt-6 text-sm underline hover:opacity-80" style={{ color: ACCENT }}>
        Back to start
      </Link>
    </main>
  );
}
