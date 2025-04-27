"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ClipboardList, Activity, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Types
interface Project {
  id: number;
  title: string;
  status: string;
}

// Static notifications and tickets
type Note = { id: number; text: string; time: string };
const piNotes: Note[] = [
  { id: 1, text: "Lab meeting at 3 PM on Friday", time: "2025-04-24" },
  { id: 2, text: "Please review draft of manuscript", time: "2025-04-25" },
];

type TicketItem = { id: number; title: string; status: string };
const tickets: TicketItem[] = [
  { id: 101, title: "Fix data pipeline bug", status: "Open" },
  { id: 102, title: "Update experiment protocol", status: "Completed" },
];

const progressData = [
  { name: "Week 1", progress: 20 },
  { name: "Week 2", progress: 45 },
  { name: "Week 3", progress: 70 },
  { name: "Week 4", progress: 90 },
];

export default function Dashboard() {
  // State for dynamic projects list
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Project[] = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoadingProjects(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* PI Notes & Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell />
              <h2 className="text-lg font-semibold">PI Notes & Lab Communications</h2>
            </div>
            <Button size="sm">View All</Button>
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
      </motion.div>

      {/* Ongoing Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ClipboardList />
              <h2 className="text-lg font-semibold">Ongoing Projects</h2>
            </div>
            <Button size="sm">Add Project</Button>
          </CardHeader>
          <CardContent>
            {loadingProjects ? (
              <div>Loading projects...</div>
            ) : (
              <ul className="space-y-2">
                {projects.map((proj) => (
                  <li key={proj.id} className="flex justify-between">
                    <span>{proj.title}</span>
                    <span className="text-sm text-blue-600">{proj.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Since Last Login */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
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
      </motion.div>

      {/* Tickets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ticket />
              <h2 className="text-lg font-semibold">Ongoing & Recent Tickets</h2>
            </div>
            <Button size="sm">New Ticket</Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tickets.map((ticket) => (
                <li key={ticket.id} className="flex justify-between">
                  <span>{ticket.title}</span>
                  <span className={`text-sm ${ticket.status === 'Open' ? 'text-red-500' : 'text-green-500'}`}>{ticket.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
