import dbConnect from "@/lib/dbConnect";
import UserEvaluation from "@/models/UserEvaluation";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const evaluation = await UserEvaluation.find();

    if (!evaluation) {
      return Response.json(
        {
          success: false,
          message: "Evaluation not found.",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        evaluation,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error finding evaluation. Please try again later.",
      },
      { status: 500 }
    );
  }
}
