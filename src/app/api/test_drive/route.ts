// /src/app/api/test_drive/route.ts
export const runtime = "node";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions); // 👈 use getServerSession
  
  if (!session || !(session as any).accessToken) {
    return NextResponse.json(
      { error: "Not signed in or no access token" },
      { status: 401 }
    );
  }

  const accessToken = (session as any).accessToken as string;

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: "v3", auth });

  try {
    const result = await drive.files.list({
        q: "'1Vba9QUAcctkDzWozQsQ8P_pqpX9wyNO1' in parents and trashed = false",
        fields: "files(id, name, mimeType)",
        supportsAllDrives: true,
      });
      

    return NextResponse.json(result.data.files);
  } catch (err: any) {
    console.error("Drive API error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown Drive API error" },
      { status: 500 }
    );
  }
}
