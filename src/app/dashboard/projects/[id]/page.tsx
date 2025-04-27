'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // App Router hook to get route params
import { Card, CardContent } from "@/components/ui/card";

interface Project {
  id: string;
  name: string;
  description: string;
  members?: string[];
  admins?: string[];
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);

    fetch(`/api/projects/${projectId}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to fetch project");
        }
        return res.json();
      })
      .then((data: Project) => {
        setProject(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setProject(null);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <p>Loading project...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>

      <h2 className="font-semibold">Description</h2>
          
          <p className="mb-4">{project.description || "No description provided"}</p>



          <h2 className="font-semibold">Papers</h2>


          <h2 className="font-semibold">Timeline</h2>

          <h2 className="font-semibold">Members</h2>


  
      <div>
            <h2 className="font-semibold">Admins</h2>
            {project.admins?.length ? (
              <ul className="list-disc list-inside">
                {project.admins.map((admin) => (
                  <li key={admin}>{admin}</li>
                ))}
              </ul>
            ) : (
              <p>No admins assigned</p>
            )}
          </div>

          <div className="mt-4">
            <h2 className="font-semibold">Members</h2>
            {project.members?.length ? (
              <ul className="list-disc list-inside">
                {project.members.map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            ) : (
              <p>No members assigned</p>
            )}
          </div>
    </div>
  );
}