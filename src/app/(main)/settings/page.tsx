import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";

export const maxDuration = 60;
export default async function Settings() {
  await dbConnect();
  const session = await auth();

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
      <p>{session?.user.userRole}</p>
    </div>
  );
}
