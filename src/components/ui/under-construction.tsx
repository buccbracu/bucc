import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function UnderConstruction() {
  return (
    <div className="p-4 flex flex-col items-center">
      <Image
        className="p-3 dark:filter dark:invert"
        src="/images/under-construction.png"
        width={200}
        height={200}
        alt="Under Construction"
      />
      <h1 className="text-lg">This Page Is Under Construction</h1>
      <p className="text-sm mt-2">
        This page is under construction. Please check back later.
      </p>
      <Button className="mt-4 text-md bg-blue-500 hover:bg-blue-600 text-white dark:hover:bg-blue-600">
        <Link href={"/"}>Back to Home</Link>
      </Button>
    </div>
  );
}
