import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import { NextRequest, NextResponse } from "next/server";

const permittedDesignations = ["Director", "Assistant Director"];
const permittedDepartments = ["Press Release and Publications"];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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
  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to update this blog" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { id } = params;
    const updateData = await request.json();

    // Check if the user is allowed to update this blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Allow updates only if the user is the author or has permissions
    const isAuthor =
      blog.author.authorId.toString() === session.user.id.toString();
    if (!isAuthor && !isPermitted) {
      return NextResponse.json(
        { message: "You are not authorized to update this blog" },
        { status: 403 },
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log(updatedBlog)
    if(updatedBlog.blogStatus && updatedBlog.blogStatus == "published"){
      
      

    }

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to delete this blog" },
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

    // Allow deletions only if the user is the author or has permissions
    const isAuthor =
      blog.author.authorId.toString() === session.user.id.toString();

    if (!isAuthor && !isPermitted) {
      return NextResponse.json(
        { message: "You are not authorized to delete this blog" },
        { status: 403 },
      );
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
