import {
    alwaysPermittedDepartments,
    alwaysPermittedDesignations,
    hasAuth,
  } from "@/helpers/hasAuth";
  import dbConnect from "@/lib/dbConnect";
  import Task from "@/model/Task";
  import { NextResponse } from "next/server";
  import { startOfTomorrow, endOfTomorrow } from "date-fns";
  
  const permittedDesignations = [
    "director",
    "assistant director",
    "senior executive",
  ];
  
  // GET: Fetch task counts only
  export async function GET() {
    const { session, isPermitted } = await hasAuth(permittedDesignations);
  
    if (!session) {
      return NextResponse.json(
        { message: "You are not authorized to view task counts" },
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
        tasks = await Task.find();
      } else if (
        userDesignation === "director" ||
        userDesignation === "assistant director"
      ) {
        // Directors and Assistant Directors see department tasks
        tasks = await Task.find({
          $or: [
            { toDept: session.user.buccDepartment },
            { fromDept: session.user.buccDepartment },
          ],
        });
      } else if (userDesignation === "senior executive") {
        // Senior Executives see tasks assigned to them
        tasks = await Task.find({
          $or: [
            { 
                $and: [
                    { toDept: session.user.buccDepartment },
                    { toDesignation: session.user.designation }
                ]
            },
            {
                $and: [
                    { fromDept: session.user.buccDepartment },
                    { fromDesignation: session.user.designation }
                ]
            }
        ]
        });
      } else {
        tasks = [];
      }
  
      // Task counts by status
      const statusCounts = {
        accepted: tasks.filter((task) => task.status === "accepted").length,
        pending: tasks.filter((task) => task.status === "pending").length,
        completed: tasks.filter((task) => task.status === "completed").length,
      };
  
      // Task count for deadlines within tomorrow
      const tomorrowStart = startOfTomorrow();
      const tomorrowEnd = endOfTomorrow();
      const tasksDueTomorrow = tasks.filter((task) => {
        const deadline = new Date(task.deadline);
        return deadline >= tomorrowStart && deadline <= tomorrowEnd;
      }).length;
      // Return only task counts
      return NextResponse.json(
        {
          taskCounts: {
            ...statusCounts,
            dueTomorrow: tasksDueTomorrow,
          },
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.log(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  