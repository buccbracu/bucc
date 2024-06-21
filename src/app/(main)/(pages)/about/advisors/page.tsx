import PageHeader from "@/components/page-header";
import { GlobeIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import coAdvisor2Image from "/public/images/people/advisors/Afia-Mubassira-Islam.jpeg";
import advisorImage from "/public/images/people/advisors/Annajiat-Alim-Rasel.jpeg";
import coAdvisor1Image from "/public/images/people/advisors/Arif-Shakil.jpeg";

export default function Advisors() {
  return (
    <div className="w-full">
      <PageHeader
        title="Meet The Guardians of BUCC"
        description="Advisors play a crucial role in guiding and supporting the clubs. They bring a wealth of industry experience, academic expertise, and valuable connections to help the club members navigate their academic and professional journeys. By providing mentorship, technical guidance, and career advice, the advisors ensure the club's success and the growth of its members."
      />
      <section className="space-y-16 max-w-5xl mx-auto container p-4 dark:text-gray-50">
        <h2 className="text-3xl font-bold mb-4 text-center">Advisor</h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="order-1 md:order-1">
            <div className="relative rounded-lg shadow-lg overflow-hidden">
              <Image
                src={advisorImage}
                alt="Annajiat Alim Rasel"
                className="w-full h-full object-cover"
                width={400}
                height={400}
                placeholder="blur"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold">Annajiat Alim Rasel</h3>
                <p className="text-gray-300">
                  Advisor, BRAC University Computer Club
                </p>
              </div>
            </div>
          </div>
          <div className="order-2 md:order-2">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Annajiat Alim Rasel</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Senior Lecturer, Department of Computer Science and Engineering
              </p>
              <p className="text-gray-700 dark:text-gray-400">
                Annajiat Alim Rasel received M.Sc. degree in Computer Science
                and Engineering in 2019 from BRAC University, Bangladesh. He is
                currently serving as a Sr. Lecturer and Undergraduate
                Coordinator of Department of Computer Science and Engineering
                (CSE) under School of Data and Sciences (SDS) at BRAC
                University. He oversees the BRAC University Computer Club (BUCC)
                and IEEE Computer Society Student Branch Chapter as the faculty
                advisor. Prior to joining as a faculty member of the CSE
                department in 2009, he has served as a Lab Tutor (aka Teaching
                Assistant) in the same department. Before that, he was a
                research intern at Center for Research on Bangla Language
                Processing (CRBLP) lab at BRAC University. He participated in
                ACM ICPC related national and international programming
                competitions as a competitive programmer and as a coach.
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <Link
                  href="https://www.linkedin.com/in/annajiat"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  prefetch={false}
                >
                  <LinkedInLogoIcon className="h-5 w-5" />
                </Link>
                <Link
                  href="https://cse.sds.bracu.ac.bd/faculty_profile/145/mr_annajiat_alim_rasel"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  prefetch={false}
                >
                  <GlobeIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4 text-center">Co-Advisors</h2>
        <div className="space-y-16">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="order-1 md:order-2">
              <div className="relative rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={coAdvisor1Image}
                  alt="Arif Shakil"
                  className="w-full h-full object-cover"
                  width={400}
                  height={400}
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Arif Shakil</h3>
                  <p className="text-gray-300">
                    Co-Advisor, BRAC University Computer Club
                  </p>
                </div>
              </div>
            </div>
            <div className="order-2 md:order-1 space-y-2">
              <h3 className="text-xl font-semibold">Arif Shakil</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Lecturer, Department of Computer Science and Engineering
              </p>
              <p className="text-gray-700 dark:text-gray-400">
                Arif Shakil has joined BRAC University as a Lecturer in the
                Department of Computer Science and Engineering as of May 2018.
                Before this, while he was still a student at BRAC University, he
                worked as a Student Tutor in the CSE Department of BRAC for
                almost 1.5 years(2016-2017 period), and worked as a
                Student&apos;s Mentor in BIL, BRAC University for a semester.
                Arif Shakil is currently pursuing his Masters degree in CSE from
                BRAC University and after completing his bachelors in CSE from
                BRAC University graduating in Fall 2017. Before then, he
                completed his O&apos; Levels from BAF Shaheen English Medium
                School and then finished his A&apos; Levels from British
                Council. Both the levels&apos; curriculum was GCE of Edexcel
                Board.
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <Link
                  href="https://www.linkedin.com/in/arifshakil"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  prefetch={false}
                >
                  <LinkedInLogoIcon className="h-5 w-5" />
                </Link>
                <Link
                  href="https://cse.sds.bracu.ac.bd/faculty_profile/21/arif_shakil"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  prefetch={false}
                >
                  <GlobeIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="order-1 md:order-2">
              <div className="relative rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={coAdvisor2Image}
                  alt="Afia Mubassira Islam"
                  className="w-full h-full object-cover"
                  width={400}
                  height={400}
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">
                    Afia Mubassira Islam
                  </h3>
                  <p className="text-gray-300">
                    Co-Advisor, BRAC University Computer Club
                  </p>
                </div>
              </div>
            </div>
            <div className="order-2 md:order-1 space-y-2">
              <h3 className="text-xl font-semibold">Afia Mubassira Islam</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Lecturer, Department of Computer Science and Engineering
              </p>
              <p className="text-gray-700 dark:text-gray-400">
                Afia Mubassira Islam completed her school and college at
                Viqarunnisa Noon School and College. She finished her B.Sc. and
                M.Sc. from the Department of EEE, University of Dhaka. Her
                interest in semiconductor devices has led her to major in
                Electronics. She has a wide range of research interests
                including Material Science, Two Dimensional Transition Metal
                Dichalcogenides, and renewable technologies. Besides research,
                she enjoys reading books (fiction), watching anime and mostly,
                teaching.
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <Link
                  href="https://www.linkedin.com/in/afia-mubassira-islam"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  prefetch={false}
                >
                  <LinkedInLogoIcon className="h-5 w-5" />
                </Link>
                <Link
                  href="https://cse.sds.bracu.ac.bd/faculty_profile/84/ms_afia_mubassira_islam"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  prefetch={false}
                >
                  <GlobeIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
