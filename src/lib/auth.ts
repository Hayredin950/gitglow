import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Attach GitHub username from our User table
        const dbUser = await db.user.findUnique({ where: { id: user.id } });
        if (dbUser) {
          (session.user as typeof session.user & { username: string; githubToken: string | null }).username = dbUser.username;
          (session.user as typeof session.user & { githubToken: string | null }).githubToken = dbUser.githubToken;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        const ghProfile = profile as unknown as { login: string; id: number; avatar_url: string };
        await db.user.upsert({
          where: { githubId: String(ghProfile.id) },
          create: {
            githubId: String(ghProfile.id),
            username: ghProfile.login,
            email: user.email ?? undefined,
            name: user.name ?? undefined,
            avatar: ghProfile.avatar_url,
            githubToken: account.access_token ?? null,
          },
          update: {
            username: ghProfile.login,
            avatar: ghProfile.avatar_url,
            githubToken: account.access_token ?? null,
          },
        });
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
