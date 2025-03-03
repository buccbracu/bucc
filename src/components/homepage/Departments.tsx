"use client";

import { departmentsInfo } from "@/constants/departments";
import { useState } from "react";
import Department from "./Department";
import SectionHeading from "./SectionHeading";

export default function Departments() {
  const [selectedDepartment, setSelectedDepartment] = useState(
    departmentsInfo[0],
  );

  return (
    <section className="bg-gray-100 px-4 py-12 text-center dark:bg-gray-900 dark:text-gray-100 md:px-20">
      <div className="container">
        {" "}
        <div className="mx-auto">
          <SectionHeading
            title="Departments of BUCC"
            description="Explore the diverse departments of the BRAC University Computer Club and learn more about the exciting opportunities they offer."
          />
        </div>
        <div className="mt-8 flex flex-col items-center space-y-6 md:flex-row md:items-center md:space-x-6 md:space-y-0 md:p-6 md:text-left">
          <div className="grid w-full flex-grow grid-flow-row gap-3 md:w-auto">
            {departmentsInfo.map((department, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded-lg px-4 py-2 transition duration-300 ${
                  department.name === selectedDepartment.name
                    ? "bg-blue-100 pt-2 dark:bg-blue-900"
                    : "mb:hover:bg-gray-100 bg-white pt-2 dark:bg-gray-800 md:bg-transparent md:dark:bg-transparent md:dark:hover:bg-gray-700"
                }`}
                onClick={() => setSelectedDepartment(department)}
              >
                <h2
                  className={`mb-2 text-lg font-semibold ${
                    department.name === selectedDepartment.name
                      ? "pt-2 text-blue-700 dark:text-blue-300"
                      : "pt-2 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  {department.name}
                </h2>
              </div>
            ))}
          </div>

          <div className="h-full w-full align-middle md:w-2/3">
            <Department department={selectedDepartment} />
          </div>
        </div>
      </div>
    </section>
  );
}
