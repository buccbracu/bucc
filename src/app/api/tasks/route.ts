import {
  alwaysPermittedDepartments,
  alwaysPermittedDesignations,
  hasAuth,
} from "@/helpers/hasAuth";
import dbConnect from "@/lib/dbConnect";
import Task from "@/model/Task";
import { NextResponse } from "next/server";
import { sendTopicNotification } from "@/lib/firebase/notification"

const permittedDesignations = [
  "director",
  "assistant director",
  "senior executive",
];

// GET: Fetch all tasks
export async function GET() {
  const { session, isPermitted } = await hasAuth(permittedDesignations);

  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to view tasks" },
      { status: 401 },
    );
  }

  if (!isPermitted) {
    return NextResponse.json(
      { message: "You do not have sufficient permissions" },
      { status: 403 },
    );
  }

  try {
    await dbConnect();

    const userDesignation = session.user.designation.toLowerCase();
    const userDepartment = session.user.buccDepartment.toLowerCase();

    let tasks;

    if (
      alwaysPermittedDepartments.includes(userDepartment) &&
      alwaysPermittedDesignations.includes(userDesignation)
    ) {
      // Admins see all tasks
      tasks = await Task.find().sort({ deadline: 1 });
    } else if (
      userDesignation === "director" ||
      userDesignation === "assistant director"

    ) {
      // Directors and Assistant Directors see department tasks
      tasks = await Task.find({
        toDept: userDepartment,
        fromDept: userDepartment,
      }).sort({ deadline: 1 });
    } else if (userDesignation === "senior executive") {
      // Senior Executives see tasks assigned to them
      tasks = await Task.find({
        toDept: userDepartment,
        toDesignation: "Senior Executive",
      }).sort({ deadline: 1 });
    } else {
      tasks = [];
    }

    return NextResponse.json(tasks, { status: 200 });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new task
export async function POST(request: Request) {
  const { session, isPermitted } = await hasAuth([
    "director",
    "assistant director",
    "senior executive"
  ]);

  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to create tasks" },
      { status: 401 },
    );
  }

  if (!isPermitted) {
    return NextResponse.json(
      { message: "You do not have sufficient permissions" },
      { status: 403 },
    );
  }

  try {
    await dbConnect();

    const taskData = await request.json();

    // Validate the required fields manually
    const { taskTitle, taskDescription, toDept, toDesignation, deadline } =
      taskData;

    if (
      !taskTitle ||
      !taskDescription ||
      !toDept ||
      !toDesignation ||
      !deadline
    ) {
      return NextResponse.json(
        {
          message:
            "All fields (taskTitle, taskDescription, toDept, toDesignation, deadline) are required.",
        },
        { status: 400 },
      );
    }

    // Add metadata from the session
    taskData.fromDept = session.user.buccDepartment;
    taskData.fromDesignation = session.user.designation;

    const newTask = await Task.create(taskData);

    // send notification

    const notificationTitle = `New Task for ${toDept} - ${toDesignation}`;
    const notificationBody = `New Task Assigned: ${taskTitle}`;

    // Send a broadcast notification to the "task" topic
    const notificationResponse = await sendTopicNotification({
      title: notificationTitle,
      body: notificationBody,
      topic: "task",
    });

    console.log("Notification Response:", notificationResponse);


    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
