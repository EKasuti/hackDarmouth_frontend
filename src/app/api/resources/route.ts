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
    const { projectId, title, description, url, category } = body;
    
    if (!projectId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) {
      return new NextResponse("Project not found", { status: 404 });
    }

    const newResource = {
      id: crypto.randomUUID(),
      title,
      description,
      url,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await updateDoc(projectRef, {
      resources: arrayUnion(newResource),
      updatedAt: new Date(),
    });

    return NextResponse.json(newResource);

  } catch (error) {
    console.error("[RESOURCES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}