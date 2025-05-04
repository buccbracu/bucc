import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center p-4">
      <Image
        className="p-3 dark:invert dark:filter"
        src="/images/under-construction.png"
        width={150}
        height={150}
        alt="Under Construction"
      />
      <div className="max-w-[550px] text-center">
        <h1 className="text-lg">This Page Is Under Construction</h1>
        <p className="mt-2 text-center text-lg leading-relaxed">
          👋 Hey there! We truly appreciate your patience and support as we work
          hard to bring you the best experience.
          <br />
          <span className="mt-2 block font-medium">
            From — 💻 Web Team, Research & Development Departmment
            <br />
            🎓 BUCC
          </span>
        </p>
      </div>
      <Button className="text-md mt-4 bg-[#127cc1] text-white hover:bg-[#1f4864] dark:hover:bg-[#1f4864]">
        <Link href={"/"}>Back to Home</Link>
      </Button>
    </div>
  );
}
