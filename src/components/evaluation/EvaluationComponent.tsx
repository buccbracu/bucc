"use client";

import { json } from "@/components/evaluation/questionJSON";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Model } from "survey-core";
import "survey-core/defaultV2.min.css";
import { Survey } from "survey-react-ui";
import { darkTheme } from "./darkTheme";
import { lightTheme } from "./lightTheme";

export default function EvaluationComponent() {
  const { theme } = useTheme();

  const survey = new Model(json);

  useEffect(() => {
    const systemPreference =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)");

    const isDarkMode =
      theme === "dark" ||
      (theme === "system" && systemPreference && systemPreference.matches);

    survey.applyTheme(isDarkMode ? darkTheme : lightTheme);
  });

  survey.onComplete.add(async (sender) => {
    const evaluationData = {
      studentId: sender.data.question2,
      name: sender.data.question1,
      gSuiteEmail: sender.data.question3,
      responseObject: sender.data,
    };

    console.log(evaluationData);

    try {
      const response = await fetch("/api/evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(evaluationData),
      });
      if (!response.ok) {
        throw new Error("Failed to submit evaluation data");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to submit evaluation data:", error);
    }
  });

  return <Survey model={survey} />;
}
