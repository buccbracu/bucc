"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import exportFromJSON from "export-from-json";

const DownloadCSVCard = ({
  url,
  fileName,
}: {
  url: string;
  fileName: string;
}) => {
  const exportType = exportFromJSON.types.csv;

  return (
    <Card className="flex h-full flex-col justify-between sm:w-full">
      <CardHeader>Download CSV</CardHeader>
      <CardContent>
        <p>
          You can download the data from the database in CSV format by clicking
          the button below.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="mx-3"
          onClick={() => {
            fetch(url)
              .then((res) => res.json())
              .then((response) =>
                exportFromJSON({
                  data: response.users,
                  fileName: fileName,
                  exportType,
                }),
              );
          }}
        >
          Download CSV
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DownloadCSVCard;
