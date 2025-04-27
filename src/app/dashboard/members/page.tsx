'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Github, Linkedin } from "lucide-react";
import { formatFirebaseTimestamp } from "@/app/utils/utils";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url: string;
  bio: string;
  role: string;
  createdAt: {
    seconds: number; 
    nanoseconds: number;
  };
  github: string;
  linkedin: string;
  specialities: string;
}

function getInitials(name: string) {
  const names = name.split(' ');
  const initials = names.map((n) => n[0]).join('');
  return initials.toUpperCase();
}

export default function Members() {
  // State to store fetched data
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/members");
        const data = await res.json();
        setMembers(data);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl text-center font-bold mb-8">Team Members</h1>

      {loading ? (
        <p>Loading members...</p>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="hover:shadow-lg">
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex justify-center items-center mb-4">
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url}
                        alt={member.username}
                        className="w-16 h-16 rounded-full object-cover"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"> 
                        {getInitials(member.username)}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-semibold">{member.username}</h2>
                    <p className="text-sm text-gray-600 truncate">{member.email}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm"><strong>Role:</strong> {member.role}</p>
                  <p className="text-sm"><strong>Bio:</strong> {member.bio}</p>
                  <p className="text-sm"><strong>Specialities:</strong> {member.specialities}</p>
                  <p className="text-sm"><strong>Member since:</strong> {formatFirebaseTimestamp(member.createdAt)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {member.github && (
                      <a 
                        href={member.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-900"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-blue-600"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
      )}
    </div>
  );
}