import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center p-4">
      <Image
        className="p-3 dark:invert dark:filter"
        src="/images/under-construction.png"
        width={200}
        height={200}
        alt="Under Construction"
      />
      <div className="max-w-[500px] text-center">
        <h1 className="text-lg">This Page Is Under Construction</h1>
        <p className="mt-2 text-sm">
          Good things take time! We are trying to build the best ever experience
          for our members. This page is also under construction. Please check
          back later.
        </p>
      </div>
      <Button className="text-md mt-4 bg-[#127cc1] text-white hover:bg-[#1f4864] dark:hover:bg-[#1f4864]">
        <Link href={"/"}>Back to Home</Link>
      </Button>
    </div>
  );
}
