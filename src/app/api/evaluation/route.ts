import dbConnect from "@/lib/dbConnect";
import MemberEBAssessment from "@/model/MemberEBAssessment";
import PreregMemberInfo from "@/model/PreregMemberInfo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, gSuiteEmail, name, responseObject, firstChoice } = body;

    const memberEB = await MemberEBAssessment.findOne({
      studentId: studentId,
    });
    if (memberEB) {
      return NextResponse.json(
        { message: "Evaluation already submitted" },
        { status: 400 },
      );
    }
    const memberSaveEB = new MemberEBAssessment({
      studentId,
      gSuiteEmail,
      name,
      responseObject,
    });

    await memberSaveEB.save();

    return NextResponse.json(
      { message: "Evaluation submission Successful" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// export async function GET(request: NextRequest) {
//   try {

//     const url = new URL(request.url);
//     const studentID = url.searchParams.get("studentID");
//     const evaluationID = url.searchParams.get("evaluationID");

//     if (evaluationID) {

//       const evaluationData = await MemberEBAssessment.findById(evaluationID);

//       if (evaluationData) {
//         return NextResponse.json(evaluationData, { status: 200 });
//       }
//     }

//     if (studentID) {

//       const evaluationData = await MemberEBAssessment.findOne({
//         studentId: studentID,
//       });

//       if (evaluationData) {

//         return NextResponse.json(
//           { message: "Evaluation already submitted" },
//           { status: 400 },
//         );
//       }

//       const preregMemberInfo = await PreregMemberInfo.findOne({
//         studentId: studentID,
//       });

//       if (preregMemberInfo) {

//         return NextResponse.json(
//           { message: "Preregistration completed, proceed to evaluation" },
//           { status: 200 },
//         );
//       }

//       return NextResponse.json(
//         { message: "You are not preregistered." },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(
//       { error: "Invalid request parameters" },
//       { status: 400 },
//     );
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }


export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const studentID = url.searchParams.get("studentID");
    const evaluationID = url.searchParams.get("evaluationID");

    if (evaluationID) {
      const evaluationData = await MemberEBAssessment.findById(evaluationID);
      if (evaluationData) {
        return NextResponse.json(evaluationData, { status: 200 });
      }
    }

    if (studentID) {
      dbConnect();
      const evaluationData = await MemberEBAssessment.findOne({ studentId: parseInt(studentID) });
      if (evaluationData) {
        return NextResponse.json(
          { message: "Evaluation already submitted" },
          { status: 400 }
        );
      }

      const allowedStudentIDs = [
        24101255, 24301164, 1000058859, 1000056963, 1000057588,
        24301371, 1000057528, 1000057582, 24301052, 1000058876,
        1000058809, 1000055705, 1000055949, 1000058162, 1000058789,
        24301564, 24201287, 1000058024, 1000057587, 1000057502,
        1000057058, 1000057586, 1000055781, 1000058029, 1000057996,
        1000057674, 1000058259, 1000057581, 1000057589, 1000054967,
        24201303, 1000058822, 1000058770, 1000055823, 1000055669,
        1000055273, 1000057856, 24221176, 24101192, 24301525,
        23201195, 24141041, 24101534, 1000057512, 1000056615,
        24321235, 24201349, 24321003, 24301519, 1000057486,
        1000056803, 1000058699, 23201163, 1000058935, 1000055660,
        1000058038, 1000057618, 1000058846, 1000056836, 1000058776,
        1000057601, 1000057998, 23201255, 24321211, 1000057147,
        1000056783, 1000055731, 24301493, 24201017, 1000057567,
        24121325, 24101555, 1000056038, 24321286, 1000058127,
        24201203, 23201209, 23201050, 24201361, 23301026,
        23201638, 1000055666, 1000055698, 24121353, 1000055677,
        24101668, 23201272, 24201438, 1000054886, 1000056816,
        1000055758, 24121292, 24321237, 23201159, 24301012,
        24215018, 1000055726
      ];

      const stID = parseInt(studentID);
      if (allowedStudentIDs.includes(stID)) {
        return NextResponse.json(
          { message: "Preregistration completed, proceed to evaluation" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Student not preregistered" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Invalid request parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
