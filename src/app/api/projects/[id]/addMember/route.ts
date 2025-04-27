import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AddMemberRequestBody {
  userPath: string;         // e.g. "/users/nnnn"
  role: "admin" | "member"; // specify which group to add to
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const body: AddMemberRequestBody = await request.json();

    if (!body.userPath || (body.role !== "admin" && body.role !== "member")) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Determine the field in Firestore document path:
    // Note: Your Firestore structure is users.admins and users.members arrays
    const fieldToUpdate = `users.${body.role}s`; // either 'users.admins' or 'users.members'

    // Add the user path using Firestore's arrayUnion (avoid duplicates)
    await updateDoc(projectRef, {
      [fieldToUpdate]: arrayUnion(body.userPath),
    });

    return NextResponse.json({ message: `User added as ${body.role}` });
  } catch (error) {
    console.error("[ADD_MEMBER]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}