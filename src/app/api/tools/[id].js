import dbConnect from "@/lib/dbConnect";
import AiTool from "@/models/AiTool";
import { NextResponse } from "next/server";

// GET single tool by ID
export async function GET(req, { params }) {
  await dbConnect();
  try {
    const tool = await AiTool.findById(params.id);
    if (!tool) return NextResponse.json({ error: "Tool Not Found" }, { status: 404 });
    return NextResponse.json(tool, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// UPDATE tool by ID
export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const data = await req.json();
    const updatedTool = await AiTool.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedTool) return NextResponse.json({ error: "Tool Not Found" }, { status: 404 });
    return NextResponse.json(updatedTool, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update Failed" }, { status: 400 });
  }
}

// DELETE tool by ID
export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    await AiTool.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted Successfully" }, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
  }
}
