"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import FilterComponent from "@/components/table/FilterComponent";
import TableComponent from "@/components/table/TableComponent";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { UserPlus, Mail, ShieldCheck, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isSuperUser as checkGB } from "@/lib/permissions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import generatePassword from "@/helpers/generatePassword";

const getPendingOnboarding = async () => {
  const res = await fetch(`/api/registration`);
  if (!res.ok) throw new Error("Failed to fetch pending members");
  return res.json();
};

export default function RegistrationManagementPage() {
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus } = useSession();
  const [filters, setFilters] = useState({
    search: "",
    department: "",
  });

  // For Custom Onboarding Sheet
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isSheetOpen, setIsOpen] = useState(false);
  const [customData, setCustomData] = useState({
    name: "",
    email: "",
    studentId: "",
    phoneNumber: "",
    bracuDepartment: "",
    buccDepartment: "",
    password: "",
  });

  const handleOpenOnboard = (member: any) => {
    setSelectedMember(member);
    setCustomData({
      name: member.name,
      email: member.email,
      studentId: member.studentId,
      phoneNumber: member.phoneNumber || "",
      bracuDepartment: member.bracuDepartment || "",
      buccDepartment: member.buccDepartment || "",
      password: generatePassword(),
    });
    setIsOpen(true);
  };

  const { data: configData } = useQuery({
    queryKey: ["recruitment-config"],
    queryFn: async () => {
      const res = await fetch("/api/config?key=recruitment_config");
      if (!res.ok) return { allowSERecruitmentAccess: false };
      const json = await res.json();
      return json?.value || { allowSERecruitmentAccess: false };
    },
  });
 
  const user = session?.user as any;
  const isAlumni = 
    user?.memberStatus?.toLowerCase() === "alumni" || 
    user?.designation?.toLowerCase() === "alumni" ||
    (user?.memberStatus && user?.memberStatus?.toLowerCase() !== "active");

  const isGB = user && !isAlumni ? checkGB(user) : false;
  const isDeptHead = user && !isAlumni ? ["Director", "Assistant Director"].includes(user.designation) : false;
  const isPermitted = !isAlumni && (isGB || isDeptHead || (configData?.allowSERecruitmentAccess && user?.designation === "Senior Executive"));

  const { data: pendingMembers, isLoading, isError } = useQuery({
    queryKey: ["pending-onboarding"],
    queryFn: getPendingOnboarding,
    enabled: sessionStatus === "authenticated" && isPermitted,
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Onboarding failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Member onboarded and email sent!");
      queryClient.invalidateQueries({ queryKey: ["pending-onboarding"] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const filteredMembers = useMemo(() => {
    if (!pendingMembers) return [];
    return pendingMembers.filter((item: any) => {
      const searchStr = filters.search.toLowerCase();
      const matchesSearch = 
        !filters.search || 
        item.name.toLowerCase().includes(searchStr) || 
        item.studentId.toString().toLowerCase().includes(searchStr);
      
      const matchesDept = !filters.department || item.buccDepartment === filters.department;

      return matchesSearch && matchesDept;
    });
  }, [pendingMembers, filters]);

  const columns = [
    { header: "Student ID", accessorKey: "studentId" },
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Department", accessorKey: "buccDepartment" },
    {
      header: "Action",
      accessorKey: "_id",
      cell: ({ row }: { row: any }) => (
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/5"
          onClick={() => handleOpenOnboard(row)}
        >
          <UserPlus className="w-3.5 h-3.5" />
          Onboard
        </Button>
      ),
    },
  ];

  const filterOptions = [
    {
      type: "search",
      name: "search",
      placeholder: "Search by ID or Name",
    },
    ...(isGB ? [{
      type: "select",
      name: "department",
      placeholder: "All Departments",
      options: [
        "Communication and Marketing",
        "Creative",
        "Event Management",
        "Finance",
        "Human Resources",
        "Press Release and Publications",
        "Research and Development",
      ],
    }] : []),
  ];

  if (sessionStatus === "loading" || (isPermitted && isLoading)) return <SpinnerComponent />;
  if (isError) return <div className="p-8 text-center text-destructive">Failed to load pending members.</div>;

  if (!isPermitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-2">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to manage registration.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <Heading 
          headingText="Account Creation" 
          subHeadingText="Onboard accepted applicants and dispatch credentials." 
        />
      </div>

      <div className="space-y-6">
        <div className="bg-primary/5 border border-primary/10 p-4 rounded-md flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm text-primary/80">
            <p className="font-semibold">Note:</p>
            <p>Clicking "Onboard" will automatically generate a secure password and send a welcome email with login instructions to the member.</p>
          </div>
        </div>

        <FilterComponent
          filters={filterOptions}
          onFilterChange={(f) => setFilters(prev => ({ ...prev, ...f }))}
          onResetFilters={() => setFilters({ search: "", department: "" })}
        />
        
        <TableComponent
          data={filteredMembers}
          columns={columns}
        />

        {filteredMembers.length === 0 && !filters.search && !filters.department && (
          <div className="p-12 text-center border border-dashed border-border rounded-md">
            <p className="text-muted-foreground">No pending members to onboard.</p>
          </div>
        )}
      </div>

      {/* Onboarding Customization Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md border-l border-border bg-background flex flex-col h-full">
          <SheetHeader className="text-left space-y-4 shrink-0">
            <SheetTitle className="text-2xl font-serif tracking-tight">Review Member Info</SheetTitle>
            <SheetDescription className="text-muted-foreground font-light">
              Customize or verify details before creating the account.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2 mt-6">
            <div className="space-y-8 pb-10">
              {/* Full Name */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input 
                  value={customData.name} 
                  onChange={(e) => setCustomData({...customData, name: e.target.value})}
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
                />
              </div>

              {/* Student ID */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Student ID</Label>
                <Input 
                  value={customData.studentId} 
                  onChange={(e) => setCustomData({...customData, studentId: e.target.value})}
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">G-Suite Email</Label>
                <Input 
                  value={customData.email} 
                  onChange={(e) => setCustomData({...customData, email: e.target.value})}
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                <Input 
                  value={customData.phoneNumber} 
                  onChange={(e) => setCustomData({...customData, phoneNumber: e.target.value})}
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
                />
              </div>

              {/* University Department */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">University Dept</Label>
                <Input 
                  value={customData.bracuDepartment} 
                  onChange={(e) => setCustomData({...customData, bracuDepartment: e.target.value})}
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
                />
              </div>

              {/* BUCC Department */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">BUCC Dept (Assigned)</Label>
                <Input 
                  value={customData.buccDepartment} 
                  onChange={(e) => setCustomData({...customData, buccDepartment: e.target.value})}
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex justify-between">
                  System Password
                  <button 
                    onClick={() => setCustomData({...customData, password: generatePassword()})}
                    className="text-primary hover:underline lowercase font-normal tracking-normal normal-case"
                  >
                    Regenerate
                  </button>
                </Label>
                <div className="relative">
                  <Input 
                    value={customData.password} 
                    onChange={(e) => setCustomData({...customData, password: e.target.value})}
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg font-mono"
                  />
                  <ShieldCheck className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                </div>
                <p className="text-[10px] text-muted-foreground italic">This password will be sent to the member via email.</p>
              </div>
            </div>
          </div>

          <SheetFooter className="pt-6 mt-auto shrink-0 border-t border-border bg-background py-4">
            <Button
              className="w-full bg-foreground text-background py-6 font-medium transition-all hover:opacity-90"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate({
                evaluationId: selectedMember?._id,
                ...customData
              })}
            >
              {mutation.isPending ? "Onboarding..." : "Finalize & Send Welcome Email"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
