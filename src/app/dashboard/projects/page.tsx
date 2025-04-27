"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/app/types/project";
import { ArrowRight } from "lucide-react";
import projectImage from "@/images/projectFallback.png";

export default function Projects() {
  const { data: session } = useSession();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const truncate = (text: string, words = 24) => {
    const w = text.split(" ");
    return w.length <= words ? text : `${w.slice(0, words).join(" ")} …`;
  };

  const handleCreateProject = async () => {
    if (!title || !description || !startDate || !endDate) {
      setError("All fields are required.");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, startDate, endDate }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const newProject = await res.json();
      console.log("Project created:", newProject);

      setProjects((prev) => [newProject, ...prev]);
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[260px] rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <section className="pl-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-center mb-6">Research Projects</h1>

        {session && (
          <div className="flex justify-center mb-10">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="default">Add Project</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>

                <DialogDescription>Fill in the details below to create a new project.</DialogDescription>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter project title" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter project description" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <DialogFooter>
                  <Button variant="default" onClick={handleCreateProject} disabled={creating}>
                    {creating ? "Creating..." : "Create Project"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((p) => (
          <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="group">
            <Card className="flex flex-col rounded-2xl shadow-sm transition hover:shadow-xl">
              <div
                className="h-40 w-full group-hover:opacity-90 transition-opacity rounded-t-2xl"
                style={{ backgroundImage: `url(${projectImage.src})` }}
              />

              <CardHeader className="pb-2 flex-row items-start justify-between space-y-0">
                <h2 className="text-lg font-semibold leading-tight line-clamp-2 flex-1 pr-2">{p.title}</h2>
                <Badge variant={p.status === "active" ? "default" : "secondary"} className="text-xs capitalize">
                  {p.status}
                </Badge>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                  {truncate(p.description)}
                </p>
              </CardContent>

              <CardFooter className="flex items-center justify-between pt-0 pb-4 px-4">
                <div className="flex -space-x-2 overflow-hidden">
                  {p.members?.slice(0, 3).map((m) => (
                    <Avatar key={m.email} className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-[10px] font-medium bg-slate-200">
                        {m.username?.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {p.members?.length > 3 && (
                    <Avatar className="h-6 w-6 border-2 border-white bg-slate-100 text-xs font-medium">
                      +{p.members.length - 3}
                    </Avatar>
                  )}
                </div>

                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground group-hover:text-indigo-600">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <p className="text-center text-muted-foreground mt-12">No projects found.</p>
      )}
    </section>
  );
}
