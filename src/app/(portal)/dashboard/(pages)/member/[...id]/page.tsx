"use client";

import EditMember from "@/components/portal/settings/EditMember";
import { useParams } from "next/navigation";

export default function Member() {
  const { id } = useParams();
  return <EditMember id={id[0]} />;
}
