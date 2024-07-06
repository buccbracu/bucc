import Hero from "@/components/homepage/Hero";
import AboutUs from "./homepage/AboutUs";
import Activities from "./homepage/Activities";
import CurrentPanel from "./homepage/CurrentPanel";
import Departments from "./homepage/Departments";
import Events from "./homepage/Events";

export default function HomePage() {
  return (
    <div className="w-screen overflow-hidden">
      <Hero />
      <Activities />
      <AboutUs />
      <CurrentPanel />
      <Departments />
      <Events />
    </div>
  );
}
