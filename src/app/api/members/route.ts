import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const usersCol = collection(db, "users");
    const userSnapshot = await getDocs(usersCol);

    const users = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(users); 
  } catch (error) {
    console.error("[MEMBERS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}