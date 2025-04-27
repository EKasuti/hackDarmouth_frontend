'use client';

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Project } from "@/app/types/project";

export default function Projects() {
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

  function truncateText(text: string, wordLimit: number) {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  }

  return (
    <div>
      <h1 className="text-2xl text-center font-bold mb-8">Projects</h1>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg h-full flex flex-col justify-between">
              <Link href={`/dashboard/projects/${project.id}`} className="block h-full">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex-grow">
                    <h2 className="font-semibold text-lg text-center mb-2">{project.title}</h2>
                    <p className="text-gray-600 text-sm">
                      {truncateText(project.description, 20)}
                    </p>
                  </div>

                  {/* <div className="mt-6 text-xs text-gray-500 text-center">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </div> */}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
