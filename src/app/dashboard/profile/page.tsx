"use client";

import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Github, Linkedin } from "lucide-react";

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
        if (!res.ok) throw new Error(`Error fetching profile: ${res.statusText}`);
        setUser(await res.json());
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) fetchUserProfile(session.user.email);
  }, [session]);

  if (status === "loading" || loading)
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Skeleton className="w-full h-[300px] rounded-2xl" />
      </div>
    );

  if (!session) return <p className="text-center mt-10">Please sign in to view your profile.</p>;
  if (error) return <p className="text-center text-red-600 mt-10">Error: {error}</p>;
  if (!user) return <p className="text-center mt-10">User profile not found.</p>;

  const createdDate =
    typeof user.createdAt === "string"
      ? new Date(user.createdAt).toLocaleDateString()
      : user.createdAt?.seconds
      ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
      : "";

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="rounded-2xl shadow-sm">
        {/* Gradient header */}
        <div className="h-24 w-full rounded-t-2xl bg-gradient-to-r from-indigo-500 to-purple-500" />

        <div className="px-6 -mt-16">
          {/* avatar + info grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-6 items-center">
            <div className="flex justify-center lg:justify-start">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={`${user.username}'s avatar`}
                  width={120}
                  height={120}
                  className="rounded-full ring-4 ring-white object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-300 ring-4 ring-white" />
              )}
            </div>

            <div className="space-y-1 text-center lg:text-left">
              <CardTitle className="text-3xl">{user.username}</CardTitle>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {user.role && <Badge>{user.role}</Badge>}
                {user.specialities && <Badge variant="secondary">{user.specialities}</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <CardContent className="mt-8 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-1">About</h2>
            <p className="leading-relaxed">
              {user.bio ? user.bio : <span className="text-muted-foreground">No bio available.</span>}
            </p>
          </section>
        </CardContent>

        <CardFooter className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-sm text-muted-foreground px-6 pb-6">
          <p>Member since&nbsp;<span className="font-medium text-gray-700">{createdDate}</span></p>
          <p className="mt-2 lg:mt-0">
          <div className="flex items-center gap-4">
            {/* github */}
            <a
              href={user.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-indigo-600 transition"
            >
              <Github className="h-5 w-5" />
            </a>

            {/* Linkedin */}
            <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-indigo-600 transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>
          </div>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
