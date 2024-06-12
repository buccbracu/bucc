import EvaluationsTable from "@/components/evaluations-table";
import Heading from "@/components/portal/heading";
import Filter from "./filter";

export default async function Evaluations() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Heading headingText="Evaluations" subHeadingText="All evaluations" />
      <Filter />
      <EvaluationsTable />
    </div>
  );
}
