"use client";

import PageHeader from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import allExecutiveBodyData from "@/constants/all-executive-body/data";
import { Facebook, Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ExecutiveBody() {
  // State to track the currently selected panel
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(0);
  const selectedPanel =
    allExecutiveBodyData && allExecutiveBodyData.length > 0
      ? allExecutiveBodyData[selectedPanelIndex]
      : null;

  return (
    <div className="w-full">
      <PageHeader
        title={`Executive Body ${selectedPanel?.panelYear}`}
        description="The Executive Body of the BRAC University Computer Club (BUCC) is the heart and soul of the club's operations. Composed of enthusiastic and committed members, this team is the engine driving all club activities and initiatives. They excel in planning events, managing projects, and ensuring that everything runs smoothly within the club. Their primary goal is to nurture a dynamic and collaborative environment that encourages personal and professional development for all members. Through their vision and dedication, the Executive Body continually elevates BUCC, creating a lasting positive impact on its members and the broader community."
      />

      {/* Panel Year Selection Buttons */}
      <div className="relative mt-8 flex flex-wrap justify-center gap-2 px-10">
        {allExecutiveBodyData.map((panel, index) => (
          <div key={index} className="relative">
            <Button
              onClick={() => setSelectedPanelIndex(index)}
              className={`rounded-md border px-4 py-2 font-semibold transition-colors ${
                selectedPanelIndex === index
                  ? "bg-[#1f4864] text-white"
                  : "bg-white text-[#1f4864] dark:bg-gray-800 dark:text-white"
              } hover:bg-[#1f4864] hover:text-white`}
            >
              {panel.panelYear}
            </Button>
            {index === 0 && (
              <Badge className="absolute left-0 top-0 -ml-6 -mt-3 inline-flex items-center justify-center rounded-full bg-green-700 px-2 py-1 text-xs font-bold leading-none text-white">
                Current
              </Badge>
            )}
          </div>
        ))}
      </div>

      {/* Executive Members Section */}
      <section className="flex-1 py-6">
        {selectedPanel &&
          selectedPanel.executiveMembersByDepartment.map((department) => (
            <div key={department.departmentName} className="mb-8">
              <h2 className="mb-4 mt-4 text-center text-3xl font-bold">
                {department.departmentName}
              </h2>

              {/* President and Vice President */}
              <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                {department.presidentAndVicePresident?.map((executive) => (
                  <ExecutiveCard
                    key={executive.fullName}
                    executive={executive}
                  />
                ))}
              </div>

              {/* General Secretary and Treasurer */}
              <div className="mt-6 flex flex-col items-center justify-center gap-4 md:flex-row">
                {department.generalSecretaryAndTreasurer?.map((executive) => (
                  <ExecutiveCard
                    key={executive.fullName}
                    executive={executive}
                  />
                ))}
              </div>

              {/* Directors */}
              <div className="mt-6 flex flex-col items-center justify-center gap-4 md:flex-row">
                {department.directors?.map((executive) => (
                  <ExecutiveCard
                    key={executive.fullName}
                    executive={executive}
                  />
                ))}
              </div>

              {/* Assistant Directors */}
              <div className="mt-6 flex flex-col items-center justify-center gap-4 px-4 md:flex-row">
                {department.assistantDirectors?.map((executive) => (
                  <ExecutiveCard
                    key={executive.fullName}
                    executive={executive}
                  />
                ))}
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}

// Reusable Component for Executives
const ExecutiveCard = ({ executive }: { executive: any }) => (
  <div className="flex w-96 flex-col items-center rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
    <Image
      src={executive.image.src}
      height={540}
      width={960}
      placeholder="blur"
      blurDataURL={executive.image.blurDataURL}
      alt={executive.fullName}
      className="rounded-t-lg object-cover"
    />
    <div className="mt-4 text-center">
      <h3 className="text-xl font-semibold">{executive.fullName}</h3>
      <p className="text-gray-500">{executive.designation}</p>
      <div className="mt-2 flex justify-center gap-4">
        {executive.facebookURL && (
          <Link
            href={executive.facebookURL}
            prefetch={false}
            className="text-gray-500 hover:text-[#1f4864]"
          >
            <Facebook size={24} />
          </Link>
        )}
        {executive.linkedinURL && (
          <Link
            href={executive.linkedinURL}
            prefetch={false}
            className="text-gray-500 hover:text-[#1f4864]"
          >
            <Linkedin size={24} />
          </Link>
        )}
        {executive.gitHubURL && (
          <Link
            href={executive.gitHubURL}
            prefetch={false}
            className="text-gray-500 hover:text-[#1f4864]"
          >
            <Github size={24} />
          </Link>
        )}
      </div>
    </div>
  </div>
);
