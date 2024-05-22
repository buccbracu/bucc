import { auth } from "@/auth";

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
      <p>{session.user.userRole}</p>
    </div>
  );
}
