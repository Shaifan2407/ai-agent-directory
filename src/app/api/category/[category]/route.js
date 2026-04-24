import dbConnect from "@/lib/dbConnect";
import AiTool from "@/models/aiTools";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { category } = await params;

    // Extract pagination query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1; // Default page: 1
    const limit = parseInt(searchParams.get("limit")) || 10; // Default limit: 10
    const skip = (page - 1) * limit;

    // Fetch tools in the specified category with pagination
    const tools = await AiTool.find({ category })
    .skip(skip).limit(limit);
    const total = await AiTool.countDocuments({ category });

    if (!tools.length) {
      return NextResponse.json({ error: "No tools found in this category" }, { status: 404 });
    }

    return NextResponse.json({
      total,
      // page,
      // limit,
      tools
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
  }
}
