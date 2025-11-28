import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    if (!folder) return Response.json({ years: [] });

    const dirPath = path.join(process.cwd(), "public", folder);

    if (!fs.existsSync(dirPath)) return Response.json({ years: [] });

    const allItems = fs.readdirSync(dirPath);

    // return only folders = years
    const years = allItems.filter((item) =>
      fs.lstatSync(path.join(dirPath, item)).isDirectory()
    );

    return Response.json({ years });
  } catch (err) {
    console.error("Year listing error:", err);
    return Response.json({ years: [] });
  }
}
