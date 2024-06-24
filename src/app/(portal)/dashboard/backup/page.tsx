"use client";
import Heading from "@/components/portal/heading";
import { Button } from "@/components/ui/button";
import exportFromJSON from "export-from-json";

export default function page() {
  const fileName = "PreRegMemberInfos";
  const exportType = exportFromJSON.types.csv;

  return (
    <main>
      <Heading
        headingText="Data Backup"
        subHeadingText="This is the backup page. You can download the data from this page clicking the button below. The data will be downloaded in a zip file."
      />
      <Button>Download Data</Button>
      <Button
        className="mx-3"
        onClick={() => {
          fetch("http://localhost:3000/api/preregmembers")
            .then((res) => res.json())
            .then((response) =>
              exportFromJSON({ data: response.users, fileName, exportType })
            );
        }}
      >
        Download PreRegMemberInfos CSV
      </Button>
    </main>
  );
}
