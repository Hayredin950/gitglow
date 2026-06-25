import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

// In the v0 preview, AUTH_URL may be hardcoded to localhost:3000 in stored env.
// Override it at module load time so NextAuth uses the real public preview URL.
if (process.env.V0_RUNTIME_URL) {
  process.env.AUTH_URL = process.env.V0_RUNTIME_URL;
} else if (process.env.VERCEL_URL && !process.env.AUTH_URL?.startsWith("https://")) {
  process.env.AUTH_URL = `https://${process.env.VERCEL_URL}`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  basePath: "/api/auth",
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: {
        params: { scope: "read:user user:email repo" },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "github" && profile && user?.id) {
        const gh = profile as unknown as { login: string; id: number; avatar_url: string };
        token.id = user.id;
        token.username = gh.login;
        token.githubToken = account.access_token ?? null;
        token.avatar = gh.avatar_url;

        // Persist the GitHub token and username to the User record so API routes can retrieve them
        if (account.access_token) {
          await db.user.update({
            where: { id: user.id },
            data: {
              githubToken: account.access_token,
              username: gh.login,
            },
          });
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string | undefined) ?? (token.sub ?? "");
        (session.user as any).username = (token.username as string | null | undefined) ?? null;
        (session.user as any).githubToken = (token.githubToken as string | null | undefined) ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
});
