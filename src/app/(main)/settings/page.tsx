"use client";
import { useSession } from "next-auth/react";

export const maxDuration = 60;
export default function Settings() {
  const session = useSession();

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
    </div>
  );
}
