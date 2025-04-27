'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface UserProfile {
  avatar_url: string;
  bio: string;
  createdAt: string | { seconds: number };
  email: string;
  github: string;
  id: string;
  linkedin: string;
  role: string;
  specialities: string;
  username: string;
}

export default function Profile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile(id: string) {
      setLoading(true);
      try {
        const res = await fetch(`/api/members/${id}`, {
          cache: "no-store", // ensure fresh data
        });
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data: UserProfile = await res.json();
        setUser(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    if (session && (session.user as any).id) {
      // Assuming your session.user.id contains the Firestore user id
      fetchUserProfile((session.user as any).id);
    }
  }, [session]);

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>You need to sign in to view your profile.</p>;

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!user) return <p>User profile not found.</p>;

  // Handle createdAt timestamp
  let createdDate = "";
  if (typeof user.createdAt === "string") {
    createdDate = new Date(user.createdAt).toLocaleDateString();
  } else if (user.createdAt?.seconds) {
    createdDate = new Date(user.createdAt.seconds * 1000).toLocaleDateString();
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center space-x-6">
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={user.username}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-gray-600">{user.role}</p>
          <p>{user.email}</p>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p>{user.bio || "No bio available."}</p>
      </section>

      <section className="mt-6 flex space-x-6">
        {user.github && (
          <a
            className="text-blue-600 underline"
            href={user.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        )}
        {user.linkedin && (
          <a
            className="text-blue-600 underline"
            href={user.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        )}
      </section>

      <section className="mt-6 text-gray-500 text-sm">
        <p>Member since: {createdDate}</p>
        <p>Specialities: {user.specialities || "None provided"}</p>
      </section>
    </div>
  );
}