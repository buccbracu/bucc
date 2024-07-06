"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import emblaCarouselAutoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRef } from "react";
import SJAIWorkshop from "/public/images/events/bucc-event1.jpg";
import CareerCrafters from "/public/images/events/bucc-event2.jpg";
import CVandIoT from "/public/images/events/bucc-event3.jpg";
import IntraBUCCValorant from "/public/images/events/bucc-event4.jpg";
import CVBlueprint from "/public/images/events/bucc-event5.jpg";

const events = [
  {
    id: 1,
    title: "BUCC Presents AI Workshop at St. Joseph's College",
    date: "29 November 2023",
    description:
      "The objective of the seminar was to get students to be familiar with Artificial Intelligence, its uses and applications in everyday life through a hands-on project. The workshop was conducted by the BUCC team and was a huge success.",
    image: SJAIWorkshop,
  },
  {
    id: 2,
    title:
      "Career Crafters - Brushing Up Your Professional Image for Remote Work",
    date: "25 February 2024",
    description:
      "With the expertise of Imran Sefat, CEO of Altair Gen Tech & Engineering Lead at Zenith Ventures (BRACU Alumni), BUCC members dived deep into the essentials of building a professional image that stands out in the digital world.",
    image: CareerCrafters,
  },
  {
    id: 3,
    title: "Examples of Research in Computer Vision and loT Sensor",
    date: "01 July 2024",
    description:
      "Dr. Md Atiqur Rahman Ahad is an associate professor at the University of East London, UK, and an expert in computer vision. During this event, he shared his invaluable knowledge and so many insights about the future of computer vision and IoT sensors in research with the BUCC members",
    image: CVandIoT,
  },
  {
    id: 4,
    title: "The CV Blueprint: Crafting Your Professional Path",
    date: "23 June 2024",
    description:
      "This remarkable event, organized by the BRAC University Computer Club and BASIS Students' Forum BRACU Chapter, features industry experts Niaz Ahmed (Founder & CEO, Corporate Ask) and Biplob Ghosh Rahul (Director, BASIS), who shared insider tips to help us to create a standout CV that opens doors to your dream career. ",
    image: CVBlueprint,
  },
  {
    id: 5,
    title: "Intra BUCC Valorant tournament Vol - 1",
    date: "25 February 2024",
    description:
      "The BUCC Valorant tournament was a huge success. The event was organized by the BUCC Gaming Wing and was a great opportunity for the members to showcase their skills and have fun.",
    image: IntraBUCCValorant,
  },
];

export default function Events() {
  const autoplay = useRef(emblaCarouselAutoplay({ delay: 2000 }));

  return (
    <section className="w-full">
      <div className="container px-4 md:px-6">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Events and Activities
        </h2>
        <Carousel
          plugins={[autoplay.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {events.map((event) => (
              <CarouselItem
                key={event.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card>
                    <CardContent className="group relative overflow-hidden rounded-lg p-0">
                      <div className="relative h-80 w-full">
                        <Image
                          src={event.image}
                          alt={event.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="p-4 text-center text-white">
                          <h3 className="text-lg font-bold">{event.title}</h3>
                          <p className="text-sm">{event.date}</p>
                          <p className="mt-2 text-sm font-light">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
