import Hero from "@/components/homepage/Hero";
import WhyJoinBUCC from "@/components/homepage/WhyJoinBUCC";
import Departments from "./homepage/Departments";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Departments />
      <WhyJoinBUCC />
    </div>
  );
}
