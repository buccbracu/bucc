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
  title,
  description,
  url,
  fileName,
  isDisabled
}: {
  title?: string;
  description?: string;
  url: string;
  fileName: string;
  isDisabled:boolean
}) => {
  const exportType = exportFromJSON.types.csv;

  return (
    <Card className="flex h-full flex-col justify-between sm:w-full">
      <CardHeader>{title}</CardHeader>
      <CardContent>
        <p>
         {description}
        </p>
      </CardContent>
      <CardFooter>
        <Button
        disabled={isDisabled}
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
