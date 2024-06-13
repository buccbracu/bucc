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
        description="The Executive Body of BUCC is the driving force behind the club's initiatives and activities. Comprised of dedicated and passionate members, the Executive Body is responsible for planning events, coordinating projects, and ensuring the smooth operation of the club. They work tirelessly to foster a vibrant community, promote collaboration, and provide opportunities for personal and professional growth. By leading with vision and commitment, the Executive Body ensures that BUCC continues to thrive and make a positive impact on its members and the broader community."
      />
      <section className="container mx-auto p-4">
        {EBs.map((department) => (
          <div key={department.departmentName} className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-4 mt-4">
              {department.departmentName}
            </h2>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              {/* President and Vice President Row */}
              {department.presidentAndVicePresident?.map(
                (presidentAndVicePresident) => (
                  <div
                    key={presidentAndVicePresident.fullName}
                    className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-96"
                  >
                    <Image
                      src={presidentAndVicePresident.image.src}
                      height={540}
                      width={960}
                      placeholder="blur"
                      blurDataURL={presidentAndVicePresident.image.blurDataURL}
                      alt={presidentAndVicePresident.fullName}
                      className=" object-cover rounded-t-lg"
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
                          className="text-gray-500 hover:text-blue-700"
                        >
                          <Facebook size={24} />
                        </Link>
                        <Link
                          href={presidentAndVicePresident.linkedinURL}
                          prefetch={false}
                          className="text-gray-500 hover:text-blue-900"
                        >
                          <Linkedin size={24} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-6 ">
              {/* General Secretary and Treasurer Row */}
              {department.generalSecretaryAndTreasurer?.map(
                (generalSecretaryAndTreasurer) => (
                  <div
                    key={generalSecretaryAndTreasurer.fullName}
                    className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-96"
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
                      className=" object-cover rounded-t-lg"
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
                          className="text-gray-500 hover:text-blue-700"
                        >
                          <Facebook size={24} />
                        </Link>
                        <Link
                          href={generalSecretaryAndTreasurer.linkedinURL}
                          prefetch={false}
                          className="text-gray-500 hover:text-blue-900"
                        >
                          <Linkedin size={24} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
              {/* Directors Row */}
              {department.directors?.map((director) => (
                <div
                  key={director.fullName}
                  className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-96"
                >
                  <Image
                    src={director.image.src}
                    height={540}
                    width={960}
                    placeholder="blur"
                    blurDataURL={director.image.blurDataURL}
                    alt={director.fullName}
                    className=" object-cover rounded-t-lg"
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
                        className="text-gray-500 hover:text-blue-700"
                      >
                        <Facebook size={24} />
                      </Link>
                      <Link
                        href={director.linkedinURL}
                        prefetch={false}
                        className="text-gray-500 hover:text-blue-900"
                      >
                        <Linkedin size={24} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
              {/* Assistant Directors Row */}
              {department.assistantDirectors?.map((assistantDirector) => (
                <div
                  key={assistantDirector.fullName}
                  className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-96"
                >
                  <Image
                    src={assistantDirector.image.src}
                    height={540}
                    width={960}
                    placeholder="blur"
                    blurDataURL={assistantDirector.image.blurDataURL}
                    alt={assistantDirector.fullName}
                    className=" object-cover rounded-t-lg"
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
                        className="text-gray-500 hover:text-blue-700"
                      >
                        <Facebook size={24} />
                      </Link>
                      <Link
                        href={assistantDirector.linkedinURL}
                        prefetch={false}
                        className="text-gray-500 hover:text-blue-900"
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
