export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get("exam");
    const subject = searchParams.get("subject");

    if (!exam || !subject) {
      return NextResponse.json({ error: "Missing exam or subject" }, { status: 400 });
    }

    const folderPath = path.join(process.cwd(), "public", "reference-books", exam, subject);

    if (!fs.existsSync(folderPath)) {
      return NextResponse.json({ files: [] });
    }

    const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".zip"));

    return NextResponse.json({ files });
  } catch (err) {
    console.error("List Reference Books Error:", err);
    return NextResponse.json({ error: "Failed to read books" }, { status: 500 });
  }
}

