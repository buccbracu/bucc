import Heading from "@/components/portal/heading";
import { Button } from "@/components/ui/button";

export default function page() {
  return (
    <main>
      <Heading
        headingText="Data Backup"
        subHeadingText="This is the backup page. You can download the data from this page clicking the button below. The data will be downloaded in a zip file."
      />
      <Button>Download Data</Button>
    </main>
  );
}
