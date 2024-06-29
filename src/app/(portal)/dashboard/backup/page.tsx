"use client";
import Heading from "@/components/portal/heading";
import { Button } from "@/components/ui/button";
import getEvaluations from "@/server/actions";
import exportFromJSON from "export-from-json";

export default function page() {
  const fileNamePre = "PreRegMemberInfos";
  const fileNameMem = "MemberInfos";
  const fileNameEB = "EbassesmentInfos";
  const exportType = exportFromJSON.types.csv;

  const completeRegistration = () => {
    const evaluationsData = getEvaluations().then((evaluations) => {
      evaluations.forEach((evaluation: any) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register-all`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(evaluation),
        });
      });
    });
  };

  return (
    <main>
      <Heading
        headingText="Data Backup"
        subHeadingText="This is the backup page. You can download the data from this page clicking the button below. The data will be downloaded in a zip file."
      />
      <div>
        <Button disabled={true} className="mr-3">
          Download Data (Under Construction)
        </Button>
        <Button
          className="mx-3"
          onClick={() => {
            fetch("http://localhost:3000/api/preregmembers")
              .then((res) => res.json())
              .then((response) =>
                exportFromJSON({
                  data: response.users,
                  fileName: fileNamePre,
                  exportType,
                }),
              );
          }}
        >
          Download PreRegMemberInfos CSV
        </Button>
        <Button
          className="mx-3"
          onClick={() => {
            fetch("http://localhost:3000/api/members")
              .then((res) => res.json())
              .then((response) =>
                exportFromJSON({
                  data: response.users,
                  fileName: fileNameMem,
                  exportType,
                }),
              );
          }}
        >
          Download Dept Members CSV
        </Button>
      </div>
      <div className="mt-3">
        <Button
          className="mx-3"
          onClick={() => {
            fetch("http://localhost:3000/api/ebassesment")
              .then((res) => res.json())
              .then((response) =>
                exportFromJSON({
                  data: response.users,
                  fileName: fileNameEB,
                  exportType,
                }),
              );
          }}
        >
          Download Ebassesment CSV
        </Button>
        <Button onClick={completeRegistration} className="ml-3">
          Complete Registration
        </Button>
      </div>
    </main>
  );
}
