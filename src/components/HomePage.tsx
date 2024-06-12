import Departments from "@/components/homepage/Departments";
import Hero from "@/components/homepage/Hero";
import WhyJoinBUCC from "@/components/homepage/WhyJoinBUCC";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <WhyJoinBUCC />
      <Departments />
    </div>
  );
}
