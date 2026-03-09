"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { joinRoom } from "@/lib/room";
import { isFirebaseConfigured } from "@/lib/firebase";
import { ACCENT, ACCENT_BUTTON_TEXT, DARK_BG, ERROR, TEXT_LIGHT } from "@/lib/theme";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const configured = isFirebaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const c = code.trim().toUpperCase();
    const name = nickname.trim();
    if (!c) {
      setError("Enter room code");
      return;
    }
    if (!name) {
      setError("Enter your nickname");
      return;
    }
    setLoading(true);
    try {
      await joinRoom(c, name);
      router.push(`/room/${c}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.2)",
    color: TEXT_LIGHT,
  };

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
      <h1 className="text-xl font-bold mb-6">Join with code</h1>
      <p className="text-sm mb-4 opacity-90">Enter the room code and your nickname to join.</p>
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-1 opacity-90">
            Room code
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. ABC123"
            className="w-full rounded-lg border-2 px-4 py-3 text-base uppercase placeholder:opacity-60"
            style={inputStyle}
            maxLength={8}
            autoFocus
          />
        </div>
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
            style={inputStyle}
            maxLength={20}
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
          {loading ? "Joining…" : "Join"}
        </button>
      </form>
      <Link href="/" className="mt-6 text-sm underline hover:opacity-80" style={{ color: ACCENT }}>
        Back to start
      </Link>
    </main>
  );
}
