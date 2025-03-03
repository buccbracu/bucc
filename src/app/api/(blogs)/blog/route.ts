import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import { NextRequest, NextResponse } from "next/server";
import { sendTopicNotification } from "@/lib/firebase/notification"

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

  const user = session.user;

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

    if (!title || !description || !featuredImage || !content || !category) {
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
      author: {
        authorId: user.id,
        authorName: user.name,
        authorEmail: user.email,
        authorDesignation: user.designation,
        authorDepartment: user.buccDepartment,
      },
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
  const { searchParams } = new URL(request.url);
  const publicView = searchParams.get("publicView");

  // If `publicView` query param is present, fetch all blogs and skip session/auth checks
  if (publicView) {
    try {
      await dbConnect();
      const blogs = await Blog.find({ status: "published" }).sort({
        createdDate: -1,
      });
      return NextResponse.json(blogs, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // Otherwise, proceed with session/auth checks
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

  const userId = session!.user.id;

  try {
    let blogs;

    if (isPermitted) {
      // Admin/Permitted users can view all blogs
      blogs = await Blog.find().sort({ createdDate: -1 });
    } else {
      // Regular users can only view their own blogs
      blogs = await Blog.find({ "author.authorId": userId }).sort({
        createdDate: -1,
      });
    }

    return NextResponse.json(blogs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
