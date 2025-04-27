import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { projectId, title, description, startDate, deadline, assignees, priority, timeline } = body;

    if (!projectId || !title || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return new NextResponse("Project not found", { status: 404 });
    }

    const newTask = {
      id: crypto.randomUUID(),
      title,
      description,
      startDate: startDate ? new Date(startDate) : null,
      deadline: deadline ? new Date(deadline) : null,
      assignees: assignees || [],
      priority: priority || 0,
      timeline: timeline || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "todo",
    };

    // Update the project: add task to "tasks" array
    await updateDoc(projectRef, {
      tasks: arrayUnion(newTask),
      updatedAt: new Date(),
    });

    if (timeline) {
      const newTimelineItem = {
        id: newTask.id, 
        title: newTask.title,
        description: newTask.description,
        startDate: newTask.startDate,
        deadline: newTask.deadline,
        assignees: newTask.assignees,
        priority: newTask.priority,
        createdAt: newTask.createdAt,
        updatedAt: newTask.updatedAt,
        status: newTask.status,
      };

      await updateDoc(projectRef, {
        timeline: arrayUnion(newTimelineItem),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("[TASKS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
