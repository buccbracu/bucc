"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import { json } from "@/components/evaluation/questionJSON";
import Heading from "@/components/portal/heading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import departments from "@/constants/departments";
import { useEffect, useState } from "react";
import EvaluationAssesment from "./evaluation-assesment";

type EvaluationData = {
  name: string;
  studentId: number;
  gSuiteEmail: string;
  interviewTakenBy: string[];
  modifiedBy: string;
  buccDepartment: string;
  status: string;
  comment?: string;
  responseObject: string;
};

type PageProps = {
  params: {
    evaluationID: string;
  };
};

const getEvaluation = async (
  evaluationID: string,
): Promise<EvaluationData | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/evaluation?evaluationID=${evaluationID}`,
      {
        cache: "no-store",
        next: { revalidate: 10 },
      },
    );
    if (!response.ok) {
      throw new Error(`Error fetching evaluation: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default function Evaluation({ params }: PageProps) {
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(
    null,
  );

  useEffect(() => {
    const fetchEvaluations = async () => {
      const data = await getEvaluation(params.evaluationID);
      setEvaluationData(data);
    };
    fetchEvaluations();
  }, [params.evaluationID]);

  if (!evaluationData) {
    return <SpinnerComponent />;
  }

  const responseObject = JSON.parse(evaluationData.responseObject);

  const hasValidResponse = (name: string) => {
    if (!responseObject) return false;
    const response = responseObject[name];
    return (
      response !== undefined &&
      response !== null &&
      (Array.isArray(response) ? response.length > 0 : true)
    );
  };

  const renderResponse = (element: any) => {
    if (!responseObject) return null;
    const response = responseObject[element.name];
    if (Array.isArray(response)) {
      return (
        <ul className="list-disc overflow-hidden pl-8">
          {response.map((choice: any, index: number) => (
            <li key={index}>{findChoiceText(element, choice)}</li>
          ))}
        </ul>
      );
    } else {
      return (
        <p className="text-muted-foreground">
          {findChoiceText(element, response)}
        </p>
      );
    }
  };

  const findChoiceText = (element: any, value: any): React.ReactNode => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (element.choices) {
      const choice = element.choices.find((c: any) => c.value === value);
      if (departments.includes(value)) {
        return (
          <Badge
            className="mt-2 bg-blue-200 p-1 px-3 text-blue-900 hover:bg-blue-300 dark:bg-blue-900/90 dark:text-blue-200 dark:hover:bg-blue-800/90"
            variant={"accepted"}
          >
            {value}
          </Badge>
        );
      }
      return choice ? choice.text : value;
    }
    return value;
  };

  return (
    <div className="mx-auto w-[calc(100vw-140px)] md:w-full">
      <Heading
        headingText="Evaluation Data"
        subHeadingText={`Evaluation of ${evaluationData.name}`}
      />
      <div className="md:flex md:flex-row-reverse">
        <div className="py-4 md:w-1/3">
          <h3 className="mb-6 text-xl font-bold">EB Assesment</h3>
          <EvaluationAssesment evaluationData={evaluationData} />
        </div>
        <div className="pt-6 md:w-2/3 md:pr-4 md:pt-4">
          <h3 className="mb-6 text-xl font-bold">Evaluation Responses</h3>
          {responseObject &&
            json.pages.map((page: any) => {
              const hasPageResponse = page.elements.some((element: any) =>
                hasValidResponse(element.name),
              );
              return hasPageResponse ? (
                <Card className="mb-4" key={page.name}>
                  <CardHeader className="text-lg font-semibold">
                    {page.title}
                  </CardHeader>
                  {page.elements.map((element: any) =>
                    hasValidResponse(element.name) ? (
                      <CardContent
                        className="overflow-hidden"
                        key={element.name}
                      >
                        <CardDescription className="text-md font-semibold text-black dark:text-gray-200">
                          {element.title}
                        </CardDescription>
                        {renderResponse(element)}
                      </CardContent>
                    ) : null,
                  )}
                </Card>
              ) : null;
            })}
        </div>
      </div>
    </div>
  );
}
