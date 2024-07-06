"use client";

import advisorsData, { coAdvisorsData } from "@/constants/advisors";
import EBs from "@/constants/ebs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import SectionHeading from "./SectionHeading";

const advisors = [...advisorsData, ...coAdvisorsData];
const GBs = EBs.filter((eb) => eb.department === "Governing Body");

export default function CurrentPanel() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-8 px-20 py-16">
      <div className="flex flex-col items-center">
        <SectionHeading
          title="Current Panel"
          description="Meet the current panel of the BRAC University Computer Club."
        />
      </div>

      {/* Advisors Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
        {advisors.map((advisor) => (
          <div
            key={advisor.name}
            className="relative overflow-hidden rounded-lg shadow-lg"
          >
            <Image
              src={advisor.image}
              alt={advisor.name}
              className="h-full w-full object-cover"
              width={400}
              height={400}
              placeholder="blur"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-semibold">{advisor.name}</h3>
              <p className="text-sm text-gray-300">{advisor.designation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Governing Body Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-4">
        {GBs.map((gb) => (
          <div
            key={gb.fullName}
            className="relative h-80 overflow-hidden rounded-lg shadow-lg"
          >
            <Image
              src={gb.image}
              alt={gb.fullName}
              className="h-full w-full object-cover"
              width={400}
              height={400}
              placeholder="blur"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-semibold">{gb.fullName}</h3>
              <p className="text-sm text-gray-300">{gb.designation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View Full Panel Button */}
      <div className="mt-8 flex justify-center">
        <Button className="inline-flex h-12 items-center justify-center rounded-md bg-[#127cc1] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#1f4864] disabled:pointer-events-none disabled:opacity-50">
          <Link href="/about/executive-body">Full Executive Body 2024</Link>
        </Button>
      </div>
    </div>
  );
}
