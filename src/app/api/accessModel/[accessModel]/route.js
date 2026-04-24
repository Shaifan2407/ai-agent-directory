import dbConnect from "@/lib/dbConnect"
import AiTool from "@/models/aiTools"
import { NextResponse } from "next/server"
import { validators } from "tailwind-merge"

export async function GET(req, { params }) {
  try {
    await dbConnect()

    // Extract pricing model from request parameters
    const { accessModel } =await params

    // Validate pricing model input
    const validAccessModels = ["Open Source", "Close Source", "API"]
    if (!validAccessModels.includes(accessModel)) {
      return NextResponse.json({ error: "Invalid pricing model" }, { status: 400 })
    }

    // Fetch AI tools sorted by the given pricing model
    const tools = await AiTool.find({ accessModel }).sort({ name: 1 }) // Sorting alphabetically by name

    return NextResponse.json({ success: true, data: tools }, { status: 200 })
  } catch (error) {
    console.error("Error fetching AI tools by pricing model:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
