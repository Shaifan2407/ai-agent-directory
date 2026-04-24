import dbConnect from "@/lib/dbConnect";
import AiTool from "@/models/aiTools";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: "Search query is required",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create case-insensitive search regex
    const searchRegex = new RegExp(query, "i");
    const exactMatchRegex = new RegExp(`^${query}$`, "i");

    // Search with scoring
    const tools = await AiTool.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: searchRegex } },
            { tagline: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { category: { $regex: searchRegex } },
            { "socialTags.name": { $regex: searchRegex } },
          ],
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              // Exact matches get highest score
              {
                $cond: [
                  { $regexMatch: { input: "$name", regex: exactMatchRegex } },
                  100,
                  0,
                ],
              },
              {
                $cond: [
                  {
                    $regexMatch: { input: "$tagline", regex: exactMatchRegex },
                  },
                  50,
                  0,
                ],
              },
              // Partial matches get lower scores
              {
                $cond: [
                  { $regexMatch: { input: "$name", regex: searchRegex } },
                  50,
                  0,
                ],
              },
              {
                $cond: [
                  { $regexMatch: { input: "$tagline", regex: searchRegex } },
                  25,
                  0,
                ],
              },
              {
                $cond: [
                  {
                    $regexMatch: { input: "$description", regex: searchRegex },
                  },
                  10,
                  0,
                ],
              },
              {
                $cond: [
                  { $regexMatch: { input: "$category", regex: searchRegex } },
                  5,
                  0,
                ],
              },
            ],
          },
        },
      },
      {
        $sort: { score: -1 },
      },
    ]);

    // Group results by category
    const groupedResults = tools.reduce((acc, tool) => {
      const category = tool.category.toLowerCase();
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tool);
      return acc;
    }, {});

    // Sort categories by the highest score in each category
    const sortedGroupedResults = Object.entries(groupedResults)
      .sort(([, toolsA], [, toolsB]) => {
        const maxScoreA = Math.max(...toolsA.map((t) => t.score));
        const maxScoreB = Math.max(...toolsB.map((t) => t.score));
        return maxScoreB - maxScoreA;
      })
      .reduce((acc, [category, tools]) => {
        acc[category] = tools;
        return acc;
      }, {});

    return NextResponse.json(
      {
        success: true,
        data: sortedGroupedResults,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error searching tools:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search tools",
      },
      { status: 500 }
    );
  }
}
