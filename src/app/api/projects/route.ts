import { NextResponse } from "next/server";
import { collection, getDocs, addDoc, doc, getDoc} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const projectsCol = collection(db, "projects");
    const projectSnapshot = await getDocs(projectsCol);

    const users = projectSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(users); 
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the full user document from Firestore
    const userRef = doc(db, "users", session.user.email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return new NextResponse("User not found", { status: 404 });
    }

    const userData = userSnap.data();

    if (userData.role !== "admin") {
      return new NextResponse("Forbidden: Admins only", { status: 403 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return new NextResponse("Missing title or description", { status: 400 });
    }

    const newProject = {
      title,
      description,
      imageUrl:"",
      status: "active",
      timeline: [],
      members: [],
      resources: [],
      tasks: [],
      startDate: null,
      endDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.email,
    };

    const projectsCol = collection(db, "projects");
    const projectRef = await addDoc(projectsCol, newProject);

    return NextResponse.json({ id: projectRef.id, ...newProject });
  } catch (error) {
    console.error("[PROJECTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}