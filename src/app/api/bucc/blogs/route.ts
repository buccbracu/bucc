import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import { NextRequest, NextResponse } from "next/server";

export const permittedDepartments = ["Governing Body", "Human Resources"];
export const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
];

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { title, description, content, category, tags, author } = reqBody;

    if (!title || !description || !content || !category || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await dbConnect();

    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return NextResponse.json(
        { error: "Blog with this title already exists" },
        { status: 400 },
      );
    }

    const newBlog = new Blog({
      title,
      description,
      content,
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("id");
    if (query) {
      const result = await Blog.findById(query);
      return NextResponse.json(result);
    }
    return NextResponse.json({ message: "ID is not found" });
  } catch (error) {
    return NextResponse.json({ message: "Link broken" }, { status: 404 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json(
        {
          error: "You are not authorized to request for update",
        },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const reqBody = await request.json();
    const { title, description, content, category, tags, author } = reqBody;

    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required for updating" },
        { status: 400 },
      );
    }

    if (!title && !description && !content && !category && !tags && !author) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 },
      );
    }

    await dbConnect();

    const existingBlog = await Blog.findById(id);

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    if (
      user?.user.name != existingBlog.author ||
      !permittedDepartments.includes(user?.user.buccDepartment) ||
      !permittedDesignations.includes(user?.user.designation)
    ) {
      return NextResponse.json(
        { error: "You are not authorized to view this page" },
        { status: 401 },
      );
    }

    if (title) existingBlog.title = title;
    if (description) existingBlog.description = description;
    if (content) existingBlog.content = content;
    if (category) existingBlog.category = category;
    if (tags) existingBlog.tags = tags;
    if (author) existingBlog.author = author;

    existingBlog.lastUpdate = new Date();

    const updatedBlog = await existingBlog.save();

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
