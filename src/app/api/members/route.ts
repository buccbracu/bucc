export async function GET() {
  await dbConnect();
  const user = await auth();

  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    });
  }

  if (
    !["Director", "Assistant Director", "Senior Executive"].includes(
      user?.user.designation
    )
  ) {
    return NextResponse.json({
      message: `Designation: ${user?.user.designation} does not have the permission to view this page.`,
    });
  }

  try {
    const filter = {
      buccDepartment: user?.user.buccDepartment,
      studentId: { $ne: "00000000" },
    };

    // If user is a Senior Executive, filter by department and allow only certain designations
    if (user?.user.designation === "Senior Executive") {
      filter.designation = { $in: ["Director", "Assistant Director", "Senior Executive"] };
    }

    // Set fields to fetch based on designation
    const selectFields =
      user?.user.designation === "Senior Executive"
        ? "email contactNumber emergencyContact name designation buccDepartment profileImage"
        : "";

    // Query members with appropriate fields
    const users = await MemberInfo.find(filter)
      .select(selectFields)
      .lean(); // Convert to plain objects for better performance

    // Custom sorting logic
    users.sort((a, b) => {
      const departmentComparison =
        departmentsName.indexOf(a.buccDepartment) -
        departmentsName.indexOf(b.buccDepartment);

      if (departmentComparison !== 0) {
        return departmentComparison;
      }

      return (
        designationsName.indexOf(a.designation) -
        designationsName.indexOf(b.designation)
      );
    });

    // Format `memberSocials` for Senior Executives
    if (user?.user.designation === "Senior Executive") {
      users.forEach((user) => {
        if (user.memberSocials) {
          user.memberSocials = {
            Github: user.memberSocials?.Github || null,
            LinkedIn: user.memberSocials?.Linkedin || null,
            Facebook: user.memberSocials?.Facebook || null,
          };
        }
      });
    }

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({
      message: "An error occurred while fetching members.",
      error: error,
    });
  }
}
