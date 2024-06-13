"use client";

import departments from "@/constants/departments";
import Image from "next/image";
import { useState } from "react";
import { Scrollama, Step } from "react-scrollama";

const departmentData = departments.slice(2).map((department) => ({
  name: department.title,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacus, nisl nec ultricies lacus.",
  imgSrc: `/images/${department.title.toLowerCase().replace(/ /g, "-")}.jpg`,
}));

export default function Component() {
  const [currentStepIndex, setCurrentStepIndex] = useState(null);

  const onStepEnter = ({ data }) => {
    setCurrentStepIndex(data);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="container flex h-screen items-center justify-between gap-12 py-12">
        <div className="sticky top-0 left-0 flex h-full flex-col justify-center gap-4 text-5xl font-bold tracking-tighter md:text-7xl">
          {departmentData.map((department, index) => (
            <div
              key={department.name}
              className={`bg-gradient-to-r ${
                currentStepIndex === index
                  ? "from-gray-100 to-gray-200 bg-clip-text text-transparent"
                  : "from-gray-400 to-gray-500 bg-clip-text text-transparent"
              } transition-colors duration-500 dark:from-gray-800 dark:to-gray-700`}
            >
              {department.name}
            </div>
          ))}
        </div>
        <div className="relative flex h-full w-full max-w-2xl flex-col gap-12 overflow-hidden">
          <Scrollama offset={0.5} onStepEnter={onStepEnter} debug>
            {departmentData.map((department, index) => (
              <Step data={index} key={department.name}>
                <div
                  className="grid grid-cols-1 gap-12 md:grid-cols-2 transform transition-transform duration-500"
                  style={{
                    transform:
                      currentStepIndex === index ? "none" : "translateY(50px)",
                    opacity: currentStepIndex === index ? 1 : 0.5,
                  }}
                >
                  <Image
                    src={department.imgSrc}
                    width={600}
                    height={400}
                    alt={department.name}
                    className="aspect-[3/2] overflow-hidden rounded-xl object-cover object-center"
                  />
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold tracking-tighter">
                      {department.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {department.description}
                    </p>
                  </div>
                </div>
              </Step>
            ))}
          </Scrollama>
        </div>
      </div>
    </div>
  );
}
