"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, LogOut } from "lucide-react";

// Pages that render their own nav or don't need the authenticated header
const EXCLUDED = ["/", "/login", "/gallery"];

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Don't show the authenticated header on public pages
  if (EXCLUDED.includes(pathname)) return null;
  // Don't show while session resolves or when not authenticated
  if (status !== "authenticated") return null;

  const user = session.user as {
    name?: string | null;
    image?: string | null;
    username?: string | null;
  };

  return (
    <>
      <div className="h-14" />
      <header className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity">
            <Sparkles className="h-4 w-4 text-blue-400" />
            GitGlow
          </Link>

          <div className="flex items-center gap-3">
            {user.image && (
              <Image
                src={user.image}
                alt={user.username ?? user.name ?? "avatar"}
                width={28}
                height={28}
                className="rounded-full ring-1 ring-zinc-700"
              />
            )}
            <span className="text-sm text-zinc-400 hidden sm:block">
              @{user.username ?? user.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
