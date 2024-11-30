import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";

export async function hasAuth(
  permittedDesignations: string[] = [],
  permittedDepartments: string[] = [],
) {
  await dbConnect();

  let isPermitted = true;

  const session = await auth();

  if (!session) {
    isPermitted = false;
    return { session: null, isPermitted: false };
  }

  // Define designations that always have permission
  const alwaysPermittedDesignations = [
    "director",
    "assistant director",
    "president",
    "vice president",
    "general secretary",
    "treasurer",
  ];

  const alwaysPermittedDepartments = [
    "research and development",
    "governing body",
  ];

  const userDesignation = session.user.designation.toLowerCase();
  const userDepartment = session.user.buccDepartment.toLowerCase();

  // Check if user belongs to the always permitted designations or departments
  if (
    alwaysPermittedDesignations.includes(userDesignation) &&
    (alwaysPermittedDepartments.includes(userDepartment) ||
      permittedDepartments.length === 0)
  ) {
    return { session, isPermitted: true };
  }

  // If specific permitted designations are provided, check them
  if (permittedDesignations.length > 0) {
    permittedDesignations = permittedDesignations.map((designation) =>
      designation.toLowerCase(),
    );
    if (!permittedDesignations.includes(userDesignation)) {
      isPermitted = false;
    }
  }

  // If specific permitted departments are provided, check them
  if (permittedDepartments.length > 0) {
    permittedDepartments = permittedDepartments.map((department) =>
      department.toLowerCase(),
    );
    if (!permittedDepartments.includes(userDepartment)) {
      isPermitted = false;
    }
  }

  return { session, isPermitted };
}
