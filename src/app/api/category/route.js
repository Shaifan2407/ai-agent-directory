import dbConnect from "@/lib/dbConnect";
import AiTool from "@/models/aiTools";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Fetch distinct categories and sort them alphabetically
    const categories = await AiTool.distinct("category");

    // Convert categories to lowercase and remove duplicates
    const normalizedCategories = [
      ...new Set(
        categories.map((category) =>
          category
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")
        )
      ),
    ].sort();

    return NextResponse.json(
      {
        success: true,
        data: normalizedCategories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}
