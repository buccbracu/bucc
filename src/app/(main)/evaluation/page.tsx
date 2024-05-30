import EvaluationComponent from "@/components/evaluation/EvaluationComponent";

export default function EvaluationForm() {
  return (
    <div>
      <h1 className="text-3xl font-bold dark:bg-[#202223] dark:text-[#D5D7EE] py-8 flex justify-center">
        BUCC Written Evaluation Form
      </h1>
      <EvaluationComponent />
    </div>
  );
}
