"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { departmentsInfo } from "@/constants/departments";
import EBs from "@/constants/ebs";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, ExternalLink, FileText, CheckCircle2, ShieldAlert, PlusCircle, Maximize2 } from "lucide-react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

// Dynamically import BlockNoteEditor to prevent SSR compilation issues
const BlockNoteEditor = dynamic(() => import("@/components/BlockNoteEditor"), { ssr: false });

const EB_OPTIONS: Option[] = EBs.map((eb: any) => ({
  label: eb.fullName,
  value: eb.fullName,
}));

export default function EvaluationAssessment({ evaluationData }: any) {
  const { data: session } = useSession();
  const params = useParams();
  const evaluationID = params.evaluationID;

  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState(evaluationData.buccDepartment || "");
  const [status, setStatus] = useState(evaluationData.status || "Pending");
  
  // Safe initialization of BlockNote comment state
  const initialComment = (() => {
    if (!evaluationData.comment) return undefined;
    if (typeof evaluationData.comment === "string") {
      try {
        return JSON.parse(evaluationData.comment);
      } catch {
        return [{
          type: "paragraph",
          content: [{ type: "text", text: evaluationData.comment, styles: {} }]
        }];
      }
    }
    return evaluationData.comment;
  })();
  const [comment, setComment] = useState<any>(initialComment);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);

  const [selectedEBs, setSelectedEBs] = useState<Option[]>(
    evaluationData.interviewTakenBy?.map((eb: string) => ({
      label: eb,
      value: eb,
    })) || []
  );

  const [interviewerOptions, setInterviewerOptions] = useState<Option[]>(EB_OPTIONS);
  const [config, setConfig] = useState<any>(null);
  const [defaultTasks, setDefaultTasks] = useState<any>({});
  const [assignedTasks, setAssignedTasks] = useState<any[]>(evaluationData.assignedTasks || []);

  // Form state for assigning a task
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskDept, setTaskDept] = useState("Creative");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState<any>(undefined);

  const user = session?.user as any;
  const userDept = user?.buccDepartment || "";
  const userDesignation = user?.designation || "";

  const isAlumni = 
    user?.memberStatus?.toLowerCase() === "alumni" || 
    user?.designation?.toLowerCase() === "alumni" ||
    (user?.memberStatus && user?.memberStatus?.toLowerCase() !== "active");

  const isSEAllowed = 
    !isAlumni && 
    userDesignation === "Senior Executive" && 
    Boolean(config?.allowSERecruitmentAccess);

  const isSuper = !isAlumni && (
    [
      "President",
      "Vice President",
      "General Secretary",
      "Treasurer",
      "Director",
      "Assistant Director",
    ].includes(userDesignation) || isSEAllowed
  );

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const [configRes, tasksRes] = await Promise.all([
          fetch("/api/config?key=recruitment_config"),
          fetch("/api/config?key=recruitment_default_tasks")
        ]);
        const configJson = await configRes.json();
        const tasksJson = await tasksRes.json();
        setConfig(configJson.value || { allowSERecruitmentAccess: false });
        setDefaultTasks(tasksJson.value || {});
      } catch (err) {
        console.error("Failed to load configs", err);
      }
    };
    fetchConfigs();
  }, []);

  // Fetch active Senior Executives dynamically when SE recruitment access is enabled
  useEffect(() => {
    if (config?.allowSERecruitmentAccess) {
      fetch("/api/members?minimal=true&designation=Senior%20Executive")
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.users)) {
            const seOptions: Option[] = data.users
              .filter((u: any) => u.name && u.designation === "Senior Executive")
              .map((u: any) => ({
                label: u.name,
                value: u.name,
              }));

            const existingValues = new Set(EB_OPTIONS.map((o) => o.value.toLowerCase()));
            const combined = [...EB_OPTIONS];
            for (const opt of seOptions) {
              if (!existingValues.has(opt.value.toLowerCase())) {
                combined.push(opt);
                existingValues.add(opt.value.toLowerCase());
              }
            }
            setInterviewerOptions(combined);
          }
        })
        .catch((err) => console.error("Failed to load Senior Executive interviewers:", err));
    } else {
      setInterviewerOptions(EB_OPTIONS);
    }
  }, [config?.allowSERecruitmentAccess]);

  // Set initial task department based on user department if not superadmin
  useEffect(() => {
    if (!isSuper && userDept && userDept !== "Governing Body") {
      setTaskDept(userDept);
    }
  }, [userDept, isSuper]);

  const canViewTask = (deptName: string) => {
    if (isSuper) return true;
    const isDeptHead = userDept === deptName && ["Director", "Assistant Director"].includes(userDesignation);
    const isSE = userDept === deptName && userDesignation === "Senior Executive" && config?.allowSERecruitmentAccess;
    return isDeptHead || isSE;
  };

  const convertToBlocks = (text: string) => {
    return [{
      type: "paragraph",
      content: [{ type: "text", text, styles: {} }]
    }];
  };

  const handleAssignTask = () => {
    if (!taskTitle || !taskDesc || taskDesc.length === 0) {
      toast.error("Task Title and Description are required");
      return;
    }
    const exists = assignedTasks.some(t => t.department === taskDept);
    if (exists) {
      toast.error(`A task for the ${taskDept} department is already assigned.`);
      return;
    }

    const newTask = {
      department: taskDept,
      title: taskTitle,
      description: taskDesc,
      status: "pending"
    };

    setAssignedTasks([...assignedTasks, newTask]);
    setTaskTitle("");
    setTaskDesc(undefined);
    setIsDialogOpen(false);
    toast.success("Task added locally. Click 'Update Assessment' to save.");
  };

  const handleDeleteTask = (deptName: string) => {
    setAssignedTasks(assignedTasks.filter(t => t.department !== deptName));
    toast.success("Task removed locally. Click 'Update Assessment' to save.");
  };

  async function submitAssessment() {
    setLoading(true);
    try {
      const assessmentData = {
        _id: evaluationID,
        interviewTakenBy: selectedEBs.map((eb) => eb.value),
        modifiedBy: session?.user?.name,
        assignedDepartment: department,
        status,
        comment,
        assignedTasks,
      };

      const response = await fetch(`/api/evaluation`, {
        method: "PATCH",
        body: JSON.stringify(assessmentData),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Assessment updated successfully.");
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to update assessment.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const assignableDepts = isSuper 
    ? departmentsInfo.map(d => d.name)
    : departmentsInfo.map(d => d.name).filter(name => name === userDept);

  const defaultTask1 = defaultTasks[taskDept]?.[0];
  const defaultTask2 = defaultTasks[taskDept]?.[1];

  return (
    <Card className="bg-card border-border shadow-none">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full h-10 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending (Post-Interview)</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Assign Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full h-10 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departmentsInfo.map((dept) => (
                  <SelectItem key={dept.name} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Interviewers</Label>
            <MultipleSelector
              value={selectedEBs}
              onChange={setSelectedEBs}
              defaultOptions={interviewerOptions}
              placeholder="Type to search interviewers..."
              emptyIndicator={
                <p className="text-center text-sm leading-10 text-muted-foreground">
                  No interviewer found.
                </p>
              }
              className="bg-transparent border-0 border-b border-border rounded-none px-0 min-h-[40px] focus-within:border-primary transition-colors"
              badgeClassName="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Admin Comments (Rich Text)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                onClick={() => setIsCommentsDialogOpen(true)}
                title="Open in full screen dialog"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="mt-1 h-[120px] overflow-y-auto border border-border rounded-md bg-muted/10 p-2 text-xs">
              {comment && comment.length > 0 ? (
                <BlockNoteEditor
                  key={`comments-preview-${isCommentsDialogOpen}`}
                  initialValue={comment}
                  editable={false}
                />
              ) : (
                <p className="text-muted-foreground italic p-2 text-center select-none">No comments yet. Click maximize to write notes.</p>
              )}
            </div>
          </div>

          {/* Assigned Tasks Section */}
          <div className="pt-4 border-t border-border/50 space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Assigned Tasks</Label>
              
              {/* Task Assignment Modal Trigger */}
              {assignableDepts.length > 0 &&
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs gap-1 border-primary/20 text-primary bg-primary/5 hover:bg-primary hover:text-white transition-all font-sans font-medium"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Assign Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl w-[95vw] sm:w-full border-border bg-card max-h-[90vh] flex flex-col p-4 sm:p-6 overflow-hidden">
                    <DialogHeader className="shrink-0 space-y-1 pb-2">
                      <DialogTitle className="text-xl font-serif">Assign Recruitment Task</DialogTitle>
                      <DialogDescription className="text-xs">
                        Configure a custom task or select from configured default presets for this candidate.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3 flex-1 min-h-0 overflow-y-auto pr-1">
                      {/* Form inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">For Department</Label>
                          {isSuper ? (
                            <select
                              value={taskDept}
                              onChange={(e) => setTaskDept(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-md bg-background text-xs font-sans focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                            >
                              {departmentsInfo.map(d => (
                                <option key={d.name} value={d.name}>{d.name}</option>
                              ))}
                            </select>
                          ) : (
                            <div className="text-xs font-semibold px-3 py-2 bg-muted rounded border border-border text-foreground font-sans">
                              {userDept}
                            </div>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Task Title</Label>
                          <Input
                            placeholder="e.g. Design Recruitment Poster"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className="bg-background border-border text-xs font-sans h-9"
                          />
                        </div>
                      </div>

                      {/* Default tasks quick-assign buttons */}
                      {(defaultTask1?.title || defaultTask2?.title) &&
                        <div className="space-y-1.5 bg-muted/20 p-3 rounded-lg border border-border/40">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Quick Select Default Tasks</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                            {defaultTask1?.title && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 justify-start text-[10px] font-sans border-border truncate"
                                onClick={() => {
                                  setTaskTitle(defaultTask1.title);
                                  setTaskDesc(convertToBlocks(defaultTask1.description));
                                }}
                              >
                                <FileText className="w-3.5 h-3.5 mr-2 text-primary" /> {defaultTask1.title}
                              </Button>
                            )}
                            {defaultTask2?.title && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 justify-start text-[10px] font-sans border-border truncate"
                                onClick={() => {
                                  setTaskTitle(defaultTask2.title);
                                  setTaskDesc(convertToBlocks(defaultTask2.description));
                                }}
                              >
                                <FileText className="w-3.5 h-3.5 mr-2 text-primary" /> {defaultTask2.title}
                              </Button>
                            )}
                          </div>
                        </div>
                      }

                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Task Details & Description (Rich Text Editor)</Label>
                        <div className="mt-1">
                          <BlockNoteEditor
                            key={`${taskDept}-${taskTitle}`}
                            initialValue={taskDesc}
                            onChange={(json) => setTaskDesc(json)}
                            minHeight="200px"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="border-t border-border/30 pt-3 sm:pt-4 mt-auto shrink-0 flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1 sm:flex-initial"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAssignTask}
                        className="flex-1 sm:flex-initial"
                      >
                        Add Assignment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              }
            </div>

            {assignedTasks.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No tasks assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {assignedTasks.map((task) => {
                  const visible = canViewTask(task.department);
                  return (
                    <div key={task.department} className="border border-border rounded-md p-3 space-y-2 bg-muted/10 relative">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                            {task.department}
                          </span>
                          <h4 className="text-xs font-bold mt-1 text-foreground">
                            {task.title}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.department)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          title="Unassign task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {visible ? (
                        <>
                          <div className="text-[11px] text-muted-foreground font-light leading-relaxed">
                            {typeof task.description === "string" ? (
                              <p className="whitespace-pre-wrap">{task.description}</p>
                            ) : (
                              <BlockNoteEditor
                                key={`eval-task-${task.department}-${task.title}`}
                                initialValue={task.description}
                                editable={false}
                              />
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-1.5 border-t border-border/40 text-[10px]">
                            <span className={`font-semibold ${task.status === "submitted" ? "text-emerald-600" : "text-amber-600"}`}>
                              {task.status === "submitted" ? "Submitted" : "Pending"}
                            </span>
                            {task.status === "submitted" && (
                              <div className="flex items-center gap-2">
                                <a 
                                  href={task.driveLink} 
                                  target="_blank" 
                                  className="text-primary flex items-center gap-0.5 hover:underline"
                                >
                                  Drive <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                                {task.githubLink && (
                                  <a 
                                    href={task.githubLink} 
                                    target="_blank" 
                                    className="text-primary flex items-center gap-0.5 hover:underline"
                                  >
                                    GitHub <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground italic pt-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                          <span>Only visible to {task.department} department panel.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <LoadingButton
          onClick={submitAssessment}
          disabled={loading}
          loading={loading}
          className="w-full bg-foreground text-background py-6 font-medium transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Update Assessment
        </LoadingButton>

        {evaluationData.modifiedBy && (
          <p className="text-[10px] text-center text-muted-foreground italic">
            Last modified by {evaluationData.modifiedBy}
          </p>
        )}

        {/* Fullscreen Comments Dialog */}
        <Dialog open={isCommentsDialogOpen} onOpenChange={setIsCommentsDialogOpen}>
          <DialogContent className="max-w-4xl w-[95vw] sm:w-full border-border bg-card max-h-[90vh] flex flex-col p-4 sm:p-6 overflow-hidden">
            <DialogHeader className="shrink-0 space-y-1 pb-2">
              <DialogTitle className="text-xl font-serif">Admin Comments</DialogTitle>
              <DialogDescription className="text-xs">
                Write and format detailed recruitment interview notes.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 overflow-y-auto py-2 pr-1">
              <BlockNoteEditor
                key={`comments-dialog-${isCommentsDialogOpen}`}
                initialValue={comment}
                onChange={(json) => setComment(json)}
                minHeight="260px"
              />
            </div>
            <DialogFooter className="border-t border-border/30 pt-3 sm:pt-4 mt-auto shrink-0 flex items-center justify-end">
              <Button
                type="button"
                onClick={() => setIsCommentsDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Close & Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
