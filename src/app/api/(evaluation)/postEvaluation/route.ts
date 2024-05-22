import dbConnect from "@/lib/dbConnect";
import UserEvaluation from "@/models/UserEvaluation";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { studentId, name, gSuiteEmail, responseObject } =
      await request.json();

    const savedEvaluation = new UserEvaluation({
      studentId,
      name,
      gSuiteEmail,
      responseObject,
    });

    await savedEvaluation.save();

    return Response.json(
      {
        success: true,
        message: "Evaluation added successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error sending evaluation. Please try again later.",
      },
      { status: 500 }
    );
  }
}
