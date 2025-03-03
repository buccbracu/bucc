import PageHeader from "@/components/page-header";
import { EBsByDepartment } from "@/constants/ebs";
import { Facebook, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function ExecutiveBody() {
  const EBs = EBsByDepartment;
  return (
    <div className="w-full">
      <PageHeader
        title="Executive Body 2024"
        description="The Executive Body of the BRAC University Computer Club (BUCC) is the heart and soul of the club's operations. Composed of enthusiastic and committed members, this team is the engine driving all club activities and initiatives. They excel in planning events, managing projects, and ensuring that everything runs smoothly within the club. Their primary goal is to nurture a dynamic and collaborative environment that encourages personal and professional development for all members. Through their vision and dedication, the Executive Body continually elevates BUCC, creating a lasting positive impact on its members and the broader community."
      />
      <section className="py-6">
        {EBs.map((department) => (
          <div key={department.departmentName} className="mb-8">
            <h2 className="mb-4 mt-4 text-center text-3xl font-bold">
              {department.departmentName}
            </h2>
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
              {/* President and Vice President Row */}
              {department.presidentAndVicePresident?.map(
                (presidentAndVicePresident) => (
                  <div
                    key={presidentAndVicePresident.fullName}
                    className="flex w-96 flex-col items-center rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
                  >
                    <Image
                      src={presidentAndVicePresident.image.src}
                      height={540}
                      width={960}
                      placeholder="blur"
                      blurDataURL={presidentAndVicePresident.image.blurDataURL}
                      alt={presidentAndVicePresident.fullName}
                      className="rounded-t-lg object-cover"
                    />
                    <div className="mt-4 text-center">
                      <h3 className="text-xl font-semibold">
                        {presidentAndVicePresident.fullName}
                      </h3>
                      <p className="text-gray-500">
                        {presidentAndVicePresident.designation}
                      </p>

                      <div className="mt-2 flex justify-center gap-4">
                        <Link
                          href={presidentAndVicePresident.facebookURL}
                          prefetch={false}
                          className="text-gray-500 hover:text-[#1f4864]"
                        >
                          <Facebook size={24} />
                        </Link>
                        <Link
                          href={presidentAndVicePresident.linkedinURL}
                          prefetch={false}
                          className="text-gray-500 hover:text-[#1f4864]"
                        >
                          <Linkedin size={24} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 md:flex-row">
              {/* General Secretary and Treasurer Row */}
              {department.generalSecretaryAndTreasurer?.map(
                (generalSecretaryAndTreasurer) => (
                  <div
                    key={generalSecretaryAndTreasurer.fullName}
                    className="flex w-96 flex-col items-center rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
                  >
                    <Image
                      src={generalSecretaryAndTreasurer.image.src}
                      height={540}
                      width={960}
                      placeholder="blur"
                      blurDataURL={
                        generalSecretaryAndTreasurer.image.blurDataURL
                      }
                      alt={generalSecretaryAndTreasurer.fullName}
                      className="rounded-t-lg object-cover"
                    />
                    <div className="mt-4 text-center">
                      <h3 className="text-xl font-semibold">
                        {generalSecretaryAndTreasurer.fullName}
                      </h3>
                      <p className="text-gray-500">
                        {generalSecretaryAndTreasurer.designation}
                      </p>
                      <div className="mt-2 flex justify-center gap-4">
                        <Link
                          href={generalSecretaryAndTreasurer.facebookURL}
                          prefetch={false}
                          className="text-gray-500 hover:text-[#1f4864]"
                        >
                          <Facebook size={24} />
                        </Link>
                        <Link
                          href={generalSecretaryAndTreasurer.linkedinURL}
                          prefetch={false}
                          className="text-gray-500 hover:text-[#1f4864]"
                        >
                          <Linkedin size={24} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 md:flex-row">
              {/* Directors Row */}
              {department.directors?.map((director) => (
                <div
                  key={director.fullName}
                  className="flex w-96 flex-col items-center rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
                >
                  <Image
                    src={director.image.src}
                    height={540}
                    width={960}
                    placeholder="blur"
                    blurDataURL={director.image.blurDataURL}
                    alt={director.fullName}
                    className="rounded-t-lg object-cover"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold">
                      {director.fullName}
                    </h3>
                    <p className="text-gray-500">{director.designation}</p>
                    <div className="mt-2 flex justify-center gap-4">
                      <Link
                        href={director.facebookURL}
                        prefetch={false}
                        className="text-gray-500 hover:text-[#1f4864]"
                      >
                        <Facebook size={24} />
                      </Link>
                      <Link
                        href={director.linkedinURL}
                        prefetch={false}
                        className="text-gray-500 hover:text-[#1f4864]"
                      >
                        <Linkedin size={24} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 md:flex-row">
              {/* Assistant Directors Row */}
              {department.assistantDirectors?.map((assistantDirector) => (
                <div
                  key={assistantDirector.fullName}
                  className="flex w-96 flex-col items-center rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
                >
                  <Image
                    src={assistantDirector.image.src}
                    height={540}
                    width={960}
                    placeholder="blur"
                    blurDataURL={assistantDirector.image.blurDataURL}
                    alt={assistantDirector.fullName}
                    className="rounded-t-lg object-cover"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold">
                      {assistantDirector.fullName}
                    </h3>
                    <p className="text-gray-500">
                      {assistantDirector.designation}
                    </p>
                    <div className="mt-2 flex justify-center gap-4">
                      <Link
                        href={assistantDirector.facebookURL}
                        prefetch={false}
                        className="text-gray-500 hover:text-[#1f4864]"
                      >
                        <Facebook size={24} />
                      </Link>
                      <Link
                        href={assistantDirector.linkedinURL}
                        prefetch={false}
                        className="text-gray-500 hover:text-[#1f4864]"
                      >
                        <Linkedin size={24} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
