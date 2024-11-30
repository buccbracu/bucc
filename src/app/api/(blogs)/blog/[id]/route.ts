import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { session, isPermitted } = await hasAuth();

  if (!session || !isPermitted) {
    return NextResponse.json(
      { message: "You are not authorized to view this page" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { id } = params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { session, isPermitted } = await hasAuth();

  if (!session || !isPermitted) {
    return NextResponse.json(
      { message: "You are not authorized to view this page" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { id } = params;
    const updateData = await request.json();

    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { session, isPermitted } = await hasAuth();

  if (!session || !isPermitted) {
    return NextResponse.json(
      { message: "You are not authorized to view this page" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { id } = params;

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
