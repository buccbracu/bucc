"use client";

import UnderConstruction from "@/components/ui/under-construction";
import withAuthorization from "@/util/withAuthorization";

function CreateEvent() {
  return (
    <div className="ext-3xl flex min-h-[calc(100vh-140px)] items-center justify-center font-bold">
      <UnderConstruction />
    </div>
  );
}

// Wrap with Authorization HOC
const permittedDepartment = "Event Management";
const permittedDesignations = ["Director", "Assistant Director"];

export default withAuthorization(CreateEvent, {
  permittedDepartment,
  permittedDesignations,
});
