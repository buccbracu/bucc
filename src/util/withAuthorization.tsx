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
    const [config, setConfig] = React.useState<any>(null);

    React.useEffect(() => {
      fetch("/api/config?key=recruitment_config")
        .then(res => res.json())
        .then(data => setConfig(data.value || { allowSERecruitmentAccess: false }))
        .catch(() => setConfig({ allowSERecruitmentAccess: false }));
    }, []);

    if (sessionStatus === "loading" || config === null) {
      return <SpinnerComponent />;
    }

    const user = sessionData?.user;
      const isAlumni = 
      user?.memberStatus?.toLowerCase() === "alumni" || 
      user?.designation?.toLowerCase() === "alumni" ||
      (user?.memberStatus && user?.memberStatus?.toLowerCase() !== "active");
    if (isAlumni) {
      return (
        <div className="p-8 text-center text-muted-foreground font-serif text-lg mt-20">
          Alumni do not have permission to view this page.
        </div>
      );
    }
    const userDepartment = user?.buccDepartment || "";
    const userDesignation = user?.designation || "";

    // Always permitted roles (All Executive Body and Governing Body members across all departments)
    const isEB = !isAlumni && ["Director", "Assistant Director"].includes(userDesignation);
    const isGB = !isAlumni && [
      "President",
      "Vice President",
      "General Secretary",
      "Treasurer",
    ].includes(userDesignation);

    const isAlwaysPermitted = isEB || isGB;

    // Check if the user is permitted based on specific props
    const departmentCheck =
      permittedDepartment && userDepartment === permittedDepartment;

    const activeDesignations = [...(permittedDesignations || [])];
    if (config?.allowSERecruitmentAccess) {
      activeDesignations.push("Senior Executive");
    }

    const designationCheck =
      activeDesignations?.length > 0 &&
      activeDesignations.includes(userDesignation);

    const isSERecruitmentAllowed = config?.allowSERecruitmentAccess && userDesignation === "Senior Executive";
 
    if (
      !user ||
      (!isAlwaysPermitted && !isSERecruitmentAllowed && (!departmentCheck || !designationCheck))
    ) {
      return (
        <div>
          {sessionData?.user.designation}s of {sessionData?.user.buccDepartment}{" "}
          don&apos;t have the permission to view this page.
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthorization;
