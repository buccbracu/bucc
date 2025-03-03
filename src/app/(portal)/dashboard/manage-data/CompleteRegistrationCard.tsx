"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"; // Adjust the import based on your structure
import getEvaluations from "@/server/actions";
import { useState } from "react";

const CompleteRegistrationCard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const completeRegistration = async () => {
    const evaluations = await getEvaluations();

    // Use Promise.all to handle all fetch requests
    const registrationPromises = evaluations.map((evaluation: any) => {
      return new Promise((resolve) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(evaluation),
        }).then(() => {
          // Wait for 5 seconds before resolving
          setTimeout(resolve, 5000);
        });
      });
    });

    // Execute all registrations and wait for them to complete
    await Promise.all(registrationPromises);
    alert("All registrations completed successfully!");
    setIsDialogOpen(false);
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
        <Button onClick={() => setIsDialogOpen(true)} className="mr-3">
          Complete Registration
        </Button>
      </CardFooter>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="h-fit">
          <DialogTitle>Confirm Registration</DialogTitle>
          <DialogDescription>
            Are you sure you want to complete registration for all users?
          </DialogDescription>
          <DialogFooter className="gap-2">
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={completeRegistration}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CompleteRegistrationCard;
