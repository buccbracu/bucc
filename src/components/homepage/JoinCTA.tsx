import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function JoinCTA() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between rounded-2xl bg-gradient-to-r from-[#1f4864] to-[#127cc1] p-10 lg:flex-row lg:px-20 lg:py-14">
          <div className="mb-5 text-center lg:mb-0 lg:text-left">
            <h2 className="font-manrope mb-5 text-4xl font-semibold text-white lg:mb-2">
              Join the Most Exciting Tech Community
            </h2>
            <p className="max-w-2xl text-sm text-indigo-100">
              A community for tech enthusiasts from BRAC University, where we
              explore the latest advancements in computer science and
              technology.
            </p>
          </div>
          <div className="flex items-center">
            <Button className="rounded-full bg-white px-10 py-8 text-lg font-semibold text-[#1f4864] shadow-sm transition-all duration-500 hover:text-white dark:bg-white">
              <Link
                href="/registration"
                className="flex items-center gap-2 rounded-full"
              >
                Join Us <ArrowRight size={24} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
