// import dbConnect from "@/lib/dbConnect";
// import AiTool from "@/models/aiTools";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//     await dbConnect();

//     try {
//         // Pagination parameters
//         // const { searchParams } = new URL(req.url);
//         // const page = parseInt(searchParams.get("page")) || 1;
//         // const limit = parseInt(searchParams.get("limit")) || 10;
//         // const skip = (page - 1) * limit;

//         // // Fetch only necessary fields to improve performance
//         const tools = await AiTool.find({}, "name category logo tagline pricingModel websiteUrl")
//             // .skip(skip)
//             // .limit(limit)
//             .lean();

//         // Group tools by category
//         const groupedTools = tools.reduce((acc, tool) => {
//             const category  = tool.category.toLowerCase();
//             if (!acc[category]) acc[category] = [];
//             acc[category].push(tool);
//             return acc;
//         }, {});

//         const sortedGroupedTools = Object.keys(groupedTools)
//             .sort()
//             .reduce((sortedAcc, key) => {
//                 sortedAcc[key] = groupedTools[key];
//                 return sortedAcc;
//             }, {});

//         return NextResponse.json({
//             // page, limit,
//             data: groupedTools
//         }, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching grouped tools:", error);
//         return NextResponse.json({ error: "Failed to fetch grouped tools" }, { status: 500 });
//     }
// }



import dbConnect from "@/lib/dbConnect";
import AiTool from "@/models/aiTools";
import { NextResponse } from "next/server";

export async function GET(req) {
    await dbConnect();

    try {
        // Fetch only necessary fields to improve performance
        const tools = await AiTool.find({}, "name category logo tagline pricingModel websiteUrl")
            .lean();

        // Group tools by category (lowercased)
        const groupedTools = tools.reduce((acc, tool) => {
            const category = tool.category.toLowerCase(); // Convert category to lowercase
            if (!acc[category]) acc[category] = [];
            acc[category].push(tool);
            return acc;
        }, {});

        // Sort categories alphabetically
        const sortedGroupedTools = Object.keys(groupedTools)
            .sort()
            .reduce((sortedAcc, key) => {
                sortedAcc[key.split(" ").map(val => val.charAt(0).toUpperCase() + val.slice(1)).join(' ')] = groupedTools[key];
                return sortedAcc;
            }, {});

        return NextResponse.json({
            data: sortedGroupedTools
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching grouped tools:", error);
        return NextResponse.json({ error: "Failed to fetch grouped tools" }, { status: 500 });
    }
}
