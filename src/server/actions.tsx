const getEvaluations = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/evaluations`);
  return res.json();
};

const getEvaluation = async ({ evaluationID }: { evaluationID: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/evaluations/${evaluationID}`,
  );
  return res.json();
};

const getPreRegMembers = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preregmembers`);
  return res.json();
};

const getPreRegMember = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/preregmembers/${id}`,
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

const getMemberData = async (memberId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/member/?id=${memberId}`,
  );
  return res.json();
};

const getBlog = async (blogId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${blogId}`);

  return res.json();
};

const getPublicBlogs = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog?publicView=true`,
  );
  return res.json();
};

const getBlogs = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`);
  return res.json();
};

const deleteBlog = async (blogId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${blogId}`, {
    method: "DELETE",
  });

  return res.json();
};

export {
  deleteBlog,
  getAllMembers,
  getBlog,
  getBlogs,
  getDepartmentMembers,
  getEvaluation,
  getEvaluations,
  getMember,
  getMemberData,
  getPreRegMember,
  getPreRegMembers,
  getProfileData,
  getPublicBlogs,
};

export default getEvaluations;
