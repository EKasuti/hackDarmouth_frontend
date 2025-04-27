"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Activity, ArrowRight, ArrowUpRight, X, FileText, Database, ExternalLink } from "lucide-react";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProjectResource } from "../types/project";
import Link from "next/link";

// Static notifications and tickets
type Note = { id: number; text: string; time: string };
const piNotes: Note[] = [
  { id: 1, text: "Lab meeting at 3 PM on Friday", time: "2025-04-24" },
  { id: 2, text: "Please review draft of manuscript", time: "2025-04-25" },
];

const progressData = [
  { name: "Week 1", progress: 20 },
  { name: "Week 2", progress: 45 },
  { name: "Week 3", progress: 70 },
  { name: "Week 4", progress: 90 },
];

export default function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user

  const [showWelcome, setShowWelcome] = useState(true);
  const [projectResources, setProjectResources] = useState<ProjectResource[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects/NjBZDOsBF6ft61xM57EY");
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setProjectResources(data?.resources || []);
      } catch (error) {
        console.error("Failed to load projects", error);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="p-6 ">
      {/* Mentor welcome message */}
      {showWelcome && (
        <Card className="shadow-sm rounded-2xl mb-2">
            <CardHeader>
              <div className="flex items-center space-x-1">
                <Avatar>
                  <AvatarFallback className="p-1 bg-blue-600 rounded-lg text-white"> MJ</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <CardTitle className="text-md">Mentor&apos;s Welcome</CardTitle>
                  <p className="text-[14px]">{`Welcome to the team, ${user?.name}! I'm excited to see your contributions to our quantum ML research. The onboarding process will guide you through our methodologies and tools. Feel free to reach out if you have any questions.`}</p>
                </div>
                <button 
                  onClick={() => setShowWelcome(false)}
                  className="flex justify-end p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close welcome message"
                >
                  <X className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </CardHeader>
          </Card>
      )}
      {/* Welcome message */}
      <div className="flex flex-row gap-4 mb-4">
        <Card className="md:col-span-2 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome, {user?.name}</CardTitle>
            <CardDescription className="text-lg">Quantum Machine Learning for Drug Discovery</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">Applying quantum computing algorithms to accelerate drug candidate identification and validation through machine learning models.</p>
            <Button variant="outline" className="w-full md:w-auto">
              <Link href="/dashboard/onboarding">
                <div className="flex items-center">
                  <p>Begin Onboarding</p> 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell />
            <h2 className="text-lg font-semibold">Lab Communications</h2>
          </div>
          <div className="p-1 border rounded-full hover:bg-[#01693E] hover:text-white">
            <ArrowUpRight />
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {piNotes.map((note) => (
              <li key={note.id} className="flex justify-between">
                <span>{note.text}</span>
                <span className="text-xs text-gray-500">{note.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      </div>

      {/* Progress Since Last Login */}
      <Card className="mb-4">
        <CardHeader className="flex items-center space-x-2">
          <Activity />
          <h2 className="text-lg font-semibold">Progress Since Last Login</h2>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommended resources */}
      <Card className="shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
          <CardTitle className="text-xl font-semibold text-gray-900">Recommended Resources</CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectResources.map((resource) => (
              <Card key={resource.id} className="border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {resource.category === "paper" ? (
                        <FileText className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Database className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{resource.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{resource.description}</p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="text-xs h-7 px-2" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <span>View Resource</span>
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
