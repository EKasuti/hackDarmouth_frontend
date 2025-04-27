// app/api/projects/[id]/route.ts

import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const projectRef = doc(db, "projects", id);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectData = projectSnap.data();

    return NextResponse.json({
      id: projectSnap.id,
      ...projectData,
    });
  } catch (error) {
    console.error("[PROJECT_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}