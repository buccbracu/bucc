"use client";

import { json } from "@/components/evaluation/questionJSON";
import Heading from "@/components/portal/heading";
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
  evaluationID: string
): Promise<EvaluationData | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/evaluation?evaluationID=${evaluationID}`,
      {
        cache: "no-store",
        next: { revalidate: 10 },
      }
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
    null
  );

  useEffect(() => {
    const fetchEvaluations = async () => {
      const data = await getEvaluation(params.evaluationID);
      setEvaluationData(data);
    };
    fetchEvaluations();
  }, [params.evaluationID]);

  if (!evaluationData) {
    return <div>Loading...</div>;
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
        <ul className="list-disc pl-8">
          {response.map((choice: any, index: number) => (
            <li key={index}>{findChoiceText(element, choice)}</li>
          ))}
        </ul>
      );
    } else {
      return <p>{findChoiceText(element, response)}</p>;
    }
  };

  const findChoiceText = (element: any, value: any): string => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (element.choices) {
      const choice = element.choices.find((c: any) => c.value === value);
      return choice ? choice.text : value;
    }
    return value;
  };

  return (
    <div className="mx-auto">
      <Heading
        headingText="Evaluation Data"
        subHeadingText={`Evaluation of ${evaluationData.name}`}
      />
      <div className="md:flex md:flex-row-reverse">
        <div className="p-4 md:w-1/3">
          <h3 className="text-xl font-bold mb-6">EB Assesment</h3>
          <EvaluationAssesment evaluationData={evaluationData} />
        </div>
        <div className="p-4 md:w-2/3">
          <h3 className="text-xl font-bold mb-6">Evaluation Responses</h3>
          {responseObject &&
            json.pages.map((page: any) => {
              const hasPageResponse = page.elements.some((element: any) =>
                hasValidResponse(element.name)
              );

              return hasPageResponse ? (
                <div
                  key={page.name}
                  className="mb-6 dark:bg-gray-700 dark:text-gray-100 bg-gray-100 text-gray-800 p-6 rounded-lg overflow-clip"
                >
                  <h2 className="text-lg font-bold mb-2">{page.title}</h2>
                  {page.elements.map((element: any) =>
                    hasValidResponse(element.name) ? (
                      <div key={element.name} className="mb-4">
                        <h3 className="font-semibold">{element.title}</h3>
                        {renderResponse(element)}
                      </div>
                    ) : null
                  )}
                </div>
              ) : null;
            })}
        </div>
      </div>
    </div>
  );
}
