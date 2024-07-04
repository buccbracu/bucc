"use client";

import Heading from "@/components/portal/heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import BUCCSEs from "@/constants/BUCC_SEs";
import getEvaluations from "@/server/actions";
import exportFromJSON from "export-from-json";

export default function Backup() {
  const fileNamePre = "PreRegMemberInfos";
  const fileNameMem = "MemberInfos";
  const fileNameEB = "EbassessmentInfos";
  const exportType = exportFromJSON.types.csv;

  const completeRegistration = () => {
    const evaluationsData = getEvaluations().then((evaluations) => {
      evaluations.forEach((evaluation: any) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(evaluation),
        });
      });
    });
  };

  const registerExistingMembers = () => {
    BUCCSEs.forEach((buccse) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/existingMember`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buccse),
      });
    });
  };

  return (
    <main>
      <Heading
        headingText="Data Backup"
        subHeadingText="This is the backup page. You can download the data from this page clicking the button below. The data will be downloaded in a zip file."
      />
      <div className="mb-6 grid h-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex h-full flex-col justify-between sm:w-full">
          <CardHeader>Download Data</CardHeader>
          <CardContent>
            <p>
              You can download the data from the database by clicking the button
              below. The data will be downloaded in a zip file.
            </p>
          </CardContent>
          <CardFooter>
            <Button disabled={true} className="mr-3">
              Download Data (Under Construction)
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex h-full flex-col justify-between sm:w-full">
          <CardHeader>Complete Registration</CardHeader>
          <CardContent>
            <p>
              You can complete the registration of the users by clicking the
              button below. The users will be registered in the database.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={completeRegistration} className="mr-3">
              Complete Registration
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex h-full flex-col justify-between sm:w-full">
          <CardHeader>Register Existing Members</CardHeader>
          <CardContent>
            <p>
              You can register the existing members by clicking the button
              below. The existing members will be registered in the database.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={registerExistingMembers} className="mr-3">
              Register Existing Members
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex h-full flex-col justify-between sm:w-full">
          <CardHeader>Download CSV</CardHeader>
          <CardContent>
            <p>
              You can download the data from the database in CSV format by
              clicking the button below.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="mx-3"
              onClick={() => {
                fetch("http://localhost:3000/api/preregistration")
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
              Download Pre-Registration CSV
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex h-full flex-col justify-between sm:w-full">
          <CardHeader>Download Member (Department)</CardHeader>
          <CardContent>
            <p>
              You can download the data from the database in CSV format by
              clicking the button below.
            </p>
          </CardContent>
          <CardFooter>
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
              Download Member CSV
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex h-full flex-col justify-between sm:w-full">
          <CardHeader>Download EB Assessment</CardHeader>
          <CardContent>
            <p>
              You can download the data from the database in CSV format by
              clicking the button below.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="mx-3"
              onClick={() => {
                fetch("http://localhost:3000/api/ebassessment")
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
              Download EB Assessment CSV
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
