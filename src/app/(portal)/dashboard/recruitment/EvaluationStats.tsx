import RealTimeInterviewee from "@/components/interviewee/RealTimeInterviewee";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function EvaluationStats({ evaluationsStats }: any) {
  const calculateTotal: any = (status: string) => {
    let totalCount = 0;
    Object.keys(evaluationsStats[status]).forEach((department) => {
      totalCount += evaluationsStats[status][department];
    });
    return totalCount;
  };

  return (
    <div className="mb-6 space-y-4">
      <RealTimeInterviewee />
      {["Accepted", "Pending"].map((status) => (
        <Card
          key={status}
          className={`${status === "Accepted" ? "bg-green-200 dark:bg-green-900/40" : "bg-yellow-200 dark:bg-yellow-700/40"} ${status === "Accepted" ? "text-green-900 dark:text-green-200/80" : "text-yellow-900 dark:text-yellow-200/80"} min-w-72`}
        >
          <CardHeader className="text-xl font-semibold">{status}</CardHeader>
          <CardContent>
            <CardDescription
              className={`${status === "Accepted" ? "text-green-900 dark:text-green-200/80" : "text-yellow-900 dark:text-yellow-200/80"}`}
            >
              {Object.keys(evaluationsStats[status]).map((department) => (
                <div key={department} className="flex justify-between">
                  <span>{department}</span>
                  <span>{evaluationsStats[status][department] ?? 0}</span>
                </div>
              ))}
            </CardDescription>
          </CardContent>
          <CardFooter>
            <div className="flex w-full justify-between">
              <span className="font-semibold">Total {status}:</span>
              <span className="font-semibold">{calculateTotal(status)}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
      <Card className="min-w-72 bg-red-200 text-red-900 dark:bg-red-900/40 dark:text-red-200/80">
        <CardHeader className="text-xl font-semibold">Rejected</CardHeader>
        <CardFooter>
          <div className="flex w-full justify-between">
            <span className="font-semibold">Total Rejected:</span>
            <span className="font-semibold">{calculateTotal("Rejected")}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
