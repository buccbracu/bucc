import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  // Get the author from the session
  const session = await auth();
  const author = session?.user?.name;

  try {
    const {
      title,
      description,
      featuredImage,
      content,
      category,
      tags,
      // author,
      status,
    } = await request.json();

    if (
      !title ||
      !description ||
      !featuredImage ||
      !content ||
      !category ||
      !author
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newBlog = new Blog({
      title,
      description,
      featuredImage,
      content,
      category,
      tags,
      author: author || "", // Default to empty string if not provided
      status: status || "draft", // Default to "draft" if not provided
      createdDate: new Date(),
      lastUpdate: new Date(),
    });

    const savedBlog = await newBlog.save();
    return NextResponse.json(savedBlog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const blogs = await Blog.find().sort({ createdDate: -1 }); // Sort by newest first
    return NextResponse.json(blogs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
