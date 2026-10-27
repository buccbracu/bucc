"use client";

import { json as evaluationData } from "@/components/evaluation/questionJSON";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import SpinnerComponent from "@/components/SpinnerComponent";
import IntakeInactive from "@/components/IntakeInactive";

export default function EvaluationPage() {
  const router = useRouter();
  const [currentPageIndex, setCurrentPageIndex] = useState(-1); // -1 for identity verification
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [config, setConfig] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/config?key=recruitment_config");
        const data = await res.json();
        setConfig(data.value);
      } catch (err) {
        console.error(err);
      } finally {
        setIsChecking(false);
      }
    };
    checkStatus();
  }, []);

  const handleVerify = async (studentId: string, email: string) => {
    if (!studentId?.match(/^(?:[0-9]{8}|[0-9]{10})$/)) {
      toast.error("Please enter a valid 8 or 10 digit Student ID.");
      return;
    }

    if (!email || !email.match(/^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd$/)) {
      toast.error("Please enter a valid BRACU G-Suite email address.");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch(`/api/evaluation?studentID=${studentId}&gSuiteEmail=${email}`);
      const data = await res.json();

      if (res.ok) {
        const member = data.member;
        // Auto-fill questions from member data based on JSON keys
        setFormData((prev: any) => ({
          ...prev,
          question1: member.name,
          question2: studentId,
          question3: member.email,
          phoneNumber: member.phoneNumber, 
          bracuDepartment: member.bracuDepartment,
          buccDepartment: member.buccDepartment, 
          question8: member.buccDepartment, // 1st Choice
        }));
        setCurrentPageIndex(0);
        toast.success("Identity verified! Your details have been pre-filled.");
      } else {
        toast.error(data.message || data.error || "Verification failed.");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleValueChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const evaluateVisibleIf = (visibleIf?: string) => {
    if (!visibleIf) return true;
    
    // Split by 'or' to handle multiple conditions
    const conditions = visibleIf.split(/\s+or\s+/i);
    return conditions.some(condition => {
      // Match {field} = 'value' or {field} != 'value'
      const match = condition.match(/\{(\w+(?:\.\w+)?)\}\s*(=|!=)\s*'([^']+)'/);
      if (match) {
        const [_, field, operator, value] = match;
        const actualValue = formData[field];
        
        if (operator === "=") return actualValue === value;
        if (operator === "!=") return actualValue !== value;
      }
      return false;
    });
  };

  const isElementVisible = (element: any) => {
    return evaluateVisibleIf(element.visibleIf);
  };

  const isPageVisible = (page: any) => {
    return evaluateVisibleIf(page.visibleIf);
  };

  const handleNext = () => {
    const currentPage = evaluationData.pages[currentPageIndex];
    
    // Validate current page
    const visibleElements = currentPage.elements.filter(isElementVisible);
    
    for (const el of visibleElements as any[]) {
      const value = formData[el.name];
      
      // Required check
      const isEmpty = 
        value === undefined || 
        value === null || 
        value === "" || 
        (Array.isArray(value) && value.length === 0);
      if (el.isRequired && isEmpty) {
        toast.error(`"${el.title || el.name}" is required.`);
        return;
      }

      // Regex validation check
      if (el.validators && value) {
        for (const validator of el.validators) {
          if (validator.type === "regex") {
            const regex = new RegExp(validator.regex);
            if (!regex.test(value)) {
              toast.error(validator.text || `Invalid format for "${el.title || el.name}".`);
              return;
            }
          }
        }
      }
    }

    // Find next visible page
    let nextIndex = currentPageIndex + 1;
    while (nextIndex < evaluationData.pages.length) {
      if (isPageVisible(evaluationData.pages[nextIndex])) {
        setCurrentPageIndex(nextIndex);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      nextIndex++;
    }

    // If no more visible pages, submit
    handleSubmit();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Filter out stale data: only keep data for elements that are actually visible
      const cleanedResponses: any = {};
      
      evaluationData.pages.forEach(page => {
        if (isPageVisible(page)) {
          page.elements.forEach((el: any) => {
            if (isElementVisible(el)) {
              if (formData[el.name] !== undefined) {
                cleanedResponses[el.name] = formData[el.name];
              }
              // Keep comments/other specify data
              if (formData[`${el.name}-Comment`] !== undefined) {
                cleanedResponses[`${el.name}-Comment`] = formData[`${el.name}-Comment`];
              }
            }
          });
        }
      });

      // Also ensure core pre-filled data is preserved
      const essentialData = {
        studentId: formData.question2,
        name: formData.question1,
        gSuiteEmail: formData.question3,
        phoneNumber: formData.phoneNumber,
        bracuDepartment: formData.bracuDepartment,
        buccDepartment: formData.question8 || formData.buccDepartment,
      };

      const response = await fetch("/api/evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...essentialData,
          responseObject: cleanedResponses,
        }),
      });

      if (response.ok) {
        toast.success("Evaluation submitted successfully!");
        router.push("/");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to submit evaluation.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) return <SpinnerComponent />;
  
  if (config && !config.isEvaluationOpen) {
    return (
      <IntakeInactive 
        title="Written Evaluation" 
        targetDate={config.evaluationTargetDate} 
        message={config.evaluationMessage || "BUCC is not accepting any more evaluations. Please contact HR or GB."}
      />
    );
  }

  if (currentPageIndex === -1) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-24 bg-background">
        <div className="w-full max-w-md space-y-8 bg-background p-8 border border-border shadow-sm text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-serif tracking-tight text-foreground">Written Evaluation</h1>
            <p className="text-muted-foreground font-light text-lg">
              Enter your Student ID and G Suite Email to access the assessment.
            </p>
          </div>
          <div className="space-y-6 pt-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="studentId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Student ID</Label>
              <Input
                id="studentId"
                placeholder="21101001"
                onChange={(e) => handleValueChange("tempId", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify(formData.tempId, formData.tempEmail)}
                className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="gSuiteEmail" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">G Suite Email</Label>
              <Input
                id="gSuiteEmail"
                placeholder="name.surname@g.bracu.ac.bd"
                onChange={(e) => handleValueChange("tempEmail", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify(formData.tempId, formData.tempEmail)}
                className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
              />
            </div>
            <Button
              onClick={() => handleVerify(formData.tempId, formData.tempEmail)}
              disabled={isVerifying}
              className="w-full bg-foreground text-background py-6 font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Access Form"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentPage = evaluationData.pages[currentPageIndex];

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-start justify-center px-4 py-24 bg-background">
      <div className="w-full max-w-3xl space-y-12 bg-background p-8 md:p-12 border border-border shadow-sm">
        <div className="space-y-4 text-center border-b border-border pb-8">
          <h1 className="text-3xl font-serif tracking-tight text-foreground">{currentPage.title || currentPage.name}</h1>
          {currentPage.description && (
            <p className="text-muted-foreground font-light text-sm italic max-w-xl mx-auto">
              {currentPage.description}
            </p>
          )}
          <div className="flex justify-center gap-2 pt-6">
            {evaluationData.pages.map((p, i) => {
               if (!isPageVisible(p)) return null;
               return (
                <div 
                  key={i} 
                  className={`h-1 w-6 rounded-full transition-all duration-500 ${i === currentPageIndex ? "bg-primary w-12" : i < currentPageIndex ? "bg-muted-foreground" : "bg-muted"}`} 
                />
               );
            })}
          </div>
        </div>

        <div className="space-y-12">
          {currentPage.elements.map((el: any, idx: number) => {
            if (!isElementVisible(el)) return null;

            return (
              <div key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                {el.type !== "html" && el.type !== "image" && (
                  <div className="space-y-1">
                    <Label className="text-sm font-bold uppercase tracking-widest text-foreground block">
                      {el.title} {el.isRequired && <span className="text-destructive">*</span>}
                    </Label>
                    {el.description && <p className="text-xs text-muted-foreground font-light whitespace-pre-wrap">{el.description}</p>}
                  </div>
                )}

                {el.type === "text" && (
                  <Input
                    type={el.inputType || "text"}
                    placeholder={el.placeholder || "Type your answer here..."}
                    value={formData[el.name] || ""}
                    onChange={(e) => handleValueChange(el.name, e.target.value)}
                    className="bg-muted/5 border border-border rounded-md px-4 py-6 focus-visible:ring-1 focus-visible:ring-primary transition-all text-base font-light w-full placeholder:text-muted-foreground/50"
                  />
                )}

                {el.type === "comment" && (
                  <Textarea
                    placeholder={el.placeholder || "Write your detailed response here..."}
                    value={formData[el.name] || ""}
                    onChange={(e) => handleValueChange(el.name, e.target.value)}
                    className="min-h-[150px] bg-muted/5 border border-border rounded-md focus-visible:ring-1 focus-visible:ring-primary transition-all text-base font-light resize-none p-4 w-full placeholder:text-muted-foreground/50"
                  />
                )}

                {el.type === "radiogroup" && (
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {[...el.choices, ...(el.showOtherItem ? ["other"] : [])].map((choice: any) => {
                      const label = typeof choice === "string" ? (choice === "other" ? "Other" : choice) : choice.text;
                      const value = typeof choice === "string" ? choice : choice.value;
                      return (
                        <div key={value} className="space-y-3">
                          <button
                            type="button"
                            onClick={() => handleValueChange(el.name, value)}
                            className={`text-left px-6 py-4 border text-sm transition-all rounded-sm flex items-center gap-3 w-full ${
                              formData[el.name] === value
                                ? "bg-foreground text-background border-foreground shadow-md"
                                : "bg-transparent text-foreground border-border hover:border-foreground"
                            }`}
                          >
                            <div className={`h-4 w-4 border rounded-full flex items-center justify-center ${formData[el.name] === value ? "border-background" : "border-muted-foreground"}`}>
                              {formData[el.name] === value && <div className="h-2 w-2 bg-background rounded-full" />}
                            </div>
                            {label}
                          </button>
                          {value === "other" && formData[el.name] === "other" && (
                            <Input
                              placeholder="Please specify..."
                              onChange={(e) => handleValueChange(`${el.name}-Comment`, e.target.value)}
                              value={formData[`${el.name}-Comment`] || ""}
                              className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm ml-7 w-[calc(100%-28px)]"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {el.type === "checkbox" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {[...el.choices, ...(el.showNoneItem ? ["none"] : []), ...(el.showOtherItem ? ["other"] : [])].map((choice: any) => {
                      const label = typeof choice === "string" ? (choice === "none" ? "None" : (choice === "other" ? "Other" : choice)) : choice.text;
                      const value = typeof choice === "string" ? choice : choice.value;
                      const isSelected = (formData[el.name] || []).includes(value);
                      return (
                        <div key={value} className="space-y-3 col-span-1 md:col-span-1">
                          <button
                            type="button"
                            onClick={() => {
                              let next;
                              const current = formData[el.name] || [];
                              if (value === "none") {
                                next = isSelected ? [] : ["none"];
                              } else {
                                const withoutNone = current.filter((v: string) => v !== "none");
                                next = isSelected 
                                  ? withoutNone.filter((v: string) => v !== value)
                                  : [...withoutNone, value];
                              }
                              handleValueChange(el.name, next);
                            }}
                            className={`text-left px-4 py-3 border text-sm transition-all rounded-sm flex items-center justify-between w-full ${
                              isSelected
                                ? "bg-muted/50 border-primary text-foreground"
                                : "bg-transparent border-border text-muted-foreground hover:border-foreground"
                            }`}
                          >
                            {label}
                            <div className={`h-4 w-4 border rounded-sm flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                              {isSelected && <div className="h-2 w-2 bg-background rounded-full" />}
                            </div>
                          </button>
                          {value === "other" && isSelected && (
                            <Input
                              placeholder="Please specify..."
                              onChange={(e) => handleValueChange(`${el.name}-Comment`, e.target.value)}
                              value={formData[`${el.name}-Comment`] || ""}
                              className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm w-full"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {el.type === "boolean" && (
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {[
                      { label: el.labelTrue || el.valueTrue || "Yes", value: el.valueTrue !== undefined ? el.valueTrue : "Yes" },
                      { label: el.labelFalse || el.valueFalse || "No", value: el.valueFalse !== undefined ? el.valueFalse : "No" },
                    ].map((option) => {
                      const isSelected = 
                        formData[el.name] === option.value || 
                        (formData[el.name] === true && (option.value === "Yes" || option.value === true)) ||
                        (formData[el.name] === false && (option.value === "No" || option.value === false)) ||
                        (typeof formData[el.name] === "string" && formData[el.name].toLowerCase() === option.label.toLowerCase());

                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => handleValueChange(el.name, option.value)}
                          className={`px-8 py-3.5 border text-sm font-medium transition-all rounded-sm flex items-center gap-3 ${
                            isSelected
                              ? "bg-foreground text-background border-foreground shadow-md"
                              : "bg-transparent text-foreground border-border hover:border-foreground hover:bg-muted/30"
                          }`}
                        >
                          <div
                            className={`h-4 w-4 border rounded-full flex items-center justify-center ${
                              isSelected ? "border-background" : "border-muted-foreground"
                            }`}
                          >
                            {isSelected && <div className="h-2 w-2 bg-background rounded-full" />}
                          </div>
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {el.type === "rating" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {[1, 2, 3, 4, 5].map((score) => {
                        const isSelected = formData[el.name] === score || formData[el.name] === String(score);
                        return (
                          <button
                            key={score}
                            type="button"
                            onClick={() => handleValueChange(el.name, score)}
                            className={`w-12 h-12 rounded-sm border text-sm font-bold transition-all flex items-center justify-center ${
                              isSelected
                                ? "bg-foreground text-background border-foreground shadow-md scale-105"
                                : "bg-transparent text-foreground border-border hover:border-foreground hover:bg-muted/30"
                            }`}
                          >
                            {score}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground uppercase tracking-wider max-w-[280px] px-1">
                      <span>1 - Poor</span>
                      <span>5 - Excellent</span>
                    </div>
                  </div>
                )}

                {el.type === "html" && (
                  <div className="p-6 bg-muted/30 border border-border rounded-sm prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: el.html }} />
                )}

                {el.type === "image" && (
                  <div className="border border-border rounded-sm overflow-hidden bg-muted">
                    <img src={el.imageLink} alt={el.name} className="w-full object-cover" style={{ height: el.imageHeight || 'auto' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setCurrentPageIndex(prev => prev - 1)}
            disabled={currentPageIndex <= 0}
            className="text-[10px] font-bold uppercase tracking-widest gap-2"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-foreground text-background px-8 py-6 font-medium transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {isSubmitting 
              ? "Processing..." 
              : (currentPageIndex === evaluationData.pages.length - 1 ? "Finish Evaluation" : "Next Step")}
          </Button>
        </div>
      </div>
    </div>
  );
}
