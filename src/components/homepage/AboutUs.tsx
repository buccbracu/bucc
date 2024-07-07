import Image from "next/image";
import aboutUsImage from "/public/images/homepage/bucc-about-us.jpg";

export default function AboutUs() {
  return (
    <section className="flex w-full items-center justify-center px-10 py-12 md:px-4 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 sm:px-10 md:grid-cols-2 md:gap-16">
          <div className="space-y-4">
            <div className="inline-block rounded-lg py-1 text-base">
              Wonder what BUCC is all about?
            </div>
            <h2 className="">Upgrade Yourself: From Enthusiasts to Experts</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-normal text-muted-foreground">
                  At BUCC (BRAC University Computer Club), we believe in
                  promoting creativity and innovation in tech enthusiasts,
                  preparing them to lead the next generation. Our mission is to
                  offer BRAC University students a platform to engage in
                  Computer Science and Technology programs regardless of their
                  department. This community not only grows together but also
                  provides a promising platform for both current and future
                  contributors.
                </p>
                <p className="text-sm font-normal text-muted-foreground">
                  Since our establishment in 2005, BUCC has consistently opened
                  vibrant doors to collaborative workshops. These workshops
                  bring together professionals and beginners from the tech
                  industry, allowing them to cooperate and make the most of
                  dynamic programs. We nurture students with broader concepts of
                  today&apos;s technology-driven world.
                </p>
                <p className="text-sm font-normal text-muted-foreground">
                  BUCC&apos;s success extends beyond the university premises,
                  reaching industries and academia globally. Our members are
                  potential global contributors, destined to lead and inspire
                  the next generation. We strive to bring impactful changes
                  within and beyond our community through visionary,
                  imaginative, and efficient collaboration. Moving forward with
                  a vision to innovate, impact and inspire as our motto says{" "}
                  <b>Upgrade Yourself!</b>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <div className="relative w-full max-w-[550px] overflow-hidden rounded-xl sm:h-[500px] md:h-[400px]">
              <Image
                src={aboutUsImage}
                placeholder="blur"
                width="550"
                height="310"
                alt="BUCC"
                className="h-full w-full rounded-xl object-cover object-center"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-gray-900/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <div className="space-y-4 rounded-xl text-white">
                  <p className="md:3xl text-2xl">
                    A united and vibrant community with the goal of upgrading
                    itself.
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
