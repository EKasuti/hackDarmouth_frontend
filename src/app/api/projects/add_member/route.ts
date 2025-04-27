import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { projectId, member } = body;

    if (!projectId || !member) {
      return new NextResponse("Missing projectId or member data", { status: 400 });
    }

    const projectRef = doc(db, "projects", projectId);

    // Add the member to the project's members array
    await updateDoc(projectRef, {
      members: arrayUnion(member),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "Member added successfully" });
  } catch (error) {
    console.error("[ADD_MEMBER_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
