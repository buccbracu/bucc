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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import Papa from "papaparse";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const RegisterExistingMembersCard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [Members, setMembers] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      const reader = new FileReader();

      reader.onload = () => {
        if (fileType === "text/csv") {
          Papa.parse(file, {
            header: true,
            complete: (results) => {
              setMembers(results.data);
            },
          });
        } else if (
          fileType ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          fileType === "application/vnd.ms-excel"
        ) {
          const data = new Uint8Array(reader.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet);
          setMembers(json);
        } else if (
          fileType === "application/json" ||
          fileType === "application/ld+json"
        ) {
          setMembers(JSON.parse(reader.result as string));
        } else {
          alert(
            "Unsupported file format. Please upload a CSV, XLSX, or JSON file.",
          );
        }
      };

      if (
        fileType === "text/csv" ||
        fileType === "application/json" ||
        fileType === "application/ld+json"
      ) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    }
  };

  const handleRegister = () => {
    if (Members) {
      try {
        setLoading(true);
        Members.forEach((member: any) => {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/existingMember`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(member),
          });
        });
        setLoading(false);
      } catch (error) {
        toast.error("An error occurred while registering members");
        console.error(error);
      } finally {
        toast.success("Members registered successfully");
        setLoading(false);
        setIsDialogOpen(false);
      }
    }
  };

  const handleEdit = () => {
    if (Members) {
      try {
        setLoading(true);
        Members.forEach((member: any) => {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/existingMember`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(member),
          });
        });
        setLoading(false);
      } catch (error) {
        toast.error("An error occurred while updating members");
        console.error(error);
      } finally {
        toast.success("Members updated successfully");
        setLoading(false);
        setIsDialogOpen(false);
      }
    }
  };
  return (
    <>
      <Card className="flex h-full flex-col justify-between sm:w-full">
        <CardHeader>Register/Edit Existing Members</CardHeader>
        <CardContent>
          <p>
            You can register or edit the existing members by clicking the button
            below. You will need to upload a CSV, XLSX, or JSON file.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setIsDialogOpen(true)} className="mr-3">
            Register/Edit Existing Members
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="h-fit">
          <DialogHeader>
            <DialogTitle>Register/Edit Existing Members</DialogTitle>
          </DialogHeader>
          <Input
            type="file"
            accept=".csv, .xlsx, .json"
            onChange={handleFileUpload}
          />
          {Members && (
            <Textarea
              className="mt-4"
              rows={10}
              readOnly
              value={JSON.stringify(Members, null, 2)}
            />
          )}
          <DialogFooter className="flex w-full gap-2">
            <LoadingButton
              loading={loading}
              onClick={handleRegister}
              className="flex-1"
            >
              Register Members
            </LoadingButton>
            <LoadingButton
              loading={loading}
              onClick={handleEdit}
              className="flex-1"
            >
              Edit Members
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterExistingMembersCard;
