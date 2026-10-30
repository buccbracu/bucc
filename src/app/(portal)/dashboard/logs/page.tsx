"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Heading from "@/components/portal/heading";
import SpinnerComponent from "@/components/SpinnerComponent";
import { canAccessTaskSubmissions, isSuperUser } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn, formatCommentText } from "@/lib/utils";
import { 
  History, 
  Search, 
  RefreshCw, 
  FileSpreadsheet, 
  FileCode, 
  ShieldAlert, 
  Clock, 
  User, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Layers, 
  Database,
  UserCheck,
  Calendar,
  AlertTriangle,
  Trash2,
  CalendarX
} from "lucide-react";

const CATEGORIES = [
  { id: "ALL", label: "All Activity" },
  { id: "Recruitment", label: "Recruitment" },
  { id: "Members", label: "Members" },
  { id: "System", label: "System & Flush" },
  { id: "Events", label: "Events" },
  { id: "Blogs", label: "Blogs" },
  { id: "Projects", label: "Projects" },
];

export default function ActivityLogsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [page, setPage] = useState(1);
  const [search, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [expandedLogIds, setExpandedLogIds] = useState<Record<string, boolean>>({});
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const currentUser = session?.user as any;
  const hasAccess = currentUser ? canAccessTaskSubmissions(currentUser) : false;
  const canDeleteLogs = currentUser ? isSuperUser(currentUser) : false;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [purgeStartDate, setPurgeStartDate] = useState("");
  const [purgeEndDate, setPurgeEndDate] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Activity Logs
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["activity-logs", page, search, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "25");
      if (search.trim()) params.set("search", search.trim());
      if (selectedCategory !== "ALL") params.set("category", selectedCategory);

      const res = await fetch(`/api/logs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch activity logs");
      return res.json();
    },
    enabled: sessionStatus === "authenticated" && hasAccess,
  });

  // Fetch Stats Summary
  const { data: statsData } = useQuery({
    queryKey: ["activity-logs-stats"],
    queryFn: async () => {
      const res = await fetch("/api/logs?stats=true");
      if (!res.ok) return null;
      return res.json();
    },
    enabled: sessionStatus === "authenticated" && hasAccess,
    refetchInterval: 30000,
  });

  const toggleExpand = (id: string) => {
    setExpandedLogIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExport = async (format: "csv" | "json") => {
    try {
      setIsExporting(format);
      const res = await fetch(`/api/logs?format=${format}`);
      if (!res.ok) throw new Error(`Export failed (${res.status})`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bucc_activity_logs_${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Successfully exported logs as ${format.toUpperCase()}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to export logs");
    } finally {
      setIsExporting(null);
    }
  };

  const setQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setPurgeStartDate(start.toISOString().split("T")[0]);
    setPurgeEndDate(end.toISOString().split("T")[0]);
  };

  const handlePurgeLogs = async () => {
    if (!purgeStartDate || !purgeEndDate) {
      toast.error("Please select both start and end dates.");
      return;
    }
    if (new Date(purgeStartDate) > new Date(purgeEndDate)) {
      toast.error("Start date cannot be later than end date.");
      return;
    }

    try {
      setIsDeleting(true);
      const res = await fetch("/api/logs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: purgeStartDate, endDate: purgeEndDate }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to purge logs");

      toast.success(result.message || `Successfully purged ${result.deletedCount} log(s)`);
      setIsDeleteDialogOpen(false);
      setPurgeStartDate("");
      setPurgeEndDate("");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to purge logs");
    } finally {
      setIsDeleting(false);
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <SpinnerComponent />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <Card className="border-destructive/40 bg-destructive/5 text-center p-8 mt-12">
          <div className="flex justify-center mb-4 text-destructive">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <CardTitle className="text-xl font-bold">Access Restricted</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground max-w-md mx-auto">
            Activity and audit logs are strictly reserved for the Governing Body, R&amp;D Directors &amp; Assistant Directors, and HR Directors &amp; Assistant Directors.
          </CardDescription>
        </Card>
      </div>
    );
  }

  const logs = data?.logs || [];
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 1 };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <Heading
            headingText="Activity & Audit Logs"
            subHeadingText="Complete chronological trace of database mutations, recruitment evaluations, comment updates, and approvals."
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0 md:mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
            disabled={isExporting !== null}
            className="flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            {isExporting === "csv" ? "Exporting..." : "Export CSV"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("json")}
            disabled={isExporting !== null}
            className="flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-600" />
            {isExporting === "json" ? "Exporting..." : "Export JSON"}
          </Button>
          {canDeleteLogs && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-1.5 text-rose-600 border-rose-300 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Purge by Date
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs border-border/80 bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Logs</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {statsData?.totalLogs ?? "..."}
              </h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <History className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80 bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status Changes</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {statsData?.totalStatusChanges ?? "..."}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80 bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Comment Revisions</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {statsData?.totalCommentUpdates ?? "..."}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80 bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Member Approvals</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {statsData?.totalApprovals ?? "..."}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="shadow-xs border-border/80">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by actor, candidate ID, candidate name, or activity summary..."
                value={search}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-9 bg-background"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/60">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logs Feed */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="py-4 px-6 border-b border-border/60 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Audit Stream</CardTitle>
            <CardDescription className="text-xs">
              Showing {logs.length} of {pagination.total} recorded events
            </CardDescription>
          </div>
          {isFetching && <span className="text-xs text-muted-foreground animate-pulse">Syncing...</span>}
        </CardHeader>

        <CardContent className="p-0 divide-y divide-border/60">
          {isLoading ? (
            <div className="py-16 text-center">
              <SpinnerComponent />
              <p className="text-xs text-muted-foreground mt-3">Loading audit records...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <History className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-medium text-foreground">No activity logs found</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No logs match the current search filters, or no mutations have been recorded yet.
              </p>
            </div>
          ) : (
            logs.map((log: any) => {
              const isExpanded = !!expandedLogIds[log._id];
              const isStatusChange = log.action === "RECRUITMENT_STATUS_CHANGE";
              const isCommentUpdate = log.action === "RECRUITMENT_COMMENT_UPDATE";
              const isDeptChange = log.action === "RECRUITMENT_DEPARTMENT_CHANGE";
              const hasDiff = log.details && (log.details.oldValue !== undefined || log.details.newValue !== undefined);

              return (
                <div key={log._id} className="p-4 md:p-5 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: badges, actor, summary */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* HTTP Method Badge */}
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-mono uppercase px-1.5 py-0.5",
                            log.method === "POST" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
                            log.method === "PATCH" && "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
                            log.method === "PUT" && "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
                            log.method === "DELETE" && "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                          )}
                        >
                          {log.method}
                        </Badge>

                        {/* Category Badge */}
                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                          {log.category}
                        </Badge>

                        {/* Action Specific Indicator */}
                        {isStatusChange && (
                          <Badge className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30">
                            Status Flip
                          </Badge>
                        )}
                        {isCommentUpdate && (
                          <Badge className="text-[10px] bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30">
                            Comment Edited
                          </Badge>
                        )}
                        {log.action === "MEMBER_APPROVED" && (
                          <Badge className="text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                            Account Approved
                          </Badge>
                        )}
                        {log.action === "DATA_FLUSH" && (
                          <Badge className="text-[10px] bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30">
                            Collection Flush
                          </Badge>
                        )}

                        {/* Target ID / Candidate */}
                        {log.targetId && (
                          <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            ID: {log.targetId}
                          </span>
                        )}
                      </div>

                      {/* Summary sentence */}
                      <p className="text-sm font-medium text-foreground leading-snug">
                        {log.summary}
                      </p>

                      {/* Actor Info */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-0.5">
                        <span className="inline-flex items-center gap-1 font-medium text-foreground">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          {log.actor?.name || "System"}
                        </span>
                        {log.actor?.designation && (
                          <span>
                            ({log.actor.designation}
                            {log.actor.department ? ` • ${log.actor.department}` : ""})
                          </span>
                        )}
                        {log.actor?.email && (
                          <span className="hidden md:inline text-muted-foreground/70">
                            &lt;{log.actor.email}&gt;
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Timestamp & Diff toggle */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : ""}
                        </span>
                      </div>

                      {hasDiff && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(log._id)}
                          className="h-7 px-2 text-xs text-primary flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>
                              Hide Diff <ChevronUp className="w-3 h-3" />
                            </>
                          ) : (
                            <>
                              View Diff <ChevronDown className="w-3 h-3" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Diff Box */}
                  {hasDiff && isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border/60 space-y-2 animate-in fade-in duration-150">
                      {isStatusChange && (
                        <div className="flex items-center gap-2 text-xs bg-muted/50 p-2.5 rounded-md">
                          <span className="font-semibold text-muted-foreground">Status Transition:</span>
                          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium line-through">
                            {log.details?.oldValue || "None"}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                            {log.details?.newValue || "None"}
                          </span>
                        </div>
                      )}

                      {isDeptChange && (
                        <div className="flex items-center gap-2 text-xs bg-muted/50 p-2.5 rounded-md">
                          <span className="font-semibold text-muted-foreground">Department Reassigned:</span>
                          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 font-medium">
                            {log.details?.oldValue || "Unassigned"}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-medium">
                            {log.details?.newValue || "Unassigned"}
                          </span>
                        </div>
                      )}

                      {isCommentUpdate && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="bg-rose-500/5 border border-rose-500/20 p-2.5 rounded-md space-y-1">
                            <span className="font-semibold text-rose-700 dark:text-rose-400 block">
                              Previous Comment:
                            </span>
                            <p className="text-muted-foreground italic whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                              {formatCommentText(log.details?.oldValue)}
                            </p>
                          </div>
                          <div className="bg-emerald-500/5 border border-emerald-500/20 p-2.5 rounded-md space-y-1">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400 block">
                              Updated Comment:
                            </span>
                            <p className="text-foreground whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                              {formatCommentText(log.details?.newValue)}
                            </p>
                          </div>
                        </div>
                      )}

                      {!isStatusChange && !isCommentUpdate && !isDeptChange && (
                        <div className="bg-muted/40 p-2.5 rounded-md text-xs font-mono overflow-x-auto">
                          <pre>{JSON.stringify(log.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total items)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Purge Logs by Date Range Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <Trash2 className="w-5 h-5" />
              <DialogTitle className="text-lg">Delete Logs by Date Range</DialogTitle>
            </div>
            <DialogDescription>
              Permanently delete activity and audit logs within a specific time window. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-md p-3 text-xs text-rose-700 dark:text-rose-300">
              <span className="font-semibold block mb-0.5">Authorization Notice:</span>
              Only Governing Body (GB) members and R&amp;D Directors &amp; Assistant Directors have clearance to delete audit logs.
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2.5"
                  onClick={() => setQuickRange(7)}
                >
                  Past 7 Days
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2.5"
                  onClick={() => setQuickRange(30)}
                >
                  Past 30 Days
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2.5"
                  onClick={() => setQuickRange(90)}
                >
                  Past 90 Days
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="purge-start" className="text-xs font-medium">Start Date</Label>
                <Input
                  id="purge-start"
                  type="date"
                  value={purgeStartDate}
                  onChange={(e) => setPurgeStartDate(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="purge-end" className="text-xs font-medium">End Date</Label>
                <Input
                  id="purge-end"
                  type="date"
                  value={purgeEndDate}
                  onChange={(e) => setPurgeEndDate(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handlePurgeLogs}
              disabled={isDeleting || !purgeStartDate || !purgeEndDate}
              className="flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isDeleting ? "Deleting Logs..." : "Permanently Delete Logs"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
