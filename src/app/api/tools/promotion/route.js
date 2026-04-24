import dbConnect from "@/lib/dbConnect";
import AiTool from "@/models/aiTools";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await dbConnect();
    try {
        // const { promotion} = await params
        const tool = await AiTool.find({
            promotion: true
        }, "logo name websiteUrl");
        // console.log(tool)

        if (!tool) {
            return NextResponse.json({ error: "Tool Not Found" }, { status: 404 });
        }

        return NextResponse.json(tool, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tool" }, { status: 500 });
    }
}
