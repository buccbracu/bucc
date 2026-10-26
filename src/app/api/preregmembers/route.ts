import { hasAuth } from "@/helpers/hasAuth";
import { getConfigValue } from "@/helpers/appConfigStore";
import PreRegMember from "@/model/PreRegMember";
import { NextResponse } from "next/server";

const permittedDepartments = [
  "Human Resources",
  "Governing Body",
  "Research and Development",
  "Event Management",
  "Creative",
  "Communication and Marketing",
  "Finance",
  "Press Release and Publications",
];
const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
];

export async function GET() {
  const config = await getConfigValue("recruitment_config", { allowSERecruitmentAccess: false });
  const activeDesignations = [...permittedDesignations];
  if (config?.allowSERecruitmentAccess) {
    activeDesignations.push("Senior Executive");
  }

  const { session, isPermitted: defaultPermitted } = await hasAuth(
    activeDesignations,
    permittedDepartments,
  );

  let isPermitted = defaultPermitted;
  if (session && !isPermitted) {
    const user = session.user as any;
    const isAlumni = 
      user?.memberStatus?.toLowerCase() === "alumni" || 
      user?.designation?.toLowerCase() === "alumni" ||
      (user?.memberStatus && user?.memberStatus?.toLowerCase() !== "active");
    if (config?.allowSERecruitmentAccess && user.designation === "Senior Executive" && !isAlumni) {
      isPermitted = true;
    }
  }

  if (!session || !isPermitted) {
    return NextResponse.json(
      { error: "You are not authorized to view this page" },
      { status: 401 },
    );
  }

  try {
    const users = await PreRegMember.find({});
    return NextResponse.json({ users: users });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
