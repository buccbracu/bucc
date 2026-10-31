"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertOctagon,
  Layers,
  ChevronDown,
  ChevronUp,
  BarChart3
} from "lucide-react";

export default function EvaluationStats({ 
  evaluationsStats, 
  defaultExpanded = false 
}: { 
  evaluationsStats: any; 
  defaultExpanded?: boolean; 
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [selectedStatus, setSelectedStatus] = useState<string>("Submitted");
  const [isBreakdownOpen, setIsBreakdownOpen] = useState<boolean>(true);

  const calculateTotal = (status: string) => {
    if (!evaluationsStats?.[status]) return 0;
    return Object.values(evaluationsStats[status]).reduce((acc: number, curr: any) => acc + (curr || 0), 0);
  };

  const calculateGrandTotal = () => {
    return ["Submitted", "Accepted", "Pending", "Rejected"].reduce(
      (acc, status) => acc + calculateTotal(status), 
      0
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return {
          bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
          border: "border-emerald-500/20 hover:border-emerald-500/40",
          text: "text-emerald-600 dark:text-emerald-400",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.05)]",
          bar: "bg-emerald-500",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        };
      case "Pending":
        return {
          bg: "bg-amber-500/5 dark:bg-amber-500/10",
          border: "border-amber-500/20 hover:border-amber-500/40",
          text: "text-amber-600 dark:text-amber-400",
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.05)]",
          bar: "bg-amber-500",
          icon: <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
        };
      case "Rejected":
        return {
          bg: "bg-rose-500/5 dark:bg-rose-500/10",
          border: "border-rose-500/20 hover:border-rose-500/40",
          text: "text-rose-600 dark:text-rose-400",
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.05)]",
          bar: "bg-rose-500",
          icon: <AlertOctagon className="w-5 h-5 text-rose-500" />
        };
      default: // Submitted
        return {
          bg: "bg-indigo-500/5 dark:bg-indigo-500/10",
          border: "border-indigo-500/20 hover:border-indigo-500/40",
          text: "text-indigo-600 dark:text-indigo-400",
          glow: "shadow-[0_0_15px_rgba(99,102,241,0.05)]",
          bar: "bg-indigo-500",
          icon: <Users className="w-5 h-5 text-indigo-500" />
        };
    }
  };

  const statuses = ["Submitted", "Accepted", "Pending", "Rejected"];
  const currentTotal = calculateTotal(selectedStatus);
  const grandTotal = calculateGrandTotal();

  // Extract department details for the selected status
  const deptData = evaluationsStats?.[selectedStatus] 
    ? Object.entries(evaluationsStats[selectedStatus]).map(([dept, count]: [string, any]) => ({
        name: dept,
        count: count ?? 0,
        percentage: currentTotal > 0 ? Math.round(((count ?? 0) / currentTotal) * 100) : 0
      })).sort((a, b) => b.count - a.count)
    : [];

  return (
    <div className="space-y-4">
      {/* Collapsible Header Toggle Bar */}
      <div 
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:px-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all cursor-pointer group select-none shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                Recruitment Statistics
              </span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                Total: {grandTotal}
              </span>
            </div>
            {!isExpanded && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-muted-foreground">
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">Submitted: {calculateTotal("Submitted")}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Accepted: {calculateTotal("Accepted")}</span>
                <span>•</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">Pending: {calculateTotal("Pending")}</span>
                <span>•</span>
                <span className="text-rose-600 dark:text-rose-400 font-medium">Rejected: {calculateTotal("Rejected")}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {isExpanded ? "Hide Stats" : "Show Stats"}
          </span>
          <div className="p-1 rounded-md bg-muted text-muted-foreground group-hover:text-foreground">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Analytics Content */}
      {isExpanded && (
        <div className="space-y-4 pt-1 animate-in fade-in-50 duration-200">
          {/* Metric Cards Grid - 4 Columns horizontally on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statuses.map((status) => {
              const total = calculateTotal(status);
              const style = getStatusColor(status);
              const isSelected = selectedStatus === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setSelectedStatus(status);
                    setIsBreakdownOpen(true);
                  }}
                  className={`w-full text-left rounded-xl border p-4 transition-all duration-300 ${style.bg} ${style.border} ${style.glow} ${
                    isSelected 
                      ? "ring-2 ring-primary border-transparent scale-[1.01]" 
                      : "hover:scale-[1.005] opacity-80 hover:opacity-100 cursor-pointer"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {status}
                      </span>
                      <div className="text-3xl font-serif font-semibold tracking-tight text-foreground">
                        {total}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-background/50 border border-border/30">
                      {style.icon}
                    </div>
                  </div>

                  {/* Progress bar representing share of grand total */}
                  <div className="mt-3 space-y-1">
                    <div className="w-full bg-muted/40 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                        style={{ width: `${grandTotal > 0 ? (total / grandTotal) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span>Share of Total</span>
                      <span>{grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Breakdown Panel */}
          <Card className="border-border shadow-none bg-card/50 backdrop-blur-sm overflow-hidden rounded-xl">
            <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-bold">
                    Department Breakdown
                  </CardTitle>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-muted border border-border text-foreground">
                    {selectedStatus}: {currentTotal}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors px-2 py-1 rounded hover:bg-muted cursor-pointer"
                >
                  <span>{isBreakdownOpen ? "Hide Breakdown" : "Show Breakdown"}</span>
                  {isBreakdownOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </CardHeader>
            {isBreakdownOpen && (
              <CardContent className="p-4">
                {currentTotal === 0 ? (
                  <p className="text-xs text-muted-foreground italic text-center py-4">
                    No candidates in {selectedStatus} status.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {deptData.map((dept) => (
                      <div 
                        key={dept.name} 
                        className="p-3 rounded-lg border border-border/60 bg-background/50 hover:border-border transition-colors space-y-2 group"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium truncate pr-2" title={dept.name}>
                            {dept.name}
                          </span>
                          <span className="font-mono text-foreground font-semibold shrink-0">
                            {dept.count} 
                            <span className="text-[10px] font-normal text-muted-foreground ml-1">
                              ({dept.percentage}%)
                            </span>
                          </span>
                        </div>
                        
                        {/* Sleek Gradient progress bar */}
                        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                              selectedStatus === "Accepted" ? "from-emerald-600 to-emerald-400" :
                              selectedStatus === "Pending" ? "from-amber-600 to-amber-400" :
                              selectedStatus === "Rejected" ? "from-rose-600 to-rose-400" :
                              "from-indigo-600 to-indigo-400"
                            }`}
                            style={{ width: `${dept.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
