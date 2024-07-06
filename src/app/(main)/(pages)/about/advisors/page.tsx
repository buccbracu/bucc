import PageHeader from "@/components/page-header";
import advisorsData, { coAdvisorsData } from "@/constants/advisors";
import { GlobeIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

export default function Advisors() {
  return (
    <div className="w-full">
      <PageHeader
        title="Meet The Guardians of BUCC"
        description="Advisors play a crucial role in guiding and supporting the clubs. They bring a wealth of industry experience, academic expertise, and valuable connections to help the club members navigate their academic and professional journeys. By providing mentorship, technical guidance, and career advice, the advisors ensure the club's success and the growth of its members."
      />
      <section className="container mx-auto max-w-5xl space-y-16 p-4 dark:text-gray-50">
        <div>
          <h2 className="m-8 text-center text-3xl font-bold">Advisor</h2>
          {advisorsData.map((advisor, index) => (
            <div key={index} className="grid items-start gap-8 md:grid-cols-2">
              <div className="order-1 md:order-1">
                <div className="relative overflow-hidden rounded-lg shadow-lg">
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
                    <p className="text-gray-300">
                      {advisor.designation}, BRAC University Computer Club
                    </p>
                  </div>
                </div>
              </div>
              <div className="order-2 md:order-2">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{advisor.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {advisor.bracu_designation}, Department of Computer Science
                    and Engineering
                  </p>
                  <p className="text-gray-700 dark:text-gray-400">
                    {advisor.bio}
                  </p>
                  <div className="mt-3 flex items-center space-x-4">
                    <Link
                      href={advisor.linkedin}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      prefetch={false}
                    >
                      <LinkedInLogoIcon className="h-5 w-5" />
                    </Link>
                    <Link
                      href={advisor.website}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      prefetch={false}
                    >
                      <GlobeIcon className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="m-8 text-center text-3xl font-bold">Co-Advisors</h2>
          {coAdvisorsData.map((advisor, index) => (
            <div
              key={index}
              className="mb-10 grid items-start gap-8 md:grid-cols-2"
            >
              <div className="order-1 md:order-2">
                <div className="relative overflow-hidden rounded-lg shadow-lg">
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
                    <p className="text-gray-300">
                      {advisor.designation}, BRAC University Computer Club
                    </p>
                  </div>
                </div>
              </div>
              <div className="order-2 space-y-2 md:order-1">
                <h3 className="text-xl font-semibold">{advisor.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {advisor.bracu_designation}, Department of Computer Science
                  and Engineering
                </p>
                <p className="text-gray-700 dark:text-gray-400">
                  {advisor.bio}
                </p>
                <div className="mt-3 flex items-center space-x-4">
                  <Link
                    href={advisor.linkedin}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    prefetch={false}
                  >
                    <LinkedInLogoIcon className="h-5 w-5" />
                  </Link>
                  <Link
                    href={advisor.website}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    prefetch={false}
                  >
                    <GlobeIcon className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
