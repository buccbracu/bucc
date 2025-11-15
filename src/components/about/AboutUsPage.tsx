"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Star, Calendar } from "lucide-react";
import aboutUsImage from "/public/images/homepage/bucc-about-us.jpg";
import ebImage from "/public/images/homepage/Executive Body 2025.jpeg";
import event1 from "/public/images/events/bucc-event1.jpg";
import event2 from "/public/images/events/bucc-event2.jpg";
import event3 from "/public/images/events/bucc-event3.jpg";
import event4 from "/public/images/events/bucc-event4.jpg";
import event5 from "/public/images/events/bucc-event5.jpg";
type Event = {
  id: string;
  title: string;
  description: string;
  startingDate: Date;
  endingDate: Date;
  type: string;
  featuredImage?: string | null;
};

interface AboutUsPageProps {
  upcomingEvents: Event[];
}

export default function AboutUsPage({ upcomingEvents }: AboutUsPageProps) {
  const stats = [
    { label: "Years of Excellence", value: "23+", image: event1, color: "from-blue-600 to-cyan-500" },
    { label: "Active Members", value: "500+", image: event2, color: "from-purple-600 to-pink-500" },
    { label: "Events Organized", value: "200+", image: event3, color: "from-orange-600 to-red-500" },
    { label: "Global Reach", value: "Worldwide", image: event4, color: "from-green-600 to-teal-500" },
  ];

  const galleryImages = [
    { src: event1, alt: "BUCC Workshop", title: "Technical Workshop", category: "Workshop", span: "md:col-span-2 md:row-span-2" },
    { src: event2, alt: "BUCC Competition", title: "Coding Competition", category: "Competition", span: "" },
    { src: event3, alt: "BUCC Networking", title: "Networking Event", category: "Networking", span: "" },
    { src: event4, alt: "BUCC Community", title: "Community Gathering", category: "Community", span: "md:col-span-2" },
    { src: event5, alt: "BUCC Event", title: "Annual Event", category: "Event", span: "" },
    { src: aboutUsImage, alt: "BUCC Team", title: "Team Building", category: "Team", span: "" },
    { src: ebImage, alt: "Executive Body", title: "Executive Body 2025", category: "Team", span: "md:col-span-2" },
    { src: event2, alt: "Tech Talk", title: "Tech Talk Series", category: "Talk", span: "md:col-span-2" },
    { src: event4, alt: "Innovation", title: "Innovation Lab", category: "Workshop", span: "md:col-span-2" },
  ];

  // Use placeholder images if no featured image
  const placeholderImages = [event1, event2, event3, event4, event5];
  
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  
  // If no upcoming events, show placeholder
  const eventsToShow = upcomingEvents.length > 0 ? upcomingEvents : [
    {
      id: "1",
      title: "No Upcoming Events",
      description: "Check back soon for exciting events!",
      startingDate: new Date(),
      endingDate: new Date(),
      type: "Event",
      featuredImage: null,
    } as Event,
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <section className="relative w-full overflow-hidden py-32 md:py-40">
        <div className="absolute inset-0">
          <Image
            src={ebImage}
            alt="BUCC Executive Body"
            fill
            className="object-cover scale-105 animate-[scale_20s_ease-in-out_infinite]"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1f4864]/95 via-[#127cc1]/90 to-[#1f4864]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="mb-6 text-5xl font-bold text-white sm:text-6xl md:text-7xl lg:text-8xl leading-tight">
              About <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">BUCC</span>
            </h1>
            <p className="mb-10 text-xl text-white/90 md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Empowering tech enthusiasts since 2001. From enthusiasts to experts,
              we upgrade ourselves together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/registration"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-10 text-base font-semibold text-[#127cc1] shadow-2xl transition-all hover:scale-105 hover:shadow-white/20"
              >
                Join the Club
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about/executive-body"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-white bg-white/10 backdrop-blur-md px-10 text-base font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:bg-white hover:text-[#127cc1]"
              >
                Meet Our Team
                <Star className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Modern Stats Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-background to-gray-50 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-56 md:h-64">
                  <Image
                    src={stat.image}
                    alt={stat.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-80 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                  <div className="text-4xl md:text-5xl font-black mb-2 drop-shadow-lg">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base font-semibold uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section - Bento Box Style */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1f4864] dark:text-white mb-6 leading-tight">
                  Building Tomorrow&apos;s
                  <span className="block bg-gradient-to-r from-[#1f4864] to-[#127cc1] bg-clip-text text-transparent">
                    Tech Leaders
                  </span>
                </h2>
              </div>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  At <strong className="text-[#127cc1] font-semibold">BUCC</strong> (BRAC University Computer Club), 
                  we believe in promoting creativity and innovation in tech enthusiasts, preparing them to
                  lead the next generation.
                </p>
                <p>
                  Since our establishment in <strong className="text-[#127cc1] font-semibold">2001</strong>, 
                  BUCC has consistently opened vibrant doors to collaborative workshops,
                  bringing together professionals and beginners from the tech industry.
                </p>
                <p>
                  Our success extends beyond the university premises, reaching
                  industries and academia globally. Our members are potential
                  global contributors, destined to lead and inspire.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/about/executive-body"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1f4864] to-[#127cc1] px-8 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  Meet Our Team
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/about/departments"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#127cc1] bg-transparent px-8 text-sm font-semibold text-[#127cc1] transition-all hover:bg-[#127cc1] hover:text-white"
                >
                  Our Departments
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#1f4864] to-[#127cc1] rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    src={aboutUsImage}
                    placeholder="blur"
                    width={700}
                    height={500}
                    alt="BUCC Community"
                    className="w-full rounded-3xl object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    quality={80}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#1f4864]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-2xl font-bold text-white drop-shadow-lg">
                      A united and vibrant community upgrading itself
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Showcase - Masonry Grid */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-background py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1f4864] dark:text-white mb-4">
              Moments That Matter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Capturing the energy, passion, and innovation from our events and workshops
            </p>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-4 auto-rows-[200px]">
            {galleryImages.map((img, index) => (
              <Link
                key={index}
                href="/gallery"
                className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${img.span}`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/30">
                      {img.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-1">{img.title}</h3>
                    <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View in gallery →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/gallery"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1f4864] to-[#127cc1] px-10 text-base font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              Explore Full Gallery
              <ExternalLink className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Events Showcase - Card Carousel Style */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1f4864] dark:text-white mb-4">
              What&apos;s Coming Next
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us in our upcoming workshops, competitions, and tech talks
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {eventsToShow.map((event, index) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-80">
                  <Image
                    src={event.featuredImage || placeholderImages[index % placeholderImages.length]}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f4864]/95 via-[#1f4864]/60 to-transparent" />
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#127cc1]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/30">
                      {event.type}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#127cc1] px-3 py-1 text-xs font-bold text-white">
                      <Calendar className="h-3 w-3" />
                      {formatDate(event.startingDate)}
                    </span>
                  </div>
                  <h3 className="mb-3 text-2xl md:text-3xl font-bold text-white leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  {upcomingEvents.length > 0 && (
                    <div className="flex items-center gap-2 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/events"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1f4864] to-[#127cc1] px-10 text-base font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              View All Events
              <ExternalLink className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values - Modern Cards */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-background py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1f4864] dark:text-white mb-4">
              What Drives Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our mission, vision, and values guide everything we do
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                id: "mission",
                title: "Our Mission",
                description:
                  "To provide BRAC University students a platform to engage in Computer Science and Technology programs regardless of their department, fostering a community that grows together.",
                image: event1,
                gradient: "from-blue-600 to-cyan-500",
              },
              {
                id: "vision",
                title: "Our Vision",
                description:
                  "To innovate, impact, and inspire the next generation of tech leaders through visionary, imaginative, and efficient collaboration.",
                image: event2,
                gradient: "from-purple-600 to-pink-500",
              },
              {
                id: "values",
                title: "Our Values",
                description:
                  "Excellence, Innovation, Collaboration, and Continuous Learning. We believe in promoting creativity and preparing students to lead the next generation.",
                image: event3,
                gradient: "from-orange-600 to-red-500",
              },
            ].map((value) => (
              <div
                key={value.id}
                className="group relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3"
              >
                <div className="relative h-96">
                  <Image
                    src={value.image}
                    alt={value.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-70 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="mb-4 text-3xl font-bold text-white">
                    {value.title}
                  </h3>
                  <p className="text-base text-white/90 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Modern Design */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1f4864] dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Key milestones that shaped BUCC&apos;s legacy
            </p>
          </div>
          <div className="mx-auto max-w-5xl">
            <div className="space-y-12">
              {[
                {
                  id: "2001",
                  year: "2001",
                  title: "Foundation",
                  description:
                    "BUCC was established as the first computer club at BRAC University, laying the foundation for a vibrant tech community.",
                },
                {
                  id: "2005-2010",
                  year: "2005-2010",
                  title: "Growth & Expansion",
                  description:
                    "Expanded our activities with regular workshops, programming contests, and tech talks, growing our member base significantly.",
                },
                {
                  id: "2015",
                  year: "2015",
                  title: "National Recognition",
                  description:
                    "BUCC members started winning national programming competitions, putting BRAC University on the tech map of Bangladesh.",
                },
                {
                  id: "2020",
                  year: "2020",
                  title: "Digital Transformation",
                  description:
                    "Adapted to virtual events during the pandemic, reaching more students and organizing successful online workshops.",
                },
                {
                  id: "2024-present",
                  year: "2024-Present",
                  title: "Innovation & Impact",
                  description:
                    "Continuing to innovate with AI/ML workshops, industry partnerships, and creating opportunities for students globally.",
                },
              ].map((milestone, index) => (
                <div key={milestone.id} className="flex gap-8 group">
                  <div className="flex flex-col items-center">
                    <div className="relative h-16 w-16 rounded-2xl shadow-lg ring-4 ring-white dark:ring-gray-900 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 bg-gradient-to-br from-[#1f4864] to-[#127cc1] flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{index + 1}</span>
                    </div>
                    {index < 4 && (
                      <div className="mt-4 h-full w-1 bg-gradient-to-b from-[#127cc1] via-[#127cc1]/50 to-transparent rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 pb-12">
                    <div className="group-hover:scale-[1.02] transition-transform duration-300">
                      <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
                        <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-[#1f4864] to-[#127cc1] px-4 py-1.5 text-sm font-bold text-white shadow-md">
                          {milestone.year}
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-[#1f4864] dark:text-white">
                          {milestone.title}
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Premium Design */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={ebImage}
            alt="BUCC Community"
            fill
            className="object-cover scale-105"
            loading="lazy"
            quality={80}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1f4864]/95 via-[#127cc1]/90 to-[#1f4864]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(18,124,193,0.3),transparent_70%)]" />
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl md:text-6xl font-bold text-white leading-tight">
              Ready to <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Upgrade</span> Yourself?
            </h2>
            <p className="mb-10 text-xl text-white/90 md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Become part of a vibrant community of tech enthusiasts and start your
              journey to excellence. Whether you&apos;re a beginner or an expert, there&apos;s
              a place for you at BUCC.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/registration"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-10 text-base font-semibold text-[#127cc1] shadow-2xl transition-all hover:scale-105 hover:shadow-white/20"
              >
                Register Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-white bg-white/10 backdrop-blur-md px-10 text-base font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:bg-white hover:text-[#127cc1]"
              >
                Contact Us
              </Link>
              <Link
                href="/events"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-white/50 bg-white/5 backdrop-blur-md px-10 text-base font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:bg-white/10 hover:border-white"
              >
                View Events
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>
    </div>
  );
}
