import SpinnerComponent from "@/components/SpinnerComponent";
import { useSession } from "next-auth/react";
import React from "react";

interface AuthorizationProps {
  permittedDepartment: string;
  permittedDesignations: string[];
}

const withAuthorization = (
  WrappedComponent: React.ComponentType,
  { permittedDepartment, permittedDesignations }: AuthorizationProps,
) => {
  return function AuthWrapper(props: any) {
    const { data: sessionData, status: sessionStatus } = useSession();

    if (sessionStatus === "loading") {
      return <SpinnerComponent />;
    }

    const user = sessionData?.user;
    const userDepartment = user?.buccDepartment || "";
    const userDesignation = user?.designation || "";

    // Always permitted roles
    const alwaysPermittedRoles = [
      {
        department: "Research and Development",
        designations: ["Director", "Assistant Director"],
      },
      {
        department: "Governing Body",
        designations: [
          "President",
          "Vice President",
          "General Secretary",
          "Treasurer",
        ],
      },
    ];

    // Check if the user has an always-permitted role
    const isAlwaysPermitted = alwaysPermittedRoles.some(
      (role) =>
        role.department === userDepartment &&
        role.designations.includes(userDesignation),
    );

    // Check if the user is permitted based on specific props
    const departmentCheck =
      permittedDepartment && userDepartment === permittedDepartment;

    const designationCheck =
      permittedDesignations?.length > 0 &&
      permittedDesignations.includes(userDesignation);

    if (
      !user ||
      (!isAlwaysPermitted && (!departmentCheck || !designationCheck))
    ) {
      return (
        <div>
          {sessionData?.user.designation}s of {sessionData?.user.buccDepartment}{" "}
          don't have the permission to view this page.
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthorization;
