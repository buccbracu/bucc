import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import { NextRequest, NextResponse } from "next/server";

const permittedDesignations = ["Director", "Assistant Director"];
const permittedDepartments = ["Press Release and Publications"];

export async function POST(request: NextRequest) {
  await dbConnect();

  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to publish blogs" },
      { status: 401 },
    );
  }

  const author = session.user.name;

  try {
    const {
      title,
      description,
      featuredImage,
      content,
      category,
      tags,
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

    const blogStatus = isPermitted ? status || "draft" : "draft";

    const newBlog = new Blog({
      title,
      description,
      featuredImage,
      content,
      category,
      tags,
      author,
      status: blogStatus,
      createdDate: new Date(),
      lastUpdate: new Date(),
    });

    const savedBlog = await newBlog.save();
    return NextResponse.json(savedBlog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to view this page" },
      { status: 401 },
    );
  }

  await dbConnect();

  const userName = session.user.name;

  try {
    let blogs;

    if (isPermitted) {
      blogs = await Blog.find().sort({ createdDate: -1 });
    } else {
      blogs = await Blog.find({ author: userName }).sort({ createdDate: -1 });
    }

    return NextResponse.json(blogs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
