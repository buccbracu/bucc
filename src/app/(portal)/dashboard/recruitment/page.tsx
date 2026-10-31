"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import { Badge } from "@/components/ui/badge";
import { departmentsInfo } from "@/constants/departments";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import EvaluationStats from "./EvaluationStats";
import { useRouter } from "next/navigation";

const getEvaluations = async () => {
  const res = await fetch(`/api/evaluation/all`);
  if (!res.ok) throw new Error("Failed to fetch evaluations");
  return res.json();
};

const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
];

const getEvaluationResponseObject = (item: any) => {
  if (!item?.responseObject) return {};
  if (typeof item.responseObject === "string") {
    try {
      return JSON.parse(item.responseObject);
    } catch {
      return {};
    }
  }
  return item.responseObject;
};

const getFirstChoice = (item: any): string => {
  const resp = getEvaluationResponseObject(item);
  return resp?.question8 || resp?.["Preferred Department (1st)"] || item?.buccDepartment || "";
};

const getSecondChoice = (item: any): string => {
  const resp = getEvaluationResponseObject(item);
  return resp?.question32 || resp?.["Preferred Department (2nd)"] || "";
};

export default function EvaluationsPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    department: "",
    firstChoice: "",
    secondChoice: "",
  });

  const { data: evaluations, isLoading, isError } = useQuery({
    queryKey: ["evaluations"],
    queryFn: getEvaluations,
    enabled: sessionStatus === "authenticated",
  });

  const { data: configData } = useQuery({
    queryKey: ["recruitment-config"],
    queryFn: async () => {
      const res = await fetch("/api/config?key=recruitment_config");
      if (!res.ok) return { allowSERecruitmentAccess: false };
      const json = await res.json();
      return json.value || { allowSERecruitmentAccess: false };
    }
  });

  // Calculate stats based on fetched data
  const stats = useMemo(() => {
    const statusWise: any = {
      Submitted: { "Not Assigned": 0 },
      Accepted: { "Not Assigned": 0 },
      Pending: { "Not Assigned": 0 },
      Rejected: { "Not Assigned": 0 },
    };

    departmentsInfo.forEach(dept => {
      statusWise.Submitted[dept.name] = 0;
      statusWise.Accepted[dept.name] = 0;
      statusWise.Pending[dept.name] = 0;
      statusWise.Rejected[dept.name] = 0;
    });

    evaluations?.forEach((item: any) => {
      const dept = item.buccDepartment || "Not Assigned";
      const status = item.status || "Pending";
      if (statusWise[status]) {
        statusWise[status][dept] = (statusWise[status][dept] || 0) + 1;
      }
    });

    return statusWise;
  }, [evaluations]);

  // Filter evaluations
  const filteredEvaluations = useMemo(() => {
    if (!evaluations) return [];

    return evaluations.filter((item: any) => {
      const searchStr = filters.search.toLowerCase();
      const matchesSearch = 
        !filters.search || 
        item.name?.toLowerCase().includes(searchStr) || 
        item.studentId?.toString().toLowerCase().includes(searchStr);
      
      const matchesStatus = !filters.status || item.status === filters.status;
      
      const matchesAssignedDept = !filters.department || item.buccDepartment === filters.department;

      const firstChoice = getFirstChoice(item);
      const matchesFirstChoice = !filters.firstChoice || firstChoice === filters.firstChoice;

      const secondChoice = getSecondChoice(item);
      const matchesSecondChoice = !filters.secondChoice || secondChoice === filters.secondChoice;

      return matchesSearch && matchesStatus && matchesAssignedDept && matchesFirstChoice && matchesSecondChoice;
    });
  }, [evaluations, filters]);

  const columns = [
    { 
      header: "Student ID", 
      accessorKey: "studentId",
      cell: ({ getValue }: { getValue: () => string }) => (
        <span className="font-mono text-xs font-semibold text-muted-foreground">{getValue()}</span>
      )
    },
    { 
      header: "Name", 
      accessorKey: "name",
      cell: ({ getValue }: { getValue: () => string }) => (
        <span className="font-medium text-sm text-foreground">{getValue()}</span>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }: { getValue: () => string }) => {
        const status = getValue() || "Pending";
        let colorClasses = "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
        if (status === "Accepted") {
          colorClasses = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
        } else if (status === "Pending") {
          colorClasses = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
        } else if (status === "Rejected") {
          colorClasses = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
        }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}>
            {status}
          </span>
        );
      },
    },
    { 
      header: "Assigned Dept", 
      accessorKey: "buccDepartment",
      cell: ({ getValue, row }: { getValue: () => string; row: any }) => {
        const dept = getValue();
        const firstChoice = getFirstChoice(row);
        const secondChoice = getSecondChoice(row);

        if (!dept) {
          return <span className="text-muted-foreground italic text-xs">Not Assigned</span>;
        }

        const isMatchFirst = dept === firstChoice;
        const isMatchSecond = dept === secondChoice && !isMatchFirst;
        const isReassigned = !isMatchFirst && !isMatchSecond;

        return (
          <div className="flex flex-col gap-0.5">
            <span className={`font-semibold text-xs px-2 py-0.5 rounded border w-fit ${
              isMatchSecond
                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                : isReassigned
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                : "bg-muted border-border text-foreground"
            }`}>
              {dept}
            </span>
            {isMatchSecond && (
              <span className="text-[10px] text-indigo-500 font-mono">
                2nd Choice
              </span>
            )}
            {isReassigned && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                Reassigned
              </span>
            )}
          </div>
        );
      }
    },
    { 
      header: "1st Choice", 
      accessorKey: "firstChoice",
      cell: ({ row }: { row: any }) => {
        const firstChoice = getFirstChoice(row);
        if (!firstChoice) {
          return <span className="text-muted-foreground italic text-xs">None</span>;
        }
        return (
          <span className="font-medium text-xs bg-muted/60 border border-border/80 px-2 py-0.5 rounded text-foreground">
            {firstChoice}
          </span>
        );
      }
    },
    { 
      header: "2nd Choice", 
      accessorKey: "secondChoice",
      cell: ({ row }: { row: any }) => {
        const choice = getSecondChoice(row);
        if (!choice || choice === "Skip") {
          return <span className="text-muted-foreground italic text-xs">{choice || "None"}</span>;
        }
        return (
          <span className="font-medium text-xs bg-muted/40 border border-border/60 px-2 py-0.5 rounded text-muted-foreground">
            {choice}
          </span>
        );
      }
    },
    { 
      header: "Submission", 
      accessorKey: "submissionDate",
      cell: ({ getValue }: { getValue: () => string }) => {
        const val = getValue();
        return (
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
            {val ? new Date(val).toLocaleDateString("en-US", { dateStyle: "medium" }) : "N/A"}
          </span>
        );
      }
    },
  ];

  const filterOptions = [
    {
      type: "search",
      name: "search",
      placeholder: "Search by ID or Name",
    },
    {
      type: "select",
      name: "status",
      placeholder: "All Statuses",
      options: ["Submitted", "Pending", "Accepted", "Rejected"],
    },
    {
      type: "select",
      name: "department",
      placeholder: "All Assigned Depts",
      options: departmentsInfo.map(d => d.name),
    },
    {
      type: "select",
      name: "firstChoice",
      placeholder: "All 1st Choice Depts",
      options: departmentsInfo.map(d => d.name),
    },
    {
      type: "select",
      name: "secondChoice",
      placeholder: "All 2nd Choice Depts",
      options: [...departmentsInfo.map(d => d.name), "Skip"],
    },
  ];

  if (isLoading || sessionStatus === "loading") return <SpinnerComponent />;
  if (isError) return <div className="p-8 text-center text-destructive">Failed to load evaluations.</div>;

  const user = session?.user as any;
  const isPermitted = 
    permittedDesignations.includes(user?.designation) || 
    (configData?.allowSERecruitmentAccess && user?.designation === "Senior Executive");

  if (!isPermitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-2">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view recruitment data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <Heading 
          headingText="Recruitment Evaluations" 
          subHeadingText="Manage and review applicant submissions." 
        />
      </div>

      {/* Stats Section on Top */}
      <EvaluationStats evaluationsStats={stats} />

      {/* Table & Filters */}
      <div className="space-y-6">
        <FilterComponent
          filters={filterOptions}
          onFilterChange={(f) => setFilters(prev => ({ ...prev, ...f }))}
          onResetFilters={() => setFilters({ search: "", status: "", department: "", firstChoice: "", secondChoice: "" })}
        />
        
        <TableComponent
          data={filteredEvaluations}
          columns={columns}
          onRowClick={(row) => router.push(`/dashboard/recruitment/${row._id}`)}
        />
      </div>
    </div>
  );
}
