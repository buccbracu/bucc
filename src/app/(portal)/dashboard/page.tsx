import DigitalIdCard from "@/components/portal/DigitalIdCard";
import Heading from "@/components/portal/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
export default function Dashboard() {
  return (
    <>
      <Heading
        headingText="Dashboard"
        subHeadingText="This is a scrollable dashboard. Scroll down to see more content..."
      />

      <section className="mx-auto">
        <DigitalIdCard />
      </section>

      <section className="mx-auto">
        <div className="mb-6 grid h-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-yellow-100">
            <CardHeader className="text-lg font-bold text-yellow-900">
              Notice Board
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-yellow-900/70">
                There are no notices at the moment.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-blue-100">
            <CardHeader className="text-lg font-bold text-blue-900">
              Upcoming Events
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-blue-900/70">
                There are no upcoming events at the moment.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
