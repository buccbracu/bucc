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
    credentials: "include",
  });

  return res.json();
};
const getPR = async (prId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/press-releases/${prId}`,
  );
  return res.json();
};

const getPRs = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/press-releases`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch PRs");
  return res.json();
}

const deletePR = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/press-releases/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Failed to delete PR");
  return res.json();
}

const getEvents = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}
const getEvent = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`);
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
}
const deleteEvent = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || `Failed to delete event (${res.status})`;
    throw new Error(errorMessage);
  }
  return res.json();
}


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
  getPR,
  getPRs,
  deletePR,
  getEvents,
  getEvent,
  deleteEvent
};

export default getEvaluations;
