"use client";
import { useSession } from "next-auth/react";
import NimbusPlus from "./NimbusPlus";

export default function NimbusPlusPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const { designation, buccDepartment } = session?.user || {};

  const access_departments = ["Governing Body", "Research and Development"];
  const access_designations = [
    "President",
    "Vice President",
    "General Secretary",
    "Treasurer",
    "Director",
    "Assistant Director",
  ];

  const hasAccess =
    buccDepartment !== undefined && access_departments.includes(buccDepartment) &&
    designation !== undefined && access_designations.includes(designation);

  if (!hasAccess) {
    return <p>You are not authorized to view this page. Please Contact R&D Dept</p>;
  }

  return <NimbusPlus />;
}
