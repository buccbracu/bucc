import { hasAuth } from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import { NextRequest, NextResponse } from "next/server";
import { sendTopicNotification } from "@/lib/firebase/notification";

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

  let updateData;
  try {
    updateData = await request.json();
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid or missing JSON body" },
      { status: 400 },
    );
  }

  try {
    await dbConnect();
    const { id } = params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

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

    // Send notification if transitioning from draft to published
    if (blog.status === "draft" && updatedBlog.status === "published") {
      const notificationTitle = `New Blog: ${blog.title}`;
      const notificationBody = `By ${blog.author.authorName}\n${blog.description}`;

      const notificationResponse = await sendTopicNotification({
        title: notificationTitle,
        body: notificationBody,
        topic: "blog",
      });

      console.log("Notification Response:", notificationResponse);
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
