import Image from "next/image";
import Link from "next/link";

export default function Component() {
  return (
    <section className="w-full py-4 md:py-8 lg:py-12">
      <div className="container px-4 md:px-6 flex flex-col items-center justify-center text-center space-y-8">
        <div className="max-w-4xl space-y-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 sm:text-5xl md:text-6xl lg:text-7xl">
            BRAC University Computer Club
          </h1>
          <p className="text-lg text-gray-900 dark:text-gray-200 md:text-xl">
            A community for tech enthusiasts from BRAC University, where we
            explore the latest advancements in computer science and technology.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 text-white px-8 text-sm font-medium shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            href="#"
          >
            Join the Club
          </Link>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-md border border-blue-600 text-blue-600 px-8 text-sm font-medium shadow transition-colors hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-blue-600"
            href="#"
          >
            Learn More
          </Link>
        </div>
        <div className="w-full max-w-5xl rounded-xl overflow-hidden">
          <Image
            alt="BRAC University Computer Club Group Photo"
            className="w-full h-auto object-cover"
            height={675}
            src="/images/hero-image.png"
            style={{
              aspectRatio: "1200/675",
              objectFit: "cover",
            }}
            width={1200}
          />
        </div>
      </div>
    </section>
  );
}
