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
