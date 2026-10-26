"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import { json as evaluationJson } from "@/components/evaluation/questionJSON";
import Heading from "@/components/portal/heading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import EvaluationAssessment from "./evaluation-assessment";
import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar, 
  Sparkles,
  ShieldCheck 
} from "lucide-react";

type EvaluationData = {
  _id: string;
  name: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  bracuDepartment: string;
  buccDepartment: string;
  status: string;
  comment?: string;
  responseObject: any;
  submissionDate: string;
  interviewTakenBy?: string[];
};

export default function EvaluationDetailPage() {
  const params = useParams();
  const evaluationID = params.evaluationID as string;
  const { data: session, status: sessionStatus } = useSession();
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch("/api/config?key=recruitment_config")
      .then(res => res.json())
      .then(data => setConfig(data.value || { allowSERecruitmentAccess: false }))
      .catch(() => setConfig({ allowSERecruitmentAccess: false }));
  }, []);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await fetch(`/api/evaluation?evaluationID=${evaluationID}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setEvaluation(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvaluation();
  }, [evaluationID]);

  const user = session?.user as any;
  const isAlumni = 
    user?.memberStatus?.toLowerCase() === "alumni" || 
    user?.designation?.toLowerCase() === "alumni" ||
    (user?.memberStatus && user?.memberStatus?.toLowerCase() !== "active");

  const permittedDesignations = [
    "President",
    "Vice President",
    "General Secretary",
    "Treasurer",
    "Director",
    "Assistant Director",
  ];

  const isPermitted = !isAlumni && (
    permittedDesignations.includes(user?.designation) || 
    (config?.allowSERecruitmentAccess && user?.designation === "Senior Executive")
  );

  if (sessionStatus === "loading" || isLoading || config === null) return <SpinnerComponent />;

  if (!isPermitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-2">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view recruitment data.</p>
      </div>
    );
  }

  if (!evaluation) return <div className="p-8 text-center">Evaluation not found.</div>;

  const responses = typeof evaluation.responseObject === "string" 
    ? JSON.parse(evaluation.responseObject) 
    : evaluation.responseObject;

  // Custom status badge styling
  let statusBadgeStyle = "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
  if (evaluation.status === "Accepted") {
    statusBadgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  } else if (evaluation.status === "Pending") {
    statusBadgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  } else if (evaluation.status === "Rejected") {
    statusBadgeStyle = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Back Button & Header */}
      <div>
        <Link 
          href="/dashboard/evaluation" 
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4 group font-sans font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Evaluations
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <Heading 
              headingText="Evaluation Workspace" 
              subHeadingText={`Reviewing application data for ${evaluation.name}`} 
            />
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeStyle}`}>
            {evaluation.status || "Pending"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Response Feed */}
        <div className="lg:col-span-2 space-y-6">
          {evaluationJson.pages.map((page: any, pIdx: number) => {
            const visibleElements = page.elements.filter((el: any) => {
              const val = responses[el.name];
              return val !== undefined && val !== null && (Array.isArray(val) ? val.length > 0 : true);
            });

            if (visibleElements.length === 0) return null;

            return (
              <Card key={pIdx} className="border-border shadow-none bg-card overflow-hidden rounded-xl">
                <CardHeader className="pb-4 border-b border-border/40 bg-muted/10">
                  <CardTitle className="text-base font-serif font-medium text-foreground tracking-tight">
                    {page.title || page.name}
                  </CardTitle>
                  {page.description && (
                    <CardDescription className="text-xs italic text-muted-foreground/80 mt-1">
                      {page.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-6 space-y-6 divide-y divide-border/30">
                  {visibleElements.map((el: any, eIdx: number) => {
                    const answer = responses[el.name];
                    const answerComment = responses[`${el.name}-Comment`];

                    return (
                      <div key={eIdx} className="space-y-2 pt-5 first:pt-0 first:border-0 border-t border-border/30">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" /> {el.title}
                        </h4>
                        <div className="text-sm font-sans text-foreground leading-relaxed pl-3 border-l border-primary/20">
                          {Array.isArray(answer) ? (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {answer.map((a, i) => (
                                <span key={i} className="px-2.5 py-0.5 bg-primary/5 border border-primary/10 rounded-md text-xs font-semibold text-primary">
                                  {a}
                                </span>
                              ))}
                            </div>
                          ) : typeof answer === "boolean" ? (
                            <span className="font-semibold text-xs">{answer ? "Yes" : "No"}</span>
                          ) : (
                            <p className="whitespace-pre-wrap font-light text-muted-foreground dark:text-gray-300 leading-normal">{answer}</p>
                          )}
                          {answerComment && (
                            <p className="mt-2.5 text-xs text-muted-foreground italic bg-muted/50 p-2.5 rounded-lg border-l border-primary/30 font-sans">
                              Additional: {answerComment}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Right: Assessment Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <section className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Evaluation Assessment
              </h3>
              <EvaluationAssessment evaluationData={evaluation} />
            </section>

            {/* Candidate Metadata Summary */}
            <Card className="border-border shadow-none bg-card/60 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-border/40 bg-muted/10">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Candidate Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/15 font-bold flex items-center justify-center text-base uppercase font-serif tracking-wide shrink-0">
                    {evaluation.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-serif font-semibold text-base leading-tight text-foreground">{evaluation.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-mono">{evaluation.studentId}</p>
                  </div>
                </div>

                {/* Profile Details List */}
                <div className="space-y-4 pt-4 border-t border-border/40 text-xs font-sans">
                  <div className="flex items-center gap-3 group">
                    <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:text-primary transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Email Address</p>
                      <p className="font-medium text-foreground select-all">{evaluation.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group">
                    <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:text-primary transition-colors">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Phone Number</p>
                      <p className="font-medium text-foreground select-all">{evaluation.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group">
                    <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:text-primary transition-colors">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">University Department</p>
                      <p className="font-medium text-foreground">{evaluation.bracuDepartment}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group">
                    <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:text-primary transition-colors">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Submission Date</p>
                      <p className="font-medium text-foreground">
                        {new Date(evaluation.submissionDate).toLocaleDateString("en-US", {
                          dateStyle: "long"
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
