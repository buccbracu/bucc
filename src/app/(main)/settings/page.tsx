import { auth } from "@/auth";

export const maxDuration = 60;
export default async function Settings() {
  const session = await auth();

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
      <p>{session?.user.userRole}</p>
    </div>
  );
}
