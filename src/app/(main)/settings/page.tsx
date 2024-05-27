import { auth } from "@/auth";

export const maxDuration = 20;
export default async function Settings() {
  const session = await auth();

  return (
    <div>
      <p>Session: {JSON.stringify(session)}</p>
      <p>Name: {session?.user.email}</p>
    </div>
  );
}
