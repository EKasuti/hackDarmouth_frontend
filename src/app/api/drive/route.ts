import { drive } from "@/lib/google";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await drive.files.list({
      pageSize: 10,
      fields: 'files(id, name)',
    });

    return NextResponse.json({ files: res.data.files });
  } catch (error) {
    console.error("Error fetching files from Drive", error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}
