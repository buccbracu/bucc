import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { title, description, body, category, tags, author } = reqBody;

    // Validate required fields
    if (!title || !description || !body || !category || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Check for existing blog with the same title
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return NextResponse.json(
        { error: "Blog with this title already exists" },
        { status: 400 },
      );
    }

    // Create new blog
    const newBlog = new Blog({
      title,
      description,
      body,
      tags,
      category,
      author,
      createdDate: new Date(),
      lastUpdate: new Date(),
    });

    const res = await newBlog.save();

    return NextResponse.json(res, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
