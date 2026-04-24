import dbConnect from "@/lib/dbConnect";
import AiTool from "@/models/aiTools";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    // Convert URL-friendly slug to category name format
    const categoryName = params.category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Find tools by category (case-insensitive)
    const tools = await AiTool.find({
      category: { $regex: new RegExp("^" + categoryName + "$", "i") },
    }).lean();

    return NextResponse.json(
      {
        success: true,
        data: tools,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tools by category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tools",
      },
      { status: 500 }
    );
  }
}
