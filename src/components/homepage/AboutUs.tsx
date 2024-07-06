import Image from "next/image";
import aboutUsImage from "/public/images/homepage/bucc-about-us.jpg";

export default function AboutUs() {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 sm:px-10 md:grid-cols-2 md:gap-16">
          <div className="space-y-4">
            <div className="inline-block rounded-lg py-1 text-base">
              About Us
            </div>
            <h2 className="">
              Empowering students to explore their passions in technology.
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  The BUCC aims to provide a dynamic platform for BRAC
                  University students to engage in computer science and
                  technology-related activities, fostering a vibrant community
                  of innovators and problem-solvers.
                </p>
                <p className="text-sm text-muted-foreground">
                  Established in 2010, the BUCC has a rich history of organizing
                  workshops, competitions, and collaborative projects that have
                  empowered students to explore their passions in the field of
                  technology. Over the years, the club has become a hub for
                  student-led initiatives and has played a crucial role in
                  shaping the academic and extracurricular experiences of BRAC
                  University&apos;s computer science community.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <div className="relative overflow-hidden rounded-xl sm:h-[500px] md:h-[400px]">
              <Image
                src={aboutUsImage}
                placeholder="blur"
                width="550"
                height="310"
                alt="BUCC"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <div className="space-y-4 rounded-xl text-white">
                  <h3 className="text-2xl font-bold">
                    BRAC University Computer Club
                  </h3>
                  <p className="text-sm">
                    Most vibrant club of BRAC University!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
