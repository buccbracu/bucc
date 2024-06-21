const getEvaluations = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/evaluations`);
  return res.json();
};

const getEvaluation = async ({ evaluationID }: { evaluationID: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/evaluations/${evaluationID}`
  );
  return res.json();
};

const getDepartmentMembers = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members`);
  return res.json();
};

const getAllMembers = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-members`);
  return res.json();
};

const getMember = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member?id=${id}`);
  return res.json();
};

const getProfileData = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`);
  return res.json();
};

export {
  getAllMembers,
  getDepartmentMembers,
  getEvaluation,
  getEvaluations,
  getMember,
  getProfileData,
};

export default getEvaluations;
