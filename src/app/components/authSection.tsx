'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';

export default function CheckAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // as soon as we're authenticated, redirect
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // optionally show a loading state
  if (status === 'loading') {
    return <p>Checking authentication…</p>;
  }

  // not signed in? show the sign-in button
  if (!session) {
    return (
      <>
        <p>Not signed in</p>
        <button
          onClick={() => signIn('google')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign in with Google
        </button>
      </>
    );
  }

  // if we get here, status === 'authenticated' but
  // we're already redirecting, so render nothing
  return null;
}
