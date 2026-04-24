import dbConnect from "@/lib/dbConnect"
import AiTool from "@/models/aiTools"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    await dbConnect()

    // Parse the request body to get tool names
    const { toolNames } = await req.json()

    if (!toolNames || !Array.isArray(toolNames) || toolNames.length === 0) {
      return NextResponse.json({ error: "Invalid or missing tool names" }, { status: 400 })
    }

    // Fetch tools matching the given names
    const tools = await AiTool.find({ name: { $in: toolNames } })

    return NextResponse.json({ success: true, data: tools }, { status: 200 })
  } catch (error) {
    console.error("Error fetching favorite tools:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
