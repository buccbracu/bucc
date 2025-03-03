"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const DownloadDataCard = () => (
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
);

export default DownloadDataCard;
