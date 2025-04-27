'use client';

import { Project, ProjectMember, ProjectTask } from "@/app/types/project";

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
import { ArrowRight, Calendar, Clock, UserPlus } from "lucide-react";
import { Video, FileText, Newspaper, Database, Code as CodeIcon, ExternalLink } from "lucide-react";
import { formatFirebaseTimestamp } from "@/app/utils/utils";

function tillDeadline(timestamp: { seconds: number; nanoseconds: number } | Date): string {
  let deadline: Date;

  if (timestamp instanceof Date) {
    deadline = timestamp;
  } else {
    deadline = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }

  const now = new Date();

  const diffInMs = deadline.getTime() - now.getTime();

  if (diffInMs < 0) {
    return "Deadline passed";
  }

  const diffInSec = diffInMs / 1000;
  const diffInMin = diffInSec / 60;
  const diffInHr = diffInMin / 60;
  const diffInDays = diffInHr / 24;

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


function ProjectTabs({ project }: { project: Project }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categoryColors: Record<string, string> = {
    video:   "bg-[#01693E]",
    paper:   "bg-[#01693E]",
    article: "bg-[#01693E]",
    dataset: "bg-[#01693E]",
    code:    "bg-[#01693E]",
  };

  const categoryIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    video:   Video,
    paper:   FileText,
    article: Newspaper,
    dataset: Database,
    code:    CodeIcon,
  };

  const filteredResources =
    selectedCategory === "all"
      ? project.resources
      : project.resources.filter(r => r.category === selectedCategory);

  return (
    <div>
      <div className="mb-4 flex items-center space-x-2">
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="all">All</option>
          {Object.keys(categoryColors).map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>
  
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map(resource => {
            const bgColor = categoryColors[resource.category] || "bg-gray-300";
            const Icon = categoryIcons[resource.category] || FileText;

        return (
          <div
            key={resource.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Icon
                className={`p-1 rounded-full text-white ${bgColor}`}
              />
              <h3 className="font-medium text-lg">{resource.title}</h3>
            </div>

            {/* ▶ description */}
            {resource.description && (
              <p className="text-sm text-gray-600 mb-3 overflow-hidden line-clamp-3">
                {resource.description}
              </p>
            )}


            {resource.url && (
              <Button asChild size="sm" className="mt-auto self-start">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center px-4"
                >
                  View Resource 
                  <ExternalLink className="ml-1" size={16} />
                </a>
              </Button>
            )}
          </div>
        );
      })}
        </div>
      ) : (
        <p>No resources in this category.</p>
      )}
    </div>
  );
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

  // Adding a new resource
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceCategory, setResourceCategory] = useState("");

  // Adding members to the task
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<ProjectMember[]>([]);

  // Adding members to the project
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [selectedNewMembers, setSelectedNewMembers] = useState<ProjectMember[]>([]);
  const [addingMembers, setAddingMembers] = useState(false);
  const [sortMethod, setSortMethod] = useState<string>("priority");

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
            name: m.username,
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

  // Function to handle resource creation
  async function handleCreateResource() {
    if (!resourceTitle || !resourceCategory) {
      alert("Please fill in all required fields.");
      return;
    }
    
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectID,
          title: resourceTitle,
          description: resourceDescription,
          url: resourceUrl,
          category: resourceCategory,
        }),
      });
  
      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
      }
  
      // Reset form fields
      setResourceTitle("");
      setResourceDescription("");
      setResourceUrl("");
      setResourceCategory("");
  
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to create resource:", error);
      alert("Failed to create resource. Please try again.");
    }
  }

  // Function to add members to the project
  const handleAddMembers = async () => {
    try {
      setAddingMembers(true);
  
      for (const member of selectedNewMembers) {
        await fetch('/api/projects/add_member', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: projectID,
            member
          })
        });
      }
  
      // Update local project state immediately
      setProject((prev) =>
        prev ? { ...prev, members: [...(prev.members || []), ...selectedNewMembers] } : prev
      );
  
      setSelectedNewMembers([]);
      setOpenMemberDialog(false);
    } catch (error) {
      console.error("Error adding members:", error);
    } finally {
      setAddingMembers(false);
    }
  };

  const sortedTasks = project?.tasks
  ? [...project.tasks].sort((a, b) => {
      if (sortMethod === "priority") {
        // Higher priority numbers first (3, 2, 1)
        return (b.priority || 0) - (a.priority || 0);
      } else {
        // Default: sort by deadline
        // Push tasks without deadlines to the very end
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        // Sort by deadline (earliest first)
        const da = a.deadline instanceof Date ? a.deadline.getTime() : new Date(a.deadline).getTime();
        const db = b.deadline instanceof Date ? b.deadline.getTime() : new Date(b.deadline).getTime();
        return da - db;
      }
    })
  : [];

  // function to handle resource
  if (loading) return <div className="text-center mt-10">Loading project...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  if (!project) return <div className="text-center mt-10">No project found.</div>;

  return (
    <div className="px-12">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-2 rounded-xl bg-gray-100 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* overview */}
        <TabsContent value="overview">
          <div className="mt-4">
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

          {/* Timeline */}
          {project.timeline && project.timeline.length > 0 && (
            <div className="mt-10 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center justify-center">
                <Calendar size={20} className="mr-2 text-[#01693E]" />
                Project Timeline
              </h2>
              <div className="relative flex items-center overflow-x-auto pb-12 px-4">
                {/* Horizontal Line */}
                <div className="absolute top-8 left-0 w-full border-t-2 border-[#01693E]/40"></div>

                {/* Timeline Items */}
                {project.timeline.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center relative min-w-[150px] mx-8">
                    {/* Circle */}
                    <div className="w-15 h-15 bg-[#01693E] rounded-full z-10 border-2 border-white flex items-center justify-center">
                      <Clock size={20} className="text-white" />
                    </div>

                    {/* Task Title */}
                    <span className="mt-4 text-center text-sm font-medium">{item.title}</span>
                    {item.deadline && (
                      <span className="text-xs text-gray-500">
                        {/* {item.deadline.toLocaleDateString()} */}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members Section */}
          {project.members && project.members.length > 0 && (
            <div className="mt-12 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center justify-center">
                <UserPlus size={20} className="mr-2 text-[#01693E] text-center" />
                Project Members
              </h2>

              <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Avatar</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Name & Role</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Specialities</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Member since</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {project.members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <Image
                            src={member.avatar_url}
                            alt={member.username || "Member avatar"}
                            width={40}
                            height={40}
                            className="rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium">{member.username}</div>
                          <div className="text-xs text-gray-500">{member.role}</div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{member.email}</td>
                        <td className="px-4 py-4">
                          {member.specialities?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {member.specialities.split(",").map((specialty, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-2 py-1 bg-blue-50 text-[#01693E] rounded-md text-xs"
                                >
                                  {specialty.trim()}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-gray-600">{formatFirebaseTimestamp(member.createdAt)}</td>
                        <td className="px-4 py-4 text-center">
                          <a
                            href={`/dashboard/members`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#01693E] hover:bg-[#01693E] hover:text-white text-[#01693E] transition-colors"
                          >
                            <ArrowRight size={16} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </TabsContent>

        <TabsContent value="resources">
          <div className="mt-4">
            {/* 1. Category filter */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filter</h2>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button>Add Resource</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center">Create New Resource</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Fill in the details below to add a new resource to the project.
                  </DialogDescription>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resourceTitle">Title</Label>
                      <Input
                        id="resourceTitle"
                        value={resourceTitle}
                        onChange={(e) => setResourceTitle(e.target.value)}
                        placeholder="Resource title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resourceDescription">Description</Label>
                      <Input
                        id="resourceDescription"
                        value={resourceDescription}
                        onChange={(e) => setResourceDescription(e.target.value)}
                        placeholder="Brief description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resourceUrl">URL</Label>
                      <Input
                        id="resourceUrl"
                        type="url"
                        value={resourceUrl}
                        onChange={(e) => setResourceUrl(e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resourceCategory">Category</Label>
                      <select
                        id="resourceCategory"
                        value={resourceCategory}
                        onChange={(e) => setResourceCategory(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                        <option value="paper">Paper</option>
                        <option value="dataset">Dataset</option>
                        <option value="code">Code</option>
                      </select>
                    </div>

                    <Button onClick={handleCreateResource} className="w-full mt-2">
                      Create Resource
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ProjectTabs project={project} />
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <label htmlFor="sortMethod" className="text-sm text-gray-600">Sort by:</label>
              <select
                id="sortMethod"
                value={sortMethod}
                onChange={(e) => setSortMethod(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="deadline">Deadline</option>
                <option value="priority">Priority</option>
              </select>
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
                                alt={member.username || "Member avatar"} 
                                width={32}
                                height={32}
                                className="rounded-full object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{member.username}</span>
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

                {sortedTasks.map((task: ProjectTask, index: number) => {
                  // Calculate hours left
                  const deadlineDate = task.deadline ? tillDeadline(task.deadline) : null;
                  const toDeadline = deadlineDate ? deadlineDate + " left" : "No deadline";
                  
                  // Determine priority color
                  let priorityColor = "bg-gray-400"; // default
                  if (task.priority === 2) priorityColor = "bg-orange-400";
                  if (task.priority === 3) priorityColor = "bg-red-500";

                  return (
                    <div key={index} className="rounded-lg shadow-md border border-black/30 p-4 flex gap-4">
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
                        <span className="text-sm text-gray-500">{toDeadline}</span>

                        {/* Assignees */}
                        {task.assignees && task.assignees.length > 0 ? (
                          <div className="flex -space-x-2">
                            {task.assignees.map((assignee, idx) => (
                              <Image
                                key={idx}
                                src={assignee.avatar_url}
                                alt={assignee.username || "assignee"}
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
            <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
            
            {/* Horizontal line */}
            <div className="border-t border-gray-300 mb-4"></div>

            <div className="flex justify-between items-center mb-4">
              <p>Add new member(s) to the project</p>
            <Button variant="outline" onClick={() => setOpenMemberDialog(true)}>Add Members</Button>
            </div>

            <div className="border-t border-gray-300 mb-4"></div>
            
            {/* Dialog for adding members */}
            <Dialog open={openMemberDialog} onOpenChange={setOpenMemberDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center">Add Members to Project</DialogTitle>
                </DialogHeader>
                <DialogDescription>Select members you want to add to this project.</DialogDescription>
                
                <div className="space-y-4 mt-4 max-h-64 overflow-y-auto">
                  {members.map((member) => {
                    const isSelected = selectedNewMembers.some((m) => m.id === member.id);

                    return (
                      <div key={member.id} className="flex items-center gap-3 p-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (isSelected) {
                              setSelectedNewMembers(prev => prev.filter(m => m.id !== member.id));
                            } else {
                              setSelectedNewMembers(prev => [...prev, member]);
                            }
                          }}
                        />
                        <Image 
                          src={member.avatar_url} 
                          alt={member.username || "Member avatar"} 
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{member.username}</span>
                          <span className="text-xs text-gray-500">{member.email}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button 
                  onClick={handleAddMembers}
                  disabled={addingMembers || selectedNewMembers.length === 0}
                  className="w-full mt-4"
                >
                  {addingMembers ? "Adding..." : "Add Selected Members"}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}

