import ExecutiveBody2021 from "./executive-body-2021/data";
import ExecutiveBody2022 from "./executive-body-2022/data";
import ExecutiveBody2023 from "./executive-body-2023/data";
import ExecutiveBody2024 from "./executive-body-2024/data";
import ExecutiveBody2025 from "./executive-body-2025/data";

// Function to sort data by department and transform it into an array of objects with specific roles categorized
function sortDataByDepartment(data: any[]): {
  departmentName: string;
  members: any[];
  presidentAndVicePresident?: any[];
  generalSecretaryAndTreasurer?: any[];
  directors?: any[];
  assistantDirectors?: any[];
}[] {
  const departmentMap: Record<string, any[]> = {};

  // Group members by department
  data.forEach((member) => {
    if (!departmentMap[member.department]) {
      departmentMap[member.department] = [];
    }
    departmentMap[member.department].push(member);
  });

  // Transform the department map into an array of objects with categorized roles
  const sortedData = Object.entries(departmentMap).map(
    ([departmentName, members]) => ({
      departmentName,
      members,
      presidentAndVicePresident: members.filter((member) =>
        ["President", "Vice President"].includes(member.designation),
      ),
      generalSecretaryAndTreasurer: members.filter((member) =>
        ["General Secretary", "Treasurer", "Financial Secretary"].includes(
          member.designation,
        ),
      ),
      directors: members.filter((member) => member.designation === "Director"),
      assistantDirectors: members.filter(
        (member) => member.designation === "Assistant Director",
      ),
    }),
  );

  return sortedData;
}

// Combine all executive body data
const allExecutiveBodyData = [
  {
    panelYear: "Executive Body 2025",
    data: ExecutiveBody2025,
    executiveMembersByDepartment: sortDataByDepartment(ExecutiveBody2025),
  },
  {
    panelYear: "Executive Body 2024",
    data: ExecutiveBody2024,
    executiveMembersByDepartment: sortDataByDepartment(ExecutiveBody2024),
  },
  {
    panelYear: "Executive Body 2023",
    data: ExecutiveBody2023,
    executiveMembersByDepartment: sortDataByDepartment(ExecutiveBody2023),
  },
  {
    panelYear: "Executive Body 2022",
    data: ExecutiveBody2022,
    executiveMembersByDepartment: sortDataByDepartment(ExecutiveBody2022),
  },
  {
    panelYear: "Executive Body 2021",
    data: ExecutiveBody2021,
    executiveMembersByDepartment: sortDataByDepartment(ExecutiveBody2021),
  },
];

export default allExecutiveBodyData;
