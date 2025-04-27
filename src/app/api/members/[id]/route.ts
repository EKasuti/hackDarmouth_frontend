import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ id: userSnap.id, ...userSnap.data() });
  } catch (error) {
    console.error("[MEMBERS_ID_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}