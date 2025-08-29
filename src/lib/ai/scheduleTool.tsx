import { courses, Course } from "./courses"
export function querySchedule(params: {
  faculty?: string;
  courseCode?: string;
  sectionName?: string;
  roomNumber?: string;
  type?: "class" | "lab";
  labSection?: string;

}) {
  return courses
    .filter((item) => {
      const facultyMatch = params.faculty
        ? (item.faculties.includes(params.faculty) ||
           (item.labFaculties?.includes(params.faculty) ?? false))
        : true;

      const courseMatch = params.courseCode
        ? (item.courseCode === params.courseCode || item.labCourseCode === params.courseCode)
        : true;

      const sectionMatch = params.sectionName ? item.sectionName === params.sectionName : true;

      const labsectionMatch = params.labSection ? item.labSection === params.labSection : true;

      const roomMatch = params.roomNumber
        ? (item.roomNumber === params.roomNumber || item.labRoomName === params.roomNumber)
        : true;

      return facultyMatch && courseMatch && sectionMatch && roomMatch && labsectionMatch;
    })
    .map((item) => {
      if (params.type === "lab") {
        if (!item.labCourseCode) return null; 
        return {
          course: item.labCourseCode,
          faculty: item.labFaculties ?? "TBA",
          room: item.labRoomName ?? "TBA",
          schedules: item.labSchedules ?? [],
          labCourse: item.courseCode,
          labsection: item.sectionName
        };
      }

      if (params.type === "class") {
        return {
          course: item.courseCode,
          faculty: item.faculties,
          room: item.roomNumber,
          schedules: item.classSchedules,
          section: item.sectionName,
        };
      }

      return {
        course: item.courseCode,
        faculty: item.faculties,
        room: item.roomNumber,
        schedules: item.classSchedules,
        labCourse: item.labCourseCode ?? null,
        labFaculty: item.labFaculties ?? null,
        labRoom: item.labRoomName ?? null,
        labSchedules: item.labSchedules ?? null,
        section: item.sectionName,
        labsection: item.labSection ?? null,
      };
    })
    .filter((x) => x !== null);
}
