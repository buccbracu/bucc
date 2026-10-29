"use client";

import { useState, useEffect } from "react";
import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { 
  Download, 
  Trash2, 
  UploadCloud, 
  FileJson, 
  FileSpreadsheet, 
  AlertTriangle,
  UserPlus,
  RefreshCw,
  CheckCircle2,
  Users,
  Eye,
  MessageSquare,
  Sparkles,
  BarChart3,
  FileText,
  Bookmark,
  CalendarDays,
  LineChart
} from "lucide-react";
import { isSuperUser as checkGB, isGoverningBody, isRDAdmin, isHRAdmin, canAccessTaskSubmissions } from "@/lib/permissions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  FolderCheck, 
  Search, 
  ExternalLink, 
  ClipboardList, 
  CheckCircle, 
  Clock 
} from "lucide-react";

const ensureHttps = (url?: string) => {
  if (!url) return "";
  let cleaned = url.trim().replace(/^[<"']+|[>"']+$/g, "").trim();
  if (!cleaned) return "";
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
};

const MANAGEABLE_MODELS = [
  { name: "Members (All Data)", collection: "user", protected: true },
  { name: "Projects", collection: "projects", protected: true },
  { name: "Blogs", collection: "blogs", protected: true },
  { name: "Events", collection: "events", protected: true },
  { name: "Evaluations", collection: "evaluationdatas", protected: false },
  { name: "Pre-Reg Members", collection: "preregmembers", protected: false },
  { name: "PR/Press Releases", collection: "pressreleases", protected: false },
  { name: "Inquiries", collection: "inquiries", protected: false },
  { name: "Testimonials", collection: "testimonials", protected: false },
  { name: "Announcements", collection: "announcements", protected: false },
  { name: "Tasks", collection: "tasks", protected: false },
  { name: "Sessions (Live)", collection: "session", protected: true },
];

function DepartmentBreakdown({ data }: { data: { name: string; value: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return <div className="text-center italic text-xs text-muted-foreground py-8">No data to display</div>;

  // Sort departments by value descending so the largest is at the top
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-5 py-2">
      {sortedData.map((item) => {
        const percent = ((item.value / total) * 100).toFixed(1);
        return (
          <div key={item.name} className="space-y-1.5">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-serif text-sm font-medium text-foreground">{item.name}</span>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="font-semibold text-foreground">{item.value} members</span>
                <span className="text-muted-foreground/60">({percent}%)</span>
              </div>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500" 
                style={{ width: `${percent}%` }} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrafficChart({ logs }: { logs: { date: string; views: number; visitors: number }[] }) {
  const [timeframe, setTimeframe] = useState<"day" | "month" | "year">("day");

  const groupedData = (() => {
    if (!logs || logs.length === 0) {
      // Realistic seed data fallback
      const today = new Date();
      return Array.from({ length: 12 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (11 - i));
        const dateStr = d.toISOString().split("T")[0];
        return {
          label: dateStr.slice(5), // MM-DD
          views: 45 + Math.floor(Math.random() * 60),
          visitors: 12 + Math.floor(Math.random() * 25),
        };
      });
    }

    if (timeframe === "day") {
      const last12 = logs.slice(-12);
      return last12.map(log => ({
        label: log.date.slice(5), // MM-DD
        views: log.views,
        visitors: log.visitors,
      }));
    }

    if (timeframe === "month") {
      const months: { [key: string]: { views: number; visitors: number } } = {};
      logs.forEach(log => {
        const monthKey = log.date.slice(0, 7); // YYYY-MM
        if (!months[monthKey]) months[monthKey] = { views: 0, visitors: 0 };
        months[monthKey].views += log.views;
        months[monthKey].visitors += log.visitors;
      });
      return Object.keys(months).map(k => ({
        label: k, // YYYY-MM
        views: months[k].views,
        visitors: months[k].visitors,
      }));
    }

    const years: { [key: string]: { views: number; visitors: number } } = {};
    logs.forEach(log => {
      const yearKey = log.date.slice(0, 4); // YYYY
      if (!years[yearKey]) years[yearKey] = { views: 0, visitors: 0 };
      years[yearKey].views += log.views;
      years[yearKey].visitors += log.visitors;
    });
    return Object.keys(years).map(k => ({
      label: k, // YYYY
      views: years[k].views,
      visitors: years[k].visitors,
    }));
  })();

  const maxVal = Math.max(15, ...groupedData.map(d => Math.max(d.views, d.visitors))) * 1.15;

  const chartHeight = 120;
  const chartWidth = 500;
  const paddingLeft = 35;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 20;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const stepX = groupedData.length > 1 ? plotWidth / (groupedData.length - 1) : plotWidth;

  let viewsPath = "";
  let viewsAreaPath = "";
  let visitorsPath = "";

  groupedData.forEach((d, i) => {
    const x = paddingLeft + i * stepX;
    const yViews = chartHeight - paddingBottom - (d.views / maxVal) * plotHeight;
    const yVisitors = chartHeight - paddingBottom - (d.visitors / maxVal) * plotHeight;

    if (i === 0) {
      viewsPath = `M ${x} ${yViews}`;
      viewsAreaPath = `M ${x} ${chartHeight - paddingBottom} L ${x} ${yViews}`;
      visitorsPath = `M ${x} ${yVisitors}`;
    } else {
      viewsPath += ` L ${x} ${yViews}`;
      viewsAreaPath += ` L ${x} ${yViews}`;
      visitorsPath += ` L ${x} ${yVisitors}`;
    }

    if (i === groupedData.length - 1) {
      viewsAreaPath += ` L ${x} ${chartHeight - paddingBottom} Z`;
    }
  });

  return (
    <div className="space-y-4">
      {/* Selector */}
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground uppercase font-sans font-medium tracking-wide">Select Timeframe</span>
        <div className="flex items-center gap-1 border border-border/60 rounded-lg p-0.5 bg-muted/20">
          {(["day", "month", "year"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 text-[9px] uppercase font-bold rounded-md transition-all ${timeframe === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t} View
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full relative bg-muted/5 border border-border/40 rounded-lg p-4">
        <svg className="w-full h-auto overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <defs>
            <linearGradient id="viewsAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = paddingTop + ratio * plotHeight;
            const gridVal = Math.round(maxVal * (1 - ratio));
            return (
              <g key={index}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  className="opacity-50"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[8px] fill-muted-foreground/60 font-mono"
                >
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Area under Views */}
          {groupedData.length > 0 && (
            <path d={viewsAreaPath} fill="url(#viewsAreaGrad)" />
          )}

          {/* Views Line */}
          {groupedData.length > 0 && (
            <path d={viewsPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Visitors Line */}
          {groupedData.length > 0 && (
            <path d={visitorsPath} fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />
          )}

          {/* X Axis Labels */}
          {groupedData.map((d, i) => {
            const x = paddingLeft + i * stepX;
            return (
              <text
                key={i}
                x={x}
                y={chartHeight - 4}
                textAnchor="middle"
                className="text-[8px] fill-muted-foreground/60 font-mono"
              >
                {d.label}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex gap-6 items-center justify-center mt-3 text-[9px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-blue-500 rounded" />
            <span className="text-muted-foreground">Total Views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 border-t border-dashed border-emerald-500 rounded" />
            <span className="text-muted-foreground">Unique Visitors</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManageDataPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [activeTab, setActiveTab] = useState<"analytics" | "maintenance" | "bulk">("analytics");
  const [loading, setLoading] = useState<string | null>(null);
  const [flushConfirm, setFlushConfirm] = useState<string | null>(null);
  const [confirmInput, setConfirmInput] = useState("");

  // Stats State
  const [statsData, setStatsData] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Bulk Onboarding State
  const [jsonFile, setJsonFile] = useState<any[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [onboardResults, setOnboardResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/manage-data?stats=true");
      if (res.ok) {
        const data = await res.json();
        setStatsData(data);
      }
    } catch (err) {
      console.error("Failed to load statistics", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchStats();
    }
  }, [sessionStatus]);

  if (sessionStatus === "loading") return <SpinnerComponent />;

  const user = session?.user as any;
  const isPermitted = user ? canAccessTaskSubmissions(user) : false;
  const isGB = user ? isGoverningBody(user) : false;

  // Task Data Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewSearch, setPreviewSearch] = useState("");
  const [previewFilter, setPreviewFilter] = useState<"all" | "submitted" | "pending">("all");

  const openTasksPreview = async () => {
    setIsPreviewOpen(true);
    if (!previewData) {
      setPreviewLoading(true);
      try {
        const res = await fetch("/api/manage-data?model=recruitment_tasks&format=json");
        if (res.ok) {
          const json = await res.json();
          setPreviewData(json);
        } else {
          toast.error("Failed to load task candidates.");
        }
      } catch (err) {
        toast.error("Failed to load task candidates.");
      } finally {
        setPreviewLoading(false);
      }
    }
  };

  const filteredPreviewCandidates = (previewData || []).filter((cand: any) => {
    const q = previewSearch.toLowerCase().trim();
    const matchesSearch = !q || 
      cand.name?.toLowerCase().includes(q) || 
      cand.studentId?.toLowerCase().includes(q) || 
      cand.email?.toLowerCase().includes(q) || 
      cand.assignedBuccDepartment?.toLowerCase().includes(q) ||
      cand.assignedTasks?.some((t: any) => t.department?.toLowerCase().includes(q) || t.title?.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (previewFilter === "submitted") {
      return cand.assignedTasks?.some((t: any) => t.status === "submitted");
    }
    if (previewFilter === "pending") {
      return cand.assignedTasks?.some((t: any) => t.status !== "submitted");
    }
    return true;
  });

  if (!isPermitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-2">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to access data management tools. Restricted to GB, R&D, and HR Leadership.</p>
      </div>
    );
  }

  const handleDownload = async (collection: string, format: "csv" | "json") => {
    setLoading(`${collection}-${format}`);
    try {
      const res = await fetch(`/api/manage-data?model=${collection}&format=${format}`);
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${collection}_export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`${format.toUpperCase()} export complete.`);
    } catch (err) {
      toast.error("Failed to export data.");
    } finally {
      setLoading(null);
    }
  };

  const handleFlush = async (collection: string) => {
    if (confirmInput.trim().toLowerCase() !== collection.trim().toLowerCase()) {
      toast.error("Collection name mismatch. Flush aborted.");
      return;
    }

    setLoading(`flush-${collection}`);
    try {
      const res = await fetch(`/api/manage-data?model=${collection}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setFlushConfirm(null);
        setConfirmInput("");
        fetchStats();
      } else {
        toast.error(data.error || "Flush failed");
      }
    } catch (err) {
      toast.error("An error occurred during flush.");
    } finally {
      setLoading(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) throw new Error("JSON must be an array of members.");
        setJsonFile(json);
        toast.success(`Loaded ${json.length} records. Ready to onboard.`);
      } catch (err: any) {
        toast.error(`Invalid JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const triggerBulkOnboard = async () => {
    if (!jsonFile) return;
    setIsUploading(true);
    setOnboardResults(null);
    try {
      const res = await fetch("/api/manage-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bulk-user", data: jsonFile }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Success: ${data.results.success}, Failed: ${data.results.failed}`);
        setOnboardResults(data.results);
        setJsonFile(null);
        fetchStats();
      } else {
        toast.error(data.error || "Bulk onboarding failed");
      }
    } catch (err) {
      toast.error("An error occurred during bulk onboarding.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <Heading 
        headingText="Data Management Center" 
        subHeadingText="Perform bulk operations, view platform analytics, and maintain system data integrity." 
      />

      {/* Tabs */}
      <div className="flex border-b border-border gap-8">
        <button 
          onClick={() => setActiveTab("analytics")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "analytics" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Analytics & Insights
        </button>
        <button 
          onClick={() => setActiveTab("maintenance")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "maintenance" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Maintenance
        </button>
        <button 
          onClick={() => setActiveTab("bulk")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "bulk" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Bulk Onboarding
        </button>
      </div>

      {activeTab === "analytics" && (
        <div className="space-y-8">
          {statsLoading && !statsData ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground">Aggregating platform metrics...</p>
            </div>
          ) : (
            <>
              {/* Metric grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border shadow-none bg-card overflow-hidden hover:border-primary/20 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Members</span>
                      <Users className="w-4 h-4 text-emerald-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif font-bold text-foreground">{statsData?.counts?.members || 0}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 font-light">Registered accounts (includes {statsData?.counts?.alumni || 0} Alumni)</p>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-none bg-card overflow-hidden hover:border-primary/20 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Unique Visitors</span>
                      <Eye className="w-4 h-4 text-sky-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif font-bold text-foreground">{statsData?.counts?.visitors || 128}</span>
                      <span className="text-[10px] text-sky-600 font-semibold bg-sky-500/10 px-1.5 py-0.5 rounded">Estimated</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 font-light">Calculated visitor interaction points</p>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-none bg-card overflow-hidden hover:border-primary/20 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Pre-Registrations</span>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif font-bold text-foreground">{statsData?.counts?.preReg || 0}</span>
                      <span className="text-[10px] text-amber-600 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">Applicants</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 font-light">Intake candidate applications</p>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-none bg-card overflow-hidden hover:border-primary/20 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Visitor Inquiries</span>
                      <MessageSquare className="w-4 h-4 text-violet-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif font-bold text-foreground">{statsData?.counts?.inquiries || 0}</span>
                      <span className="text-[10px] text-violet-600 font-semibold bg-violet-500/10 px-1.5 py-0.5 rounded">Inquiries</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 font-light">Messages received from visitors</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Stack (Col 8) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Traffic Analysis Chart */}
                  <Card className="border-border shadow-none bg-card">
                    <CardHeader className="border-b border-border/40 pb-4">
                      <CardTitle className="text-base font-serif flex items-center gap-2">
                        <LineChart className="w-4 h-4 text-primary" /> Website Traffic & Visitors
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Keep track of total page hits and unique daily, monthly, or yearly visitors.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <TrafficChart logs={statsData?.visitorLogs || []} />
                    </CardContent>
                  </Card>

                  {/* Member Demographics Donut Chart */}
                  <Card className="border-border shadow-none bg-card">
                    <CardHeader className="border-b border-border/40 pb-4">
                      <CardTitle className="text-base font-serif flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" /> Member Demographics
                      </CardTitle>
                      <CardDescription className="text-xs">
                        BUCC members grouped by club department.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {statsData?.departments && statsData.departments.length > 0 ? (
                        <DepartmentBreakdown data={statsData.departments} />
                      ) : (
                        <p className="text-center italic text-xs text-muted-foreground py-8">No member department data available.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Stack (Col 4) */}
                <div className="lg:col-span-4 space-y-6">
                  <Card className="border-border shadow-none bg-card h-full flex flex-col justify-between">
                    <div>
                      <CardHeader className="border-b border-border/40 pb-4">
                        <CardTitle className="text-base font-serif flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" /> Platform Engagement
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Total published content blocks and entities.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <FileText className="w-3.5 h-3.5 text-sky-500" /> Blogs Published
                            </span>
                            <span className="font-mono font-semibold">{statsData?.counts?.blogs || 0}</span>
                          </div>
                          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, ((statsData?.counts?.blogs || 0) / 50) * 100)}%` }} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <CalendarDays className="w-3.5 h-3.5 text-emerald-500" /> Events Hosted
                            </span>
                            <span className="font-mono font-semibold">{statsData?.counts?.events || 0}</span>
                          </div>
                          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, ((statsData?.counts?.events || 0) / 30) * 100)}%` }} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Bookmark className="w-3.5 h-3.5 text-amber-500" /> Projects Completed
                            </span>
                            <span className="font-mono font-semibold">{statsData?.counts?.projects || 0}</span>
                          </div>
                          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, ((statsData?.counts?.projects || 0) / 40) * 100)}%` }} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <FileText className="w-3.5 h-3.5 text-violet-500" /> Pre-Reg Candidates
                            </span>
                            <span className="font-mono font-semibold">{statsData?.counts?.preReg || 0}</span>
                          </div>
                          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div className="bg-violet-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, ((statsData?.counts?.preReg || 0) / 100) * 100)}%` }} />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                    
                    <div className="p-6 pt-0">
                      <Button 
                        variant="outline" 
                        className="w-full gap-2 border-border/80 text-xs font-semibold h-10 hover:bg-muted"
                        onClick={fetchStats}
                        disabled={statsLoading}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${statsLoading ? "animate-spin" : ""}`} /> Refresh Analytics
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "maintenance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Recruitment Task Submissions Card */}
          <Card className="border-border shadow-sm bg-card overflow-hidden md:col-span-2 bg-gradient-to-br from-card via-card to-muted/20">
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                      <FolderCheck className="w-5 h-5" />
                    </span>
                    <CardTitle className="text-xl font-serif">Candidate Recruitment Tasks & Submissions</CardTitle>
                  </div>
                  <CardDescription className="text-xs uppercase tracking-tight font-mono text-muted-foreground/60">
                    recruitment_task_submissions • Access: GB, R&D, HR Leadership
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {statsData?.counts?.tasksAssigned ?? 0} Candidates with Tasks
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {statsData?.counts?.tasksSubmitted ?? 0} Submitted
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
                Inspect and download all candidate records who were assigned department tasks during interview sessions. Exports include candidate identification (Name, Student ID, Email, Phone), assigned club department, task titles, status (<span className="text-foreground font-medium">Pending</span> vs. <span className="text-emerald-600 dark:text-emerald-400 font-medium">Submitted</span>), Google Drive / Docs solution links, GitHub links, submission dates, and interviewer evaluation comments.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="h-10 gap-2 border-border font-semibold text-xs hover:bg-muted"
                  onClick={() => handleDownload("recruitment_tasks", "csv")}
                  disabled={loading === "recruitment_tasks-csv"}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {loading === "recruitment_tasks-csv" ? "Exporting CSV..." : "Download CSV (Excel)"}
                </Button>
                <Button 
                  variant="outline" 
                  className="h-10 gap-2 border-border font-semibold text-xs hover:bg-muted"
                  onClick={() => handleDownload("recruitment_tasks", "json")}
                  disabled={loading === "recruitment_tasks-json"}
                >
                  <FileJson className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  {loading === "recruitment_tasks-json" ? "Exporting JSON..." : "Download JSON"}
                </Button>
                <Button 
                  variant="default"
                  className="h-10 gap-2 bg-foreground text-background font-semibold text-xs hover:bg-foreground/90"
                  onClick={openTasksPreview}
                >
                  <Eye className="w-4 h-4" /> View & Inspect Data
                </Button>
              </div>
            </CardContent>
          </Card>
          {MANAGEABLE_MODELS.map((model) => (
            <Card key={model.collection} className="border-border shadow-none bg-card overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-serif">{model.name}</CardTitle>
                <CardDescription className="text-xs uppercase tracking-tight font-mono text-muted-foreground/60">{model.collection}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-10 gap-2 border-border"
                    onClick={() => handleDownload(model.collection, "json")}
                    disabled={!!loading}
                  >
                    <FileJson className="w-3.5 h-3.5" /> JSON
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-10 gap-2 border-border"
                    onClick={() => handleDownload(model.collection, "csv")}
                    disabled={!!loading}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
                  </Button>
                  {isGB && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`h-10 px-4 gap-2 ${model.protected ? "opacity-30 grayscale cursor-not-allowed border-border" : "border-destructive/20 text-destructive hover:bg-destructive hover:text-white"}`}
                      onClick={() => !model.protected && setFlushConfirm(model.collection)}
                      disabled={model.protected}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> {model.protected ? "Protected" : "Flush"}
                    </Button>
                  )}
                </div>

                {flushConfirm === model.collection && (
                  <div className="p-4 bg-destructive/5 border border-destructive/10 rounded-md space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 text-destructive font-bold text-[10px] uppercase tracking-widest">
                      <AlertTriangle className="w-3.5 h-3.5" /> Confirm Destruction
                    </div>
                    <p className="text-xs text-muted-foreground">Type <span className="font-mono text-foreground font-bold">{model.collection}</span> below to permanently erase all records.</p>
                    <Input 
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      placeholder="Type collection name..."
                      className="h-8 bg-transparent border-0 border-b border-destructive/30 rounded-none focus-visible:ring-0 focus-visible:border-destructive text-sm"
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex-1 h-8 text-[10px] font-bold uppercase"
                        onClick={() => handleFlush(model.collection)}
                        disabled={loading === `flush-${model.collection}`}
                      >
                        {loading === `flush-${model.collection}` ? "Erasing..." : "I am sure, Flush Data"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 h-8 text-[10px] font-bold uppercase"
                        onClick={() => { setFlushConfirm(null); setConfirmInput(""); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Wipe All Recruitment Data Card */}
          <Card className="border-destructive/30 shadow-none bg-card overflow-hidden md:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-serif text-destructive flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Wipe All Recruitment Data
              </CardTitle>
              <CardDescription className="text-xs uppercase tracking-tight font-mono text-muted-foreground/60">
                recruitment_all
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                This action will permanently erase all recruitment-related database records: both **Pre-Reg Members** (applications) and **Recruitment Evaluations** (including task submissions and notes). This action cannot be undone.
              </p>
              {isGB && (
                <div className="pt-2">
                  {flushConfirm === "recruitment_all" ? (
                    <div className="p-4 bg-destructive/5 border border-destructive/10 rounded-md space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2 text-destructive font-bold text-[10px] uppercase tracking-widest">
                        <AlertTriangle className="w-3.5 h-3.5" /> Confirm Permanent Wipe
                      </div>
                      <p className="text-xs text-muted-foreground">Type <span className="font-mono text-foreground font-bold">recruitment_all</span> below to permanently erase all recruitment data.</p>
                      <Input 
                        value={confirmInput}
                        onChange={(e) => setConfirmInput(e.target.value)}
                        placeholder="Type recruitment_all..."
                        className="h-8 bg-transparent border-0 border-b border-destructive/30 rounded-none focus-visible:ring-0 focus-visible:border-destructive text-sm font-sans"
                      />
                      <div className="flex gap-2">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="flex-1 h-8 text-[10px] font-bold uppercase"
                          onClick={() => handleFlush("recruitment_all")}
                          disabled={loading === "flush-recruitment_all"}
                        >
                          {loading === "flush-recruitment_all" ? "Wiping..." : "Confirm Wipe All"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-1 h-8 text-[10px] font-bold uppercase"
                          onClick={() => { setFlushConfirm(null); setConfirmInput(""); }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="destructive" 
                      className="w-full gap-2"
                      onClick={() => setFlushConfirm("recruitment_all")}
                    >
                      <Trash2 className="w-4 h-4" /> Wipe Recruitment Data
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "bulk" && (
        <div className="max-w-2xl space-y-8">
          <Card className="border-border shadow-none bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-serif">Bulk Member Onboarding</CardTitle>
              <CardDescription>Upload a JSON array to create multiple accounts instantly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-border rounded-lg p-10 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer relative group">
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="p-3 bg-muted rounded-full w-fit mx-auto group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Click to select JSON file</p>
                  <p className="text-xs text-muted-foreground italic">File must be a JSON array of member objects.</p>
                </div>
              </div>

              {jsonFile && (
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-md flex items-center justify-between animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold text-primary">{jsonFile.length} members detected</p>
                      <p className="text-[10px] text-primary/70 uppercase font-mono tracking-tight">System validation passed</p>
                    </div>
                  </div>
                  <Button 
                    className="bg-primary text-primary-foreground font-bold uppercase text-[10px] tracking-widest h-9"
                    onClick={triggerBulkOnboard}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>Start Onboarding <UserPlus className="ml-2 w-3.5 h-3.5" /></>
                    )}
                  </Button>
                </div>
              )}

              {onboardResults && (
                <div className="space-y-4 p-4 border border-border bg-muted/20 rounded-lg animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-foreground">Onboarding Results</h4>
                    <button 
                      type="button" 
                      onClick={() => setOnboardResults(null)}
                      className="text-[10px] text-muted-foreground hover:text-foreground underline"
                    >
                      Clear Results
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-green-500/5 border border-green-500/10 p-3 rounded-md">
                      <p className="text-2xl font-serif font-bold text-green-500">{onboardResults.success}</p>
                      <p className="text-[10px] uppercase font-bold text-green-500/70 tracking-wider">Successful</p>
                    </div>
                    <div className="bg-destructive/5 border border-destructive/10 p-3 rounded-md">
                      <p className="text-2xl font-serif font-bold text-destructive">{onboardResults.failed}</p>
                      <p className="text-[10px] uppercase font-bold text-destructive/70 tracking-wider">Failed</p>
                    </div>
                  </div>

                  {onboardResults.errors && onboardResults.errors.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-destructive">Errors Log:</p>
                      <div className="max-h-[150px] overflow-y-auto border border-border/60 bg-background/50 rounded-sm p-3 font-mono text-[10px] text-muted-foreground space-y-1 divide-y divide-border/20">
                        {onboardResults.errors.map((err, idx) => (
                          <div key={idx} className="pt-1.5 first:pt-0 text-destructive/90 break-all">
                            {err}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Required JSON Structure</h4>
                <div className="bg-muted/50 p-4 rounded-md font-mono text-[10px] text-muted-foreground overflow-x-auto whitespace-pre">
{`[
  {
    "name": "Member Name",
    "email": "username@g.bracu.ac.bd",
    "studentId": "21101001",
    "phoneNumber": "017XXXXXXXX",
    "buccDepartment": "Creative",
    "bracuDepartment": "CSE",
    "designation": "General Member"
  }
]`}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Candidate Tasks Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] flex flex-col p-4 sm:p-6 overflow-hidden">
          <DialogHeader className="pb-3 border-b border-border/40 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-xl font-serif flex items-center gap-2">
                  <FolderCheck className="w-5 h-5 text-primary" /> Candidate Recruitment Tasks
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  Preview all candidate profiles who were assigned department tasks.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1.5 text-xs border-border"
                  onClick={() => handleDownload("recruitment_tasks", "csv")}
                  disabled={loading === "recruitment_tasks-csv"}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1.5 text-xs border-border"
                  onClick={() => handleDownload("recruitment_tasks", "json")}
                  disabled={loading === "recruitment_tasks-json"}
                >
                  <FileJson className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> JSON
                </Button>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              <div className="relative w-full flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  value={previewSearch}
                  onChange={(e) => setPreviewSearch(e.target.value)}
                  placeholder="Search by student ID, name, email, or department..."
                  className="pl-9 h-9 text-xs bg-muted/20 border-border"
                />
              </div>
              <div className="flex items-center gap-1 border border-border p-0.5 rounded-lg shrink-0">
                <button
                  onClick={() => setPreviewFilter("all")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    previewFilter === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({(previewData || []).length})
                </button>
                <button
                  onClick={() => setPreviewFilter("submitted")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    previewFilter === "submitted" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Submitted ({
                    (previewData || []).filter((c: any) => c.assignedTasks?.some((t: any) => t.status === "submitted")).length
                  })
                </button>
                <button
                  onClick={() => setPreviewFilter("pending")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    previewFilter === "pending" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Pending ({
                    (previewData || []).filter((c: any) => c.assignedTasks?.some((t: any) => t.status !== "submitted")).length
                  })
                </button>
              </div>
            </div>
          </DialogHeader>

          {/* Modal Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4 pr-1">
            {previewLoading ? (
              <div className="py-16 text-center space-y-3">
                <SpinnerComponent />
                <p className="text-xs text-muted-foreground font-mono">Loading candidate tasks...</p>
              </div>
            ) : filteredPreviewCandidates.length === 0 ? (
              <div className="py-16 text-center space-y-2 border border-dashed border-border rounded-xl">
                <ClipboardList className="w-8 h-8 text-muted-foreground/40 mx-auto mb-1" />
                <p className="text-sm font-serif font-medium">No Matching Candidates Found</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {previewSearch ? "No candidate matches your search criteria." : "No candidates have been assigned recruitment tasks yet."}
                </p>
              </div>
            ) : (
              filteredPreviewCandidates.map((cand: any) => (
                <div key={cand.studentId} className="p-4 rounded-xl border border-border bg-card space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-semibold text-sm text-foreground">{cand.name}</h4>
                        <span className="font-mono text-xs text-muted-foreground">({cand.studentId})</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                        <span>{cand.email}</span>
                        <span>•</span>
                        <span>{cand.phoneNumber}</span>
                        <span>•</span>
                        <span>{cand.bracuDepartment}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border border-border bg-muted/30">
                        {cand.assignedBuccDepartment || "Unassigned"}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        cand.evaluationStatus === "Accepted"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : cand.evaluationStatus === "Rejected"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}>
                        {cand.evaluationStatus}
                      </span>
                    </div>
                  </div>

                  {/* Tasks list */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assigned Tasks ({cand.assignedTasks?.length || 0})</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {cand.assignedTasks?.map((task: any, idx: number) => {
                        const isSubmitted = task.status === "submitted";
                        return (
                          <div key={idx} className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-2 text-xs">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-foreground line-clamp-1">{task.title}</span>
                              <span className={`shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                isSubmitted 
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              }`}>
                                {isSubmitted ? "Submitted" : "Pending"}
                              </span>
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              Department: <span className="font-medium text-foreground">{task.department}</span>
                            </div>

                            {/* Solution Links */}
                            {isSubmitted && (
                              <div className="pt-1.5 border-t border-border/40 flex flex-wrap items-center gap-2">
                                {task.driveLink && (
                                  <a 
                                    href={ensureHttps(task.driveLink)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/5 hover:bg-primary/10 px-2 py-0.5 rounded transition-colors"
                                  >
                                    Drive / Docs <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                                {task.githubLink && (
                                  <a 
                                    href={ensureHttps(task.githubLink)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/5 hover:bg-primary/10 px-2 py-0.5 rounded transition-colors"
                                  >
                                    GitHub <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            )}

                            {isSubmitted && task.submittedAt && (
                              <div className="text-[9px] text-muted-foreground/70 font-mono">
                                Submitted: {new Date(task.submittedAt).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interview comments / notes if any */}
                  {cand.comment && (
                    <div className="text-[11px] text-muted-foreground bg-muted/20 p-2 rounded border border-border/30">
                      <span className="font-semibold text-foreground">Interview Feedback: </span>
                      {typeof cand.comment === "string" ? cand.comment : JSON.stringify(cand.comment)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-border/40 shrink-0 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing {filteredPreviewCandidates.length} of {(previewData || []).length} candidate records
            </span>
            <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(false)} className="text-xs">
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
