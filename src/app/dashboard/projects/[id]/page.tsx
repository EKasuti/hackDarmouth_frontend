'use client';

import { Project, ProjectMember, ProjectResource, ProjectTask } from "@/app/types/project";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import projectImage from "@/images/projectFallback.png"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { DialogDescription } from "@radix-ui/react-dialog";


function tillDeadline(timestamp: { seconds: number; nanoseconds: number }): string {
  const deadline = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000); // Convert to Date
  const now = new Date(); // Current time

  // Calculate the difference in milliseconds
  const diffInMs = deadline.getTime() - now.getTime();
  
  // If the deadline has already passed
  if (diffInMs < 0) {
    return "Deadline passed";
  }

  const diffInSec = diffInMs / 1000; // Convert to seconds
  const diffInMin = diffInSec / 60; // Convert to minutes
  const diffInHr = diffInMin / 60; // Convert to hours
  const diffInDays = diffInHr / 24; // Convert to days

  // Return in the most appropriate format
  if (diffInDays >= 1) {
    return `${Math.floor(diffInDays)} days`;
  } else if (diffInHr >= 1) {
    return `${Math.floor(diffInHr)} hr ${Math.floor(diffInMin % 60)} min`;
  } else if (diffInMin >= 1) {
    return `${Math.floor(diffInMin)} min`;
  } else {
    return `${Math.floor(diffInSec)} sec`;
  }
}


export default function ProjectPage() {
  const { id: projectID } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Adding a new task
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [timeline, setTimeline] = useState(false);

  // Adding members
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<ProjectMember[]>([]);

  // UseEffect to fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectID}`);
        if (!res.ok) {
          throw new Error("Failed to fetch project");
        }
        const data = await res.json();
        setProject(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (projectID) {
      fetchProject();
    }
  }, [projectID]);

  // UseEffect to fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("/api/members");
        if (!res.ok) {
          throw new Error("Failed to fetch members");
        }
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchMembers();
  }, []);

  // Function to handle task creation
  const handleCreateTask = async () => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectID,
          title,
          description,
          startDate,
          deadline,
          assignees: selectedMembers.map((m) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            role: m.role,
            avatar_url: m.avatar_url,
            specialities: m.specialities,
          })),
          priority,
          timeline,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await res.json();

      // Update the local project state
      setProject((prev) =>
        prev ? { ...prev, tasks: [...prev.tasks, newTask] } : prev
      );

      // If it's a timeline task, also update timeline
      if (timeline) {
        setProject((prev) =>
          prev ? { ...prev, timeline: [...prev.timeline, newTask] } : prev
        );
      }

      setOpenDialog(false);
      setTitle("");
      setDescription("");
      setPriority(0);
      setStartDate(undefined);
      setDeadline(undefined);
      setTimeline(false);

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading project...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  if (!project) return <div className="text-center mt-10">No project found.</div>;


  return (
    <div className="">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* overview */}
        <TabsContent value="overview">
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
            
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: ` url(${projectImage.src})`,
              }}
            />

            {/* Project Title */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-3xl font-bold">{project.title}</h2>
            </div>
          </div>
            <p>{project.description}</p>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Resources</h2>
            {project.resources && project.resources.length > 0 ? (
              <ul className="list-disc list-inside">
                {project.resources.map((resource: ProjectResource, index: number) => (
                  <li key={index}>{resource.title}</li>
                ))}
              </ul>
            ) : (
              <p>No resources added yet.</p>
            )}
          </div>
        </TabsContent>


        <TabsContent value="tasks">
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button >Add Task</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center">Create New Task</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Fill in the details below to create a new task.
                  </DialogDescription>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority (1-3)</Label>
                      <Input
                        type="number"
                        value={priority}
                        onChange={(e) => setPriority(Number(e.target.value))}
                        min={1}
                        max={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={startDate ? startDate.toISOString().split("T")[0] : ""}
                        onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                      {startDate && <p>Selected: {startDate.toDateString()}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Deadline</Label>
                      <Input
                        type="date"
                        value={deadline ? deadline.toISOString().split("T")[0] : ""}
                        onChange={(e) => setDeadline(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                      {deadline && <p>Selected: {deadline.toDateString()}</p>}
                    </div>
                    
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Switch
                        id="timeline"
                        checked={timeline}
                        onCheckedChange={setTimeline}
                      />
                    </div>
                    
                    {/* Adding members */}
                    <div className="space-y-2">
                      <Label>Assign Members</Label>
                      <div className="border rounded-md p-2 max-h-48 overflow-y-auto space-y-2">
                        {members.map((member) => {
                          const isSelected = selectedMembers.some((m) => m.id === member.id);

                          return (
                            <div key={member.id} className="flex items-center gap-3 p-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setSelectedMembers(prev => prev.filter(m => m.id !== member.id));
                                  } else {
                                    setSelectedMembers(prev => [...prev, member]);
                                  }
                                }}
                              />
                              <Image 
                                src={member.avatar_url} 
                                alt={member.name || "Member avatar"} 
                                width={32}
                                height={32}
                                className="rounded-full object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{member.name}</span>
                                <span className="text-xs text-gray-500">{member.email}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Button onClick={handleCreateTask} className="w-full mt-2">
                      Create Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {project.tasks && project.tasks.length > 0 ? (
              <div className="grid gap-4">
                {project.tasks.map((task: ProjectTask, index: number) => {
                  // Calculate hours left
                  const toDeadline = task.deadline
                    ? tillDeadline({ seconds: Math.floor(task.deadline.getTime() / 1000), nanoseconds: (task.deadline.getTime() % 1000) * 1000000 })
                    : "No deadline";
                  
                  // Determine priority color
                  let priorityColor = "bg-gray-400"; // default
                  if (task.priority === 2) priorityColor = "bg-orange-400";
                  if (task.priority === 3) priorityColor = "bg-red-500";

                  return (
                    <div key={index} className="rounded-lg shadow-md border p-4 flex gap-4">
                      {/* First column */}
                      <div className="flex-1 flex items-center gap-4">
                        <div>
                          <div className={`w-4 h-4 rounded-full ${priorityColor}`}></div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{task.title}</h3>
                          <p className="text-gray-600">{task.description}</p>
                        </div>
                      </div>
                  
                      {/* Second column */}
                      <div className="flex flex-col items-end gap-2">
                        {/* Deadline */}
                        <span className="text-sm text-gray-500">{toDeadline} left</span>

                        {/* Assignees */}
                        {task.assignees && task.assignees.length > 0 ? (
                          <div className="flex -space-x-2">
                            {task.assignees.map((assignee, idx) => (
                              <Image
                                key={idx}
                                src={assignee.avatar_url}
                                alt={assignee.name || "assignee"}
                                width={32}
                                height={32}
                                className="rounded-full border-2 border-white object-cover"
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No assignees</span>
                        )}
                      </div>
                    </div>
                  );  
                })}
              </div>
            ) : (
              <p>No resources added yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p>Project settings will go here...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
