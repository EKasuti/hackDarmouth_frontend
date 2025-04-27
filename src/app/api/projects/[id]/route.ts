import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id } = await params;  

  try {
    const projectRef = doc(db, "projects", id);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ id: projectSnap.id, ...projectSnap.data() }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}