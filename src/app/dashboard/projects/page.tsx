'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string;
}

export default function Projects() {
  // State to store fetched data
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div>
      <h1 className="text-2xl text-center font-bold mb-8">Projects</h1>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg">
            <Link href={`/dashboard/projects/${project.id}`} className="block">
              <CardContent>
                <div className="flex flex-col cursor-pointer">
                  <div className="flex justify-center items-center mb-4">
                    <p className="font-semibold text-lg">{project.name}</p>
                  </div>
                  <p>{project.description}</p>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
        </div>
      </>
      )}
    </div>
  );
}