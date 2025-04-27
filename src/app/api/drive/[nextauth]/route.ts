/*import { drive } from "@/lib/google";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await drive.files.list({
      pageSize: 10,
      fields: 'files(id, name)',
    });

    return NextResponse.json({ files: res.data.files });
  } catch (error) {
    console.error("Error fetching files from Drive", error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}
*/

/*
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive.metadata.readonly",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

*/


