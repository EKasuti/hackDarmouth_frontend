'use client';
import { useSession, signIn, signOut } from "next-auth/react";

export default function CheckAuth() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <>
        <p>Not signed in</p>
        <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="px-4 py-2 bg-blue-500 text-white rounded">
          Sign in with Google
        </button>
      </>
    );
  }
  return (
    <>
      <p>Signed in as {session.user?.email}</p>
      <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded">
        Sign out
      </button>
    </>
  );
}
