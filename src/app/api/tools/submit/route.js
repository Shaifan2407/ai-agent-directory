import dbConnect from "@/lib/dbConnect";
import AiTool from "@/models/aiTools";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";


// -------------------- Configure Cloudinary --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// -------------------- Upload Function for Cloudinary --------------------
const uploadToCloudinary = async (file, folder) => {
  if (!file) return null;

  try {
    const buffer = await file.arrayBuffer();
    const base64String = `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;
    
    const uploadResponse = await cloudinary.uploader.upload(base64String, { folder });
    return uploadResponse.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error(`Cloudinary Upload Error (${folder}):`, error);
    return null;
  }
};

// -------------------- POST API (Single Tool Only) --------------------
export async function POST(req) {
  await dbConnect();

  try {
    const contentType = req.headers.get("content-type");

    let toolData;

    if (contentType?.includes("multipart/form-data")) {
      // 🔹 Handle FormData Request
      const formData = await req.formData();

      // 🔹 Extract data field (JSON string)
      const jsonData = formData.get("data");
      if (!jsonData) {
        return NextResponse.json({ error: "Missing 'data' field in FormData" }, { status: 400 });
      }

      toolData = JSON.parse(jsonData);

      // 🔹 Upload images if provided
      if (formData.has("logo")) {
        toolData.logo = await uploadToCloudinary(formData.get("logo"), "logos");
      }
      if (formData.has("thumbnailImage")) {
        toolData.thumbnailImage = await uploadToCloudinary(formData.get("thumbnailImage"), "thumbnails");
      }
    } else {
      // 🔹 Handle JSON Request (No Images)
      toolData = await req.json();
    }

    // 🔹 Format Category
    if (toolData.category) {
      toolData.category = toolData.category
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    }

    // 🔹 Format Category
    if (toolData.name) {
      toolData.name = toolData.name
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    }

    // 🔹 Insert into Database
    const newTool = await AiTool.create(toolData);

    return NextResponse.json({ data: newTool }, { status: 201 });

  } catch (error) {
    console.error("Error creating AI Tool:", error);
    return NextResponse.json({ error: "Failed to create AI Tool" }, { status: 400 });
  }
}