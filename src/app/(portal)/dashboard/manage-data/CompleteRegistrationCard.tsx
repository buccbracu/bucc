"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import getEvaluations from "@/server/actions";

const CompleteRegistrationCard = () => {
  const completeRegistration = () => {
    getEvaluations().then((evaluations) => {
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

  return (
    <Card className="flex h-full flex-col justify-between sm:w-full">
      <CardHeader>Complete Registration</CardHeader>
      <CardContent>
        <p>
          You can complete the registration of the users by clicking the button
          below. The users will be registered in the database.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={completeRegistration} className="mr-3">
          Complete Registration
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompleteRegistrationCard;
