"use client";

import { useState, useEffect } from "react";
import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Megaphone, 
  Database, 
  Plus, 
  Globe, 
  MessageSquare, 
  CheckCircle2,
  AlertTriangle,
  History,
  Trash2,
  Activity,
  Calendar,
  Layout,
  ArrowRight
} from "lucide-react";
import { isGoverningBody } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const getBroadcastData = async () => {
  const [annRes, bannerRes, configRes, tasksRes] = await Promise.all([
    fetch("/api/announcements"),
    fetch("/api/global-banner"),
    fetch("/api/config?key=recruitment_config"),
    fetch("/api/config?key=recruitment_default_tasks")
  ]);
  
  const announcements = await annRes.json();
  const banner = await bannerRes.json();
  const config = await configRes.json();
  const tasks = await tasksRes.json();
  
  return { 
    announcements, 
    banner, 
    config: config.value || { 
      isRegistrationOpen: false, 
      registrationTargetDate: "",
      isEvaluationOpen: false, 
      evaluationTargetDate: "",
      registrationMessage: "BUCC Recruitment Process is not ongoing. Please check our Facebook page for updates.",
      evaluationMessage: "BUCC is not accepting any more evaluations. Please contact HR or GB.",
      allowSERecruitmentAccess: false,
      isTasksPortalOpen: false,
      tasksDeadline: ""
    },
    defaultTasks: tasks.value || {}
  };
};

export default function BroadcastPage() {
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus } = useSession();
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: "", content: "" });
  const [bannerForm, setBannerForm] = useState({ message: "", link: "", isActive: true });
  
  // Recruitment Lifecycle Form
  const [lifecycleForm, setLifecycleForm] = useState({
    isRegistrationOpen: false,
    registrationTargetDate: "",
    isEvaluationOpen: false,
    evaluationTargetDate: "",
    registrationMessage: "BUCC Recruitment Process is not ongoing. Please check our Facebook page for updates.",
    evaluationMessage: "BUCC is not accepting any more evaluations. Please contact HR or GB.",
    allowSERecruitmentAccess: false,
    isTasksPortalOpen: false,
    tasksDeadline: ""
  });

  const departmentsList = [
    "Governing Body",
    "Communication and Marketing",
    "Creative",
    "Event Management",
    "Finance",
    "Human Resources",
    "Press Release and Publications",
    "Research and Development"
  ];

  const initialDeptTasks = departmentsList.reduce((acc, dept) => {
    acc[dept] = [
      { title: "", description: "" },
      { title: "", description: "" }
    ];
    return acc;
  }, {} as any);

  const [selectedDept, setSelectedDept] = useState("Creative");
  const [deptTasksForm, setDeptTasksForm] = useState<any>(initialDeptTasks);

  const { data, isLoading } = useQuery({
    queryKey: ["broadcast-center"],
    queryFn: getBroadcastData,
    enabled: sessionStatus === "authenticated",
  });

  const announcementMutation = useMutation({
    mutationFn: async (notice: typeof newNotice) => {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notice),
      });
      if (!res.ok) throw new Error("Failed to post");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Announcement broadcast successfully!");
      queryClient.invalidateQueries({ queryKey: ["broadcast-center"] });
      setIsPostOpen(false);
      setNewNotice({ title: "", content: "" });
    },
  });

  const bannerMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/global-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update banner");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Global site banner updated!");
      queryClient.invalidateQueries({ queryKey: ["broadcast-center"] });
    },
  });

  const configMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "recruitment_config", value: payload }),
      });
      if (!res.ok) throw new Error("Failed to update lifecycle");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Recruitment lifecycle updated!");
      queryClient.invalidateQueries({ queryKey: ["broadcast-center"] });
    },
  });

  const defaultTasksMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "recruitment_default_tasks", value: payload }),
      });
      if (!res.ok) throw new Error("Failed to update tasks");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Department default tasks saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["broadcast-center"] });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/announcements?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Announcement removed.");
      queryClient.invalidateQueries({ queryKey: ["broadcast-center"] });
    },
  });

  // Sync forms when data is loaded
  useEffect(() => {
    if (data?.banner) {
      setBannerForm({
        message: data.banner.message || "",
        link: data.banner.link || "",
        isActive: data.banner.isActive ?? true
      });
    }
    if (data?.config) {
      setLifecycleForm(prev => ({
        ...prev,
        ...data.config
      }));
    }
    if (data?.defaultTasks) {
      setDeptTasksForm((prev: any) => {
        const merged = { ...prev };
        Object.keys(data.defaultTasks).forEach(k => {
          merged[k] = data.defaultTasks[k];
        });
        return merged;
      });
    }
  }, [data]);

  if (sessionStatus === "loading" || isLoading) return <SpinnerComponent />;

  const user = session?.user as any;
  const userDept = user?.buccDepartment?.toLowerCase() || "";
  const userDesignation = user?.designation?.toLowerCase() || "";

  const isActive = user?.memberStatus === "Active";
  const isGB = ["president", "vice president", "vice-president", "general secretary", "treasurer"].includes(userDesignation) && isActive;
  const isHRHead = userDept === "human resources" && ["director", "assistant director"].includes(userDesignation) && isActive;
  const isRDHead = userDept === "research and development" && ["director", "assistant director"].includes(userDesignation) && isActive;
  const isEB = ["director", "assistant director"].includes(userDesignation) && isActive;

  if (!isGB && !isEB) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-2">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to access the broadcast center.</p>
      </div>
    );
  }

  const canManageLifecycle = isGB || isHRHead || isRDHead;

  return (
    <div className="space-y-12 pb-20">
      <Heading 
        headingText="Broadcast Center" 
        subHeadingText="Manage internal communications and site-wide notifications." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Global Banner & Lifecycle */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* 1. Global Alert Bar (GB Only) */}
          {(isGB || isRDHead) && (
            <section className="space-y-6">
              <h2 className="font-serif text-2xl tracking-tight border-b border-border pb-2 flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" /> Global Alert
              </h2>
              <Card className="border-border shadow-none bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Top Announcement Bar</CardTitle>
                  <CardDescription className="text-xs italic">Changes here are reflected instantly at the top of the public website.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Banner Message</Label>
                    <Input 
                      placeholder="E.g. Flash Event tonight at 6:00 PM..." 
                      value={bannerForm.message}
                      onChange={e => setBannerForm({...bannerForm, message: e.target.value})}
                      className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Target URL</Label>
                    <Input 
                      placeholder="E.g. /events" 
                      value={bannerForm.link}
                      onChange={e => setBannerForm({...bannerForm, link: e.target.value})}
                      className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      onClick={() => setBannerForm({...bannerForm, isActive: !bannerForm.isActive})}
                      className={`h-5 w-5 border rounded flex items-center justify-center transition-colors ${bannerForm.isActive ? "bg-primary border-primary" : "border-muted-foreground"}`}
                    >
                      {bannerForm.isActive && <div className="h-2.5 w-2.5 bg-background rounded-full" />}
                    </button>
                    <span className="text-sm font-medium">Activate Banner Site-wide</span>
                  </div>
                </CardContent>
                <DialogFooter className="p-6 pt-0">
                  <Button 
                    className="w-full bg-foreground text-background py-5 font-bold uppercase text-[10px] tracking-widest"
                    disabled={bannerMutation.isPending}
                    onClick={() => bannerMutation.mutate(bannerForm)}
                  >
                    {bannerMutation.isPending ? "Syncing..." : "Update Live Banner"}
                  </Button>
                </DialogFooter>
              </Card>
            </section>
          )}

          {/* 2. Recruitment Lifecycle (GB, HR, R&D) */}
          {canManageLifecycle && (
            <section className="space-y-6">
              <h2 className="font-serif text-2xl tracking-tight border-b border-border pb-2 flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" /> Recruitment Pulse
              </h2>
              <Card className="border-border shadow-none bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Intake Gatekeeper</CardTitle>
                  <CardDescription className="text-xs">Control public access to registration and evaluation forms.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Registration Toggle */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Member Registration</Label>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Path: /registration</p>
                      </div>
                      <button 
                        onClick={() => setLifecycleForm({...lifecycleForm, isRegistrationOpen: !lifecycleForm.isRegistrationOpen})}
                        className={`h-6 w-11 rounded-full relative transition-colors ${lifecycleForm?.isRegistrationOpen ? "bg-emerald-500" : "bg-muted"}`}
                      >
                        <div className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform ${lifecycleForm?.isRegistrationOpen ? "translate-x-5" : ""}`} />
                      </button>
                    </div>
                    {!lifecycleForm?.isRegistrationOpen && (
                      <div className="space-y-4 animate-in fade-in duration-300 pl-4 border-l border-emerald-500/20">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Countdown to Open</Label>
                          <Input 
                            type="datetime-local"
                            value={lifecycleForm?.registrationTargetDate || ""}
                            onChange={e => setLifecycleForm({...lifecycleForm, registrationTargetDate: e.target.value})}
                            className="bg-muted/30 border-border h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Closure Message</Label>
                          <Textarea 
                            placeholder="Message to show when closed..."
                            value={lifecycleForm?.registrationMessage || "BUCC Recruitment Process is not ongoing. Please check our Facebook page for updates."}
                            onChange={e => setLifecycleForm({...lifecycleForm, registrationMessage: e.target.value})}
                            className="bg-muted/30 border-border h-20 text-xs resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Evaluation Toggle */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Written Evaluation</Label>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Path: /evaluation</p>
                      </div>
                      <button 
                        onClick={() => setLifecycleForm({...lifecycleForm, isEvaluationOpen: !lifecycleForm.isEvaluationOpen})}
                        className={`h-6 w-11 rounded-full relative transition-colors ${lifecycleForm?.isEvaluationOpen ? "bg-emerald-500" : "bg-muted"}`}
                      >
                        <div className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform ${lifecycleForm?.isEvaluationOpen ? "translate-x-5" : ""}`} />
                      </button>
                    </div>
                    {!lifecycleForm?.isEvaluationOpen && (
                      <div className="space-y-4 animate-in fade-in duration-300 pl-4 border-l border-emerald-500/20">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Countdown to Open</Label>
                          <Input 
                            type="datetime-local"
                            value={lifecycleForm?.evaluationTargetDate || ""}
                            onChange={e => setLifecycleForm({...lifecycleForm, evaluationTargetDate: e.target.value})}
                            className="bg-muted/30 border-border h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Closure Message</Label>
                          <Textarea 
                            placeholder="Message to show when closed..."
                            value={lifecycleForm?.evaluationMessage || "BUCC is not accepting any more evaluations. Please contact HR or GB."}
                            onChange={e => setLifecycleForm({...lifecycleForm, evaluationMessage: e.target.value})}
                            className="bg-muted/30 border-border h-20 text-xs resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Senior Executive Access Toggle */}
                  {(isGB || isRDHead || isHRHead) && (
                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium">Senior Executive Access</Label>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Allow Senior Executives to view & moderate recruitment</p>
                        </div>
                        <button 
                          onClick={() => setLifecycleForm({...lifecycleForm, allowSERecruitmentAccess: !lifecycleForm.allowSERecruitmentAccess})}
                          className={`h-6 w-11 rounded-full relative transition-colors ${lifecycleForm?.allowSERecruitmentAccess ? "bg-emerald-500" : "bg-muted"}`}
                        >
                          <div className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform ${lifecycleForm?.allowSERecruitmentAccess ? "translate-x-5" : ""}`} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tasks Submission Portal Toggles */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Tasks Submission Portal</Label>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Path: /tasks</p>
                      </div>
                      <button 
                        onClick={() => setLifecycleForm({...lifecycleForm, isTasksPortalOpen: !lifecycleForm.isTasksPortalOpen})}
                        className={`h-6 w-11 rounded-full relative transition-colors ${lifecycleForm?.isTasksPortalOpen ? "bg-emerald-500" : "bg-muted"}`}
                      >
                        <div className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform ${lifecycleForm?.isTasksPortalOpen ? "translate-x-5" : ""}`} />
                      </button>
                    </div>
                    {lifecycleForm?.isTasksPortalOpen && (
                      <div className="space-y-4 animate-in fade-in duration-300 pl-4 border-l border-emerald-500/20">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Submission Deadline</Label>
                          <Input 
                            type="datetime-local"
                            value={lifecycleForm?.tasksDeadline || ""}
                            onChange={e => setLifecycleForm({...lifecycleForm, tasksDeadline: e.target.value})}
                            className="bg-muted/30 border-border h-9 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <DialogFooter className="p-6 pt-0">
                  <Button 
                    className="w-full bg-foreground text-background py-5 font-bold uppercase text-[10px] tracking-widest"
                    disabled={configMutation.isPending}
                    onClick={() => configMutation.mutate(lifecycleForm)}
                  >
                    {configMutation.isPending ? "Updating Lifecycle..." : "Save Lifecycle Settings"}
                  </Button>
                </DialogFooter>
              </Card>
            </section>
          )}

          {/* Default Tasks Management Section (GB, R&D Only) */}
          {(isGB || isRDHead) && (
            <section className="space-y-6">
              <h2 className="font-serif text-2xl tracking-tight border-b border-border pb-2 flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" /> Manage Department Tasks
              </h2>
              <Card className="border-border shadow-none bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Department Default Tasks</CardTitle>
                  <CardDescription className="text-xs">Configure the 2 default tasks that interviewers can quick-assign to candidates for each department.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Department</Label>
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      {departmentsList.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                    {/* Task 1 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-border pb-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">1</span>
                        <h4 className="text-xs font-bold uppercase tracking-wider">Default Task 1</h4>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Task Title</Label>
                        <Input
                          placeholder="e.g. Design a Recruitment Poster"
                          value={deptTasksForm[selectedDept]?.[0]?.title || ""}
                          onChange={(e) => {
                            const updated = { ...deptTasksForm };
                            if (!updated[selectedDept]) updated[selectedDept] = [{ title: "", description: "" }, { title: "", description: "" }];
                            updated[selectedDept][0].title = e.target.value;
                            setDeptTasksForm(updated);
                          }}
                          className="bg-muted/30 border-border h-9 text-xs font-sans"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Task Description</Label>
                        <Textarea
                          placeholder="Task details and instructions..."
                          value={deptTasksForm[selectedDept]?.[0]?.description || ""}
                          onChange={(e) => {
                            const updated = { ...deptTasksForm };
                            if (!updated[selectedDept]) updated[selectedDept] = [{ title: "", description: "" }, { title: "", description: "" }];
                            updated[selectedDept][0].description = e.target.value;
                            setDeptTasksForm(updated);
                          }}
                          className="bg-muted/30 border-border h-24 text-xs resize-none font-sans"
                        />
                      </div>
                    </div>

                    {/* Task 2 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-border pb-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">2</span>
                        <h4 className="text-xs font-bold uppercase tracking-wider">Default Task 2</h4>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Task Title</Label>
                        <Input
                          placeholder="e.g. Video Editing Prompt"
                          value={deptTasksForm[selectedDept]?.[1]?.title || ""}
                          onChange={(e) => {
                            const updated = { ...deptTasksForm };
                            if (!updated[selectedDept]) updated[selectedDept] = [{ title: "", description: "" }, { title: "", description: "" }];
                            updated[selectedDept][1].title = e.target.value;
                            setDeptTasksForm(updated);
                          }}
                          className="bg-muted/30 border-border h-9 text-xs font-sans"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Task Description</Label>
                        <Textarea
                          placeholder="Task details and instructions..."
                          value={deptTasksForm[selectedDept]?.[1]?.description || ""}
                          onChange={(e) => {
                            const updated = { ...deptTasksForm };
                            if (!updated[selectedDept]) updated[selectedDept] = [{ title: "", description: "" }, { title: "", description: "" }];
                            updated[selectedDept][1].description = e.target.value;
                            setDeptTasksForm(updated);
                          }}
                          className="bg-muted/30 border-border h-24 text-xs resize-none font-sans"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <DialogFooter className="p-6 pt-0">
                  <Button 
                    className="w-full bg-foreground text-background py-5 font-bold uppercase text-[10px] tracking-widest"
                    disabled={defaultTasksMutation.isPending}
                    onClick={() => defaultTasksMutation.mutate(deptTasksForm)}
                  >
                    {defaultTasksMutation.isPending ? "Saving Tasks..." : "Save Default Tasks"}
                  </Button>
                </DialogFooter>
              </Card>
            </section>
          )}

          {/* 3. Hero Section Management (GB, R&D Only) */}
          {(isGB || isRDHead) && (
            <section className="space-y-6">
              <h2 className="font-serif text-2xl tracking-tight border-b border-border pb-2 flex items-center gap-3">
                <Layout className="w-5 h-5 text-primary" /> Visual Identity
              </h2>
              <Card className="border-border shadow-none bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Hero Carousel</CardTitle>
                  <CardDescription className="text-xs">Update images, titles, and call-to-action buttons for the homepage.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/broadcast/hero-config">
                    <Button variant="outline" className="w-full gap-2 border-border hover:bg-muted font-bold uppercase text-[10px] tracking-widest h-10">
                      Configure Hero Slides <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </section>
          )}
        </div>

        {/* Right: Announcements Hub */}
        <div className="lg:col-span-7 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="font-serif text-2xl tracking-tight flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-primary" /> Member Notices
              </h2>
              
              <Dialog open={isPostOpen} onOpenChange={setIsPostOpen}>
                <DialogTrigger>
                  <Button className="gap-2 bg-foreground text-background rounded-md text-[10px] font-bold uppercase tracking-widest px-6 h-9">
                    <Plus className="w-3.5 h-3.5" /> New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md border-border bg-background text-left">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">Create Broadcast</DialogTitle>
                    <DialogDescription className="font-light">This notice will appear on the dashboard for all members.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Subject / Headline</Label>
                      <Input 
                        placeholder="Notice title..." 
                        value={newNotice.title}
                        onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                        className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Full Message</Label>
                      <Textarea 
                        placeholder="Write your announcement details here..." 
                        rows={6}
                        value={newNotice.content}
                        onChange={e => setNewNotice({...newNotice, content: e.target.value})}
                        className="bg-transparent border border-border rounded-sm p-4 focus-visible:ring-0 focus-visible:border-primary transition-colors resize-none"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      className="w-full bg-foreground text-background py-6 font-bold uppercase text-[10px] tracking-widest"
                      disabled={announcementMutation.isPending || !newNotice.title || !newNotice.content}
                      onClick={() => announcementMutation.mutate(newNotice)}
                    >
                      {announcementMutation.isPending ? "Transmitting..." : "Send Announcement"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* List of Previous Announcements */}
            <div className="space-y-4">
              {(data?.announcements?.length ?? 0) > 0 ? (
                data?.announcements.map((ann: any) => (
                  <Card key={ann._id} className="border-border shadow-none bg-card hover:border-primary/20 transition-all group overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-serif text-lg font-medium">{ann.title}</h3>
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Broadcast</span>
                            <span className="h-1 w-1 bg-border rounded-full" />
                            <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {(isGB || isRDHead) && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                            onClick={() => deleteAnnouncementMutation.mutate(ann._id)}
                            disabled={deleteAnnouncementMutation.isPending}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed line-clamp-3 italic">
                        "{ann.content}"
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-20 text-center border border-dashed border-border rounded-md">
                  <p className="text-muted-foreground font-serif italic">No recent broadcasts in history.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
