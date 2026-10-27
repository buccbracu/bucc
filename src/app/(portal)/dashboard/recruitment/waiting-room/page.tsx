"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Heading from "@/components/portal/heading";
import SpinnerComponent from "@/components/SpinnerComponent";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { departmentsInfo } from "@/constants/departments";
import { toast } from "sonner";
import {
  Clock,
  Search,
  UserCheck,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Trash2,
  Users,
  ArrowRight,
  Eye,
  RefreshCw,
  X,
} from "lucide-react";

interface Candidate {
  _id: string;
  name: string;
  studentId: string;
  buccDepartment: string;
  waitingRoomStatus: "Waiting" | "Sent to Board";
  waitingRoomCheckedInAt: string;
}

export default function WaitingRoomPage() {
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const [studentIdInput, setStudentIdInput] = useState("");
  const [missingEvalAlert, setMissingEvalAlert] = useState<{
    name?: string;
    studentId: string;
    message: string;
  } | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Coordinator dialog
  const [isCoordDialogOpen, setIsCoordDialogOpen] = useState(false);
  const [selectedCoordinators, setSelectedCoordinators] = useState<Option[]>([]);

  // Fetch Waiting Room data
  const {
    data: waitingRoomData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["waiting-room"],
    queryFn: async () => {
      const res = await fetch("/api/recruitment/waiting-room");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load waiting room");
      }
      return res.json();
    },
    enabled: sessionStatus === "authenticated",
    refetchInterval: 10000, // 10s live polling
  });

  const candidates: Candidate[] = waitingRoomData?.candidates || [];
  const permissions = waitingRoomData?.permissions || {
    canModify: false,
    canManageCoordinators: false,
  };

  // Fetch Coordinators & active members when coordinator dialog opens
  const { data: coordinatorsData } = useQuery({
    queryKey: ["waiting-room-coordinators"],
    queryFn: async () => {
      const res = await fetch("/api/recruitment/waiting-room/coordinators");
      if (!res.ok) throw new Error("Failed to load coordinators");
      return res.json();
    },
    enabled: Boolean(permissions.canManageCoordinators && isCoordDialogOpen),
  });

  const { data: allActiveMembers } = useQuery({
    queryKey: ["all-active-members-minimal"],
    queryFn: async () => {
      const res = await fetch("/api/members?minimal=true");
      if (!res.ok) throw new Error("Failed to load members");
      const json = await res.json();
      return json.users || [];
    },
    enabled: Boolean(permissions.canManageCoordinators && isCoordDialogOpen),
  });

  // Check-In Mutation
  const checkInMutation = useMutation({
    mutationFn: async (id: string) => {
      setMissingEvalAlert(null);
      const res = await fetch("/api/recruitment/waiting-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "EVALUATION_MISSING") {
          setMissingEvalAlert({
            name: data.name,
            studentId: data.studentId || id,
            message: data.message,
          });
        }
        throw new Error(data.message || data.error || "Failed to check in");
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Candidate checked in!");
      setStudentIdInput("");
      setMissingEvalAlert(null);
      queryClient.invalidateQueries({ queryKey: ["waiting-room"] });
    },
    onError: (err: any) => {
      if (!err.message?.includes("EVALUATION_MISSING")) {
        toast.error(err.message);
      }
    },
  });

  // Status Update Mutation
  const statusMutation = useMutation({
    mutationFn: async ({
      evaluationId,
      status,
    }: {
      evaluationId: string;
      status: "Waiting" | "Sent to Board" | "remove";
    }) => {
      const res = await fetch("/api/recruitment/waiting-room", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evaluationId, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Queue updated!");
      queryClient.invalidateQueries({ queryKey: ["waiting-room"] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  // Coordinators Update Mutation
  const updateCoordinatorsMutation = useMutation({
    mutationFn: async (studentIds: string[]) => {
      const res = await fetch("/api/recruitment/waiting-room/coordinators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedCoordinators: studentIds }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update coordinators");
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Coordinators updated!");
      setIsCoordDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["waiting-room-coordinators"] });
      queryClient.invalidateQueries({ queryKey: ["waiting-room"] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const handleOpenCoordDialog = () => {
    if (coordinatorsData?.coordinatorsDetails) {
      setSelectedCoordinators(
        coordinatorsData.coordinatorsDetails.map((c: any) => ({
          label: `${c.name} (${c.studentId || c.designation})`,
          value: c.studentId,
        }))
      );
    }
    setIsCoordDialogOpen(true);
  };

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdInput.trim()) {
      toast.error("Please enter a Student ID");
      return;
    }
    checkInMutation.mutate(studentIdInput.trim());
  };

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(q) ||
        item.studentId.toLowerCase().includes(q);

      const matchesDept =
        selectedDept === "ALL" || item.buccDepartment === selectedDept;

      const matchesStatus =
        statusFilter === "ALL" || item.waitingRoomStatus === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [candidates, search, selectedDept, statusFilter]);

  // Statistics
  const waitingCount = candidates.filter((c) => c.waitingRoomStatus === "Waiting").length;
  const sentCount = candidates.filter((c) => c.waitingRoomStatus === "Sent to Board").length;

  // Options for coordinator selector
  const memberOptions: Option[] = useMemo(() => {
    if (!Array.isArray(allActiveMembers)) return [];
    return allActiveMembers
      .filter((m: any) => m.studentId && m.studentId.toString().trim())
      .map((m: any) => {
        const sId = m.studentId.toString().trim();
        return {
          label: `${m.name} (${sId}) - ${m.designation}${m.buccDepartment ? ` • ${m.buccDepartment}` : ""}`,
          value: sId,
        };
      });
  }, [allActiveMembers]);

  if (sessionStatus === "loading" || (isLoading && !waitingRoomData)) {
    return <SpinnerComponent />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-3">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground text-sm max-w-md">
          {(error as any)?.message || "You do not have permission to view the Waiting Room."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Heading
            headingText="Waiting Room Management"
            subHeadingText="Live candidate check-in and interview board queue."
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
            Sync Queue
          </Button>

          {permissions.canManageCoordinators && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenCoordDialog}
              className="text-xs h-9 border-primary/20 hover:bg-primary/5 text-primary"
            >
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Manage Coordinators
            </Button>
          )}
        </div>
      </div>

      {/* Read-Only Notice for general recruitment viewers */}
      {!permissions.canModify && (
        <div className="p-3.5 rounded-lg border border-border/80 bg-muted/40 text-muted-foreground text-xs flex items-center gap-2">
          <Eye className="w-4 h-4 shrink-0 text-primary" />
          <span>
            <strong>View-Only Mode:</strong> You can observe the live queue. Queue check-ins and board status modifications are handled by assigned desk coordinators.
          </span>
        </div>
      )}

      {/* Check-In Card (Only for coordinators / GB / R&D EB / HR EB) */}
      {permissions.canModify && (
        <Card className="border border-border/70 shadow-none bg-card rounded-xl">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" /> Candidate Front-Desk Check-In
            </CardTitle>
            <CardDescription className="text-xs">
              Enter the student ID of the arriving candidate to verify their evaluation submission and add them to the room queue.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <form onSubmit={handleCheckInSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Enter Student ID (e.g., 22101045)..."
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  className="h-10 text-sm font-mono tracking-wide"
                  disabled={checkInMutation.isPending}
                />
              </div>
              <Button
                type="submit"
                disabled={checkInMutation.isPending || !studentIdInput.trim()}
                className="h-10 px-6 font-medium text-xs uppercase tracking-wider"
              >
                {checkInMutation.isPending ? "Checking..." : "Check In Candidate"}
              </Button>
            </form>

            {/* Warning Alert if Evaluation is Missing */}
            {missingEvalAlert && (
              <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 text-xs space-y-2 animate-in fade-in duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Evaluation Form Incomplete!</span>
                  </div>
                  <button
                    onClick={() => setMissingEvalAlert(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="leading-relaxed">
                  <strong>{missingEvalAlert.name || "Candidate"}</strong> ({missingEvalAlert.studentId}) is registered in pre-registration records, but has <strong>not completed the online `/evaluation` form</strong>.
                </p>
                <div className="pt-1 text-[11px] text-amber-700 dark:text-amber-300 font-mono">
                  Direct the student to open: <span className="underline font-bold">/evaluation</span> on their mobile device or laptop before queueing.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Counter & Queue Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="cursor-pointer px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-muted"
            onClick={() => setStatusFilter("ALL")}
          >
            Total in Room: <span className="font-bold ml-1.5 font-mono">{candidates.length}</span>
          </Badge>

          <Badge
            variant="outline"
            className={`cursor-pointer px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              statusFilter === "Waiting"
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold"
                : "hover:bg-muted"
            }`}
            onClick={() => setStatusFilter(statusFilter === "Waiting" ? "ALL" : "Waiting")}
          >
            <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
            Waiting: <span className="ml-1 font-mono font-bold">{waitingCount}</span>
          </Badge>

          <Badge
            variant="outline"
            className={`cursor-pointer px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              statusFilter === "Sent to Board"
                ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 font-bold"
                : "hover:bg-muted"
            }`}
            onClick={() =>
              setStatusFilter(statusFilter === "Sent to Board" ? "ALL" : "Sent to Board")
            }
          >
            <ArrowRight className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
            Sent to Board: <span className="ml-1 font-mono font-bold">{sentCount}</span>
          </Badge>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search queue by name/ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 text-xs"
            />
          </div>

          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="h-9 w-full sm:w-56 text-xs">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Preferred Departments</SelectItem>
              {departmentsInfo.map((dept) => (
                <SelectItem key={dept.name} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Queue Table */}
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Preferred Department</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Queue Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-sans">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                    {candidates.length === 0
                      ? "The waiting room is currently empty. Check in candidates as they arrive."
                      : "No candidates match the selected filters."}
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => {
                  const checkInDate = candidate.waitingRoomCheckedInAt
                    ? new Date(candidate.waitingRoomCheckedInAt)
                    : null;

                  return (
                    <tr key={candidate._id} className="hover:bg-muted/20 transition-colors">
                      {/* Monospace Student ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                        {candidate.studentId}
                      </td>

                      {/* Candidate Name */}
                      <td className="py-3.5 px-4 font-serif font-medium text-sm text-foreground">
                        {candidate.name}
                      </td>

                      {/* Preferred Department */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-primary/5 text-primary border border-primary/10 rounded-md font-medium text-[11px]">
                          {candidate.buccDepartment || "Unassigned"}
                        </span>
                      </td>

                      {/* Checked-In Time */}
                      <td className="py-3.5 px-4 text-muted-foreground font-mono">
                        {checkInDate ? (
                          <span>
                            {checkInDate.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        ) : (
                          "Just now"
                        )}
                      </td>

                      {/* Queue Status Toggle */}
                      <td className="py-3.5 px-4">
                        {permissions.canModify ? (
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                statusMutation.mutate({
                                  evaluationId: candidate._id,
                                  status:
                                    candidate.waitingRoomStatus === "Waiting"
                                      ? "Sent to Board"
                                      : "Waiting",
                                })
                              }
                              disabled={statusMutation.isPending}
                              className={`h-7 text-[11px] font-semibold px-2.5 rounded-md border ${
                                candidate.waitingRoomStatus === "Sent to Board"
                                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                              }`}
                            >
                              {candidate.waitingRoomStatus === "Waiting" ? (
                                <Clock className="w-3 h-3 mr-1 text-amber-500" />
                              ) : (
                                <ArrowRight className="w-3 h-3 mr-1 text-indigo-500" />
                              )}
                              {candidate.waitingRoomStatus}
                            </Button>
                          </div>
                        ) : (
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-semibold ${
                              candidate.waitingRoomStatus === "Sent to Board"
                                ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                                : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {candidate.waitingRoomStatus}
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/dashboard/recruitment/${candidate._id}`}
                            title="Open Candidate Evaluation Workspace"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                            >
                              <ExternalLink className="w-3.5 h-3.5 mr-1" />
                              Evaluation
                            </Button>
                          </Link>

                          {permissions.canModify && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (
                                  confirm(`Remove ${candidate.name} from the waiting room queue?`)
                                ) {
                                  statusMutation.mutate({
                                    evaluationId: candidate._id,
                                    status: "remove",
                                  });
                                }
                              }}
                              disabled={statusMutation.isPending}
                              title="Dismiss / Remove from Queue"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Coordinators Dialog */}
      <Dialog open={isCoordDialogOpen} onOpenChange={setIsCoordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Assign Desk Coordinators
            </DialogTitle>
            <DialogDescription className="text-xs">
              Select active club members authorized to operate the Waiting Room check-in desk.
              Governing Body, R&D EB, and HR EB always retain master modification rights.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Search & Select Active Members
              </label>
              <MultipleSelector
                value={selectedCoordinators}
                onChange={setSelectedCoordinators}
                defaultOptions={memberOptions}
                placeholder="Type member name or student ID..."
                emptyIndicator={
                  <p className="text-center text-xs py-2 text-muted-foreground">
                    No matching active members found.
                  </p>
                }
              />
            </div>

            {/* List of currently assigned coordinators */}
            {selectedCoordinators.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Selected Coordinators ({selectedCoordinators.length}):
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1 border rounded-md p-2 bg-muted/20">
                  {selectedCoordinators.map((c) => (
                    <div
                      key={c.value}
                      className="text-xs flex items-center justify-between py-1 px-2 rounded bg-background border text-foreground"
                    >
                      <span className="font-medium truncate mr-2">{c.label}</span>
                      <button
                        onClick={() =>
                          setSelectedCoordinators(
                            selectedCoordinators.filter((s) => s.value !== c.value)
                          )
                        }
                        className="text-muted-foreground hover:text-destructive text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCoordDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() =>
                updateCoordinatorsMutation.mutate(selectedCoordinators.map((c) => c.value))
              }
              disabled={updateCoordinatorsMutation.isPending}
              className="text-xs"
            >
              {updateCoordinatorsMutation.isPending ? "Saving..." : "Save Coordinators"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
