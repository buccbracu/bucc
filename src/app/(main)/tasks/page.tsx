"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Clock, 
  CheckCircle, 
  Calendar, 
  Lock, 
  Github, 
  ExternalLink, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import SpinnerComponent from "@/components/SpinnerComponent";
import dynamic from "next/dynamic";

const BlockNoteEditor = dynamic(() => import("@/components/BlockNoteEditor"), { ssr: false });

interface Task {
  department: string;
  title: string;
  description: string;
  status: "pending" | "submitted";
  driveLink?: string;
  githubLink?: string;
  submittedAt?: string;
}

export default function TasksPortalPage() {
  // Login / Verification States
  const [studentId, setStudentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedData, setVerifiedData] = useState<{
    name: string;
    assignedTasks: Task[];
    config: {
      isTasksPortalOpen: boolean;
      tasksDeadline: string;
    };
  } | null>(null);

  // Portal State
  const [activeTab, setActiveTab] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  
  // Form Submission States
  const [driveLink, setDriveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");

  // Portal closure message
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // On-mount: check if portal is open globally
  useEffect(() => {
    const checkPortalStatus = async () => {
      try {
        const res = await fetch("/api/recruitment-tasks");
        if (res.ok) {
          const data = await res.json();
          if (data && !data.isTasksPortalOpen) {
            setGlobalError("Recruitment Tasks Submission Portal is currently closed.");
          }
        }
      } catch (err) {
        console.error("Failed to check portal status:", err);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    checkPortalStatus();
  }, []);

  // Sync links when tab changes
  useEffect(() => {
    if (verifiedData?.assignedTasks) {
      const currentTask = verifiedData.assignedTasks.find(t => t.department === activeTab);
      if (currentTask) {
        setDriveLink(currentTask.driveLink || "");
        setGithubLink(currentTask.githubLink || "");
      }
    }
  }, [activeTab, verifiedData]);

  if (isLoadingStatus) {
    return <SpinnerComponent />;
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !phoneNumber) {
      toast.error("Please fill in both Student ID and Phone Number.");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/recruitment-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          studentId: studentId.trim(),
          phoneNumber: phoneNumber.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.isPortalClosed) {
          setGlobalError(data.error);
        }
        throw new Error(data.error || "Verification failed");
      }

      setVerifiedData(data);
      if (data.assignedTasks && data.assignedTasks.length > 0) {
        setActiveTab(data.assignedTasks[0].department);
        // Pre-fill links if first task is already submitted
        setDriveLink(data.assignedTasks[0].driveLink || "");
        setGithubLink(data.assignedTasks[0].githubLink || "");
      }
      toast.success("Verification successful! Welcome to your Task Portal.");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmitTask = async (e: React.FormEvent, deptName: string) => {
    e.preventDefault();
    if (!driveLink) {
      toast.error("Google Drive Link is mandatory.");
      return;
    }

    if (!driveLink.toLowerCase().includes("drive.google.com") && !driveLink.toLowerCase().includes("docs.google.com")) {
      toast.error("Please submit a valid Google Drive or Google Docs link.");
      return;
    }

    setIsSubmitting(deptName);
    try {
      const res = await fetch("/api/recruitment-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          studentId: studentId.trim(),
          phoneNumber: phoneNumber.trim(),
          department: deptName,
          driveLink: driveLink.trim(),
          githubLink: githubLink.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      // Update local state with new tasks list
      setVerifiedData(prev => prev ? { ...prev, assignedTasks: data.assignedTasks } : null);
      toast.success(`Task for ${deptName} submitted successfully!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit task.");
    } finally {
      setIsSubmitting(null);
    }
  };

  // Helper to parse description whether string, JSON string, or block array
  const parseTaskDescription = (desc: any) => {
    if (!desc) return [];
    if (Array.isArray(desc)) return desc;
    if (typeof desc === "string") {
      try {
        const parsed = JSON.parse(desc);
        if (Array.isArray(parsed) || typeof parsed === "object") return parsed;
      } catch {
        return desc;
      }
    }
    return desc;
  };

  // Check if deadline is passed
  const isDeadlinePassed = () => {
    if (!verifiedData?.config?.tasksDeadline) return false;
    return new Date() > new Date(verifiedData.config.tasksDeadline);
  };

  const getFormattedDeadline = () => {
    if (!verifiedData?.config?.tasksDeadline) return "No Deadline Set";
    return new Date(verifiedData.config.tasksDeadline).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  // If portal is closed globally
  if (globalError) {
    return (
      <div className="container max-w-xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-6 animate-bounce">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-serif font-semibold text-center mb-2">Portal Closed</h2>
        <p className="text-muted-foreground text-center max-w-md leading-relaxed mb-6">
          {globalError}
        </p>
        <Button onClick={() => setGlobalError(null)} variant="outline" className="border-border">
          Go Back
        </Button>
      </div>
    );
  }

  // Verification View
  if (!verifiedData) {
    return (
      <div className="container max-w-md mx-auto px-4 py-20 min-h-[80vh] flex flex-col justify-center">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-primary/5 text-primary border border-primary/15 mb-2">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif tracking-tight font-medium">Recruitment Tasks</h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Enter your credentials below to view your department tasks and submit your solutions.
          </p>
        </div>

        <Card className="border-border bg-card shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-serif">Verify Identity</CardTitle>
            <CardDescription className="text-xs uppercase tracking-wider font-mono text-muted-foreground/60">Recruitment Candidate Area</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="studentId" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="e.g. 21101042"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="bg-muted/10 border-border h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 017XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-muted/10 border-border h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary font-sans"
                />
              </div>

              <Button
                type="submit"
                disabled={isVerifying}
                className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 font-bold uppercase text-[10px] tracking-widest mt-2 transition-all"
              >
                {isVerifying ? "Verifying..." : (
                  <span className="flex items-center gap-2">
                    Enter Portal <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard View (Verified Candidate)
  const currentTask = verifiedData.assignedTasks.find(t => t.department === activeTab);
  const submissionsLocked = isDeadlinePassed();

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12 min-h-[85vh] space-y-10">
      {/* Portal Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5" /> Candidate Workspace
          </div>
          <h1 className="text-3xl font-serif font-medium text-foreground">{verifiedData.name}</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Student ID: {studentId}</p>
        </div>

        {/* Global Deadline Info */}
        <div className="flex items-start gap-3 bg-muted/20 border border-border p-4 rounded-xl max-w-md">
          <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Submission Deadline</h4>
            <p className="text-xs font-semibold text-foreground">{getFormattedDeadline()}</p>
            {submissionsLocked ? (
              <span className="inline-flex text-[9px] font-bold uppercase tracking-widest text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-sm">Submissions Closed</span>
            ) : (
              <span className="inline-flex text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 px-1.5 py-0.5 rounded-sm">Submissions Active</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Grid */}
      {verifiedData.assignedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-muted/10 border border-dashed border-border rounded-2xl min-h-[40vh] space-y-4">
          <FileText className="w-12 h-12 text-muted-foreground/50" />
          <h3 className="text-xl font-serif font-medium">No Tasks Assigned</h3>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            You currently have no tasks assigned to your profile. Please attend your interview session or contact the recruitment committee.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Department Selector Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Your Assigned Departments</h3>
            <div className="flex flex-row lg:flex-col overflow-x-auto gap-2 pb-2 lg:pb-0">
              {verifiedData.assignedTasks.map((task) => {
                const isActive = activeTab === task.department;
                return (
                  <button
                    key={task.department}
                    onClick={() => setActiveTab(task.department)}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left text-xs font-semibold shrink-0 lg:shrink transition-all ${
                      isActive 
                        ? "bg-foreground border-foreground text-background shadow" 
                        : "bg-card border-border hover:bg-muted/30 text-foreground"
                    }`}
                  >
                    <span>{task.department}</span>
                    {task.status === "submitted" ? (
                      <CheckCircle className={`w-3.5 h-3.5 ${isActive ? "text-background" : "text-emerald-500"}`} />
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-background animate-pulse" : "bg-amber-500"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Task Details & Submission Panel */}
          <main className="lg:col-span-3 space-y-6">
            {currentTask && (
              <Card key={currentTask.department} className="border-border bg-card shadow-sm overflow-hidden animate-in fade-in duration-200">
                <CardHeader className="border-b border-border/40 pb-6 bg-muted/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={currentTask.status === "submitted" ? "Accepted" : "Pending"} className="uppercase text-[9px] tracking-widest font-semibold px-2 py-0.5">
                      {currentTask.status === "submitted" ? "Submitted" : "Pending Solution"}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-serif font-medium">{currentTask.title}</CardTitle>
                  <CardDescription className="text-xs font-mono uppercase tracking-tight text-muted-foreground/70">
                    Assignment Department: {currentTask.department}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  {/* Task Instructions */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Instructions & Description</h3>
                    <div className="text-sm font-light text-muted-foreground leading-relaxed bg-muted/10 p-4 rounded-xl border border-border/30 overflow-hidden">
                      {(() => {
                        const taskDesc = parseTaskDescription(currentTask.description);
                        if (typeof taskDesc === "string") {
                          return <p className="whitespace-pre-wrap">{taskDesc}</p>;
                        }
                        return (
                          <BlockNoteEditor
                            key={`task-body-${currentTask.department}-${currentTask.title}`}
                            initialValue={taskDesc}
                            editable={false}
                          />
                        );
                      })()}
                    </div>
                  </div>

                  {/* Submission Info / Form */}
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Submit Your Solution</h3>
                    
                    {/* Submission Success Banner */}
                    {currentTask.status === "submitted" && (
                      <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl text-xs leading-relaxed animate-in fade-in">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Your solution was successfully submitted!</p>
                          <p className="text-muted-foreground font-light mb-2">Submitted on {new Date(currentTask.submittedAt || "").toLocaleString()}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <a 
                              href={currentTask.driveLink} 
                              target="_blank" 
                              className="inline-flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded text-[10px] font-semibold transition-colors"
                            >
                              Google Drive Folder <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            {currentTask.githubLink && (
                              <a 
                                href={currentTask.githubLink} 
                                target="_blank" 
                                className="inline-flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded text-[10px] font-semibold transition-colors"
                              >
                                GitHub Repository <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Form Input fields */}
                    <form onSubmit={(e) => handleSubmitTask(e, currentTask.department)} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="driveLink" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                          Google Drive Link <span className="text-destructive font-sans">*</span>
                        </Label>
                        <Input
                          id="driveLink"
                          placeholder="e.g. https://drive.google.com/drive/folders/your-submission-folder"
                          value={driveLink}
                          disabled={submissionsLocked}
                          onChange={(e) => setDriveLink(e.target.value)}
                          className="bg-muted/10 border-border h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary font-sans"
                        />
                        <p className="text-[10px] text-muted-foreground font-light leading-normal">
                          Create a Google Drive folder, upload your files, set the folder access permission to <span className="font-bold text-foreground">"Anyone with the link can view"</span>, then copy and paste the folder link here.
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <Label htmlFor="githubLink" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                          GitHub Link <span className="text-muted-foreground font-light font-sans">(Optional)</span>
                        </Label>
                        <Input
                          id="githubLink"
                          placeholder="e.g. https://github.com/username/repository"
                          value={githubLink}
                          disabled={submissionsLocked}
                          onChange={(e) => setGithubLink(e.target.value)}
                          className="bg-muted/10 border-border h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary font-sans"
                        />
                        <p className="text-[10px] text-muted-foreground font-light leading-normal">
                          Optionally, if your task is code-based, you can share your public GitHub repository link.
                        </p>
                      </div>

                      {!submissionsLocked ? (
                        <Button
                          type="submit"
                          disabled={isSubmitting !== null}
                          className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 font-bold uppercase text-[10px] tracking-widest mt-4 transition-all"
                        >
                          {isSubmitting === currentTask.department ? "Submitting Solution..." : (
                            currentTask.status === "submitted" ? "Re-submit Solution" : "Submit Task Solution"
                          )}
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 p-3.5 bg-destructive/5 border border-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider rounded-xl mt-4">
                          <Lock className="w-4 h-4" /> Submissions are locked (Deadline Passed or Portal Closed)
                        </div>
                      )}
                    </form>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
