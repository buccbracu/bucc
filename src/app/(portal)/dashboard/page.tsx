"use client";
import Heading from "@/components/portal/heading";
import { useSession } from "next-auth/react";
export default function Dashboard() {
  const session = useSession();
  return (
    <div className="m-10">
      <Heading
        headingText="Dashboard"
        subHeadingText="This is a scrollable dashboard. Scroll down to see more content..."
      />
      <p className="text-justify">Hello Working on it!!!</p>
      <p>{JSON.stringify(session)}</p>
    </div>
  );
}
