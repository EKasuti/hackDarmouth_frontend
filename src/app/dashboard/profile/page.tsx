'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
    const fetchUserProfile = async (email: string) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/profile/${email}`);
        if (!res.ok) {
          throw new Error(`Error fetching profile: ${res.statusText}`);
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchUserProfile(session.user.email);
    }
  }, [session]);

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>You need to sign in to view your profile.</p>;

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!user) return <p>User profile not found.</p>;

  let createdDate = "";
  if (typeof user.createdAt === "string") {
    createdDate = new Date(user.createdAt).toLocaleDateString();
  } else if (user.createdAt?.seconds) {
    createdDate = new Date(user.createdAt.seconds * 1000).toLocaleDateString();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6 shadow-md rounded-2xl">
        <CardHeader className="flex items-center space-x-4">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.username}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300" />
          )}
          <div>
            <CardTitle className="text-2xl">{user.username}</CardTitle>
            <CardDescription className="text-gray-600">{user.role}</CardDescription>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </CardHeader>

        <CardContent className="mt-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">About</h2>
            <p className="text-gray-700">{user.bio || "No bio available."}</p>
          </div>

          <div className="flex space-x-4">
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
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start text-gray-500 text-sm mt-4">
          <p>Member since: {createdDate}</p>
          <p>Specialities: {user.specialities || "None provided"}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
