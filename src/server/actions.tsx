const getEvaluations = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/evaluations`);
  return res.json();
};
export default getEvaluations;

const getEvaluation = async ({ evaluationID }: { evaluationID: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/evaluations/${evaluationID}`
  );
  return res.json();
};

export { getEvaluation };
