import dbConnect from "@/lib/dbConnect"
import AiTool from "@/models/aiTools"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    await dbConnect()

    // Extract pricing model from request parameters
    const { pricingModel } =await params

    // Validate pricing model input
    const validPricingModels = ["Free", "Paid", "Freemium"]
    if (!validPricingModels.includes(pricingModel)) {
      return NextResponse.json({ error: "Invalid pricing model" }, { status: 400 })
    }

    // Fetch AI tools sorted by the given pricing model
    const tools = await AiTool.find({ pricingModel }).sort({ name: 1 }) // Sorting alphabetically by name

    return NextResponse.json({ success: true, data: tools }, { status: 200 })
  } catch (error) {
    console.error("Error fetching AI tools by pricing model:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
