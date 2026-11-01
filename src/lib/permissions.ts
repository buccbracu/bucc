export type UserRole = {
  designation: string;
  buccDepartment: string;
  memberStatus?: string;
};

export const isAlumniMember = (user: UserRole) => {
  return (
    user.memberStatus?.toLowerCase() === "alumni" ||
    user.designation?.toLowerCase() === "alumni" ||
    (user.memberStatus !== undefined && user.memberStatus?.toLowerCase() !== "active")
  );
};

export const isGoverningBody = (user: UserRole) => {
  if (isAlumniMember(user)) return false;
  const gbDesignations = ["President", "Vice President", "Vice-President", "General Secretary", "Treasurer"];
  const desig = (user.designation || "").toLowerCase();
  return gbDesignations.some(d => d.toLowerCase() === desig);
};

export const isRDAdmin = (user: UserRole) => {
  if (isAlumniMember(user)) return false;
  const dept = (user.buccDepartment || (user as any).department || "").toLowerCase();
  const desig = (user.designation || "").toLowerCase();
  return (
    dept === "research and development" &&
    ["director", "assistant director"].includes(desig)
  );
};

export const isHRAdmin = (user: UserRole) => {
  if (isAlumniMember(user)) return false;
  const dept = (user.buccDepartment || (user as any).department || "").toLowerCase();
  const desig = (user.designation || "").toLowerCase();
  return (
    dept === "human resources" &&
    ["director", "assistant director"].includes(desig)
  );
};

export const canManageInquiries = (user: UserRole) => {
  return isGoverningBody(user) || isRDAdmin(user) || isHRAdmin(user);
};

export const canManageProjects = (user: UserRole) => {
  return isGoverningBody(user) || isRDAdmin(user) || isHRAdmin(user);
};

export const isSuperUser = (user: UserRole) => {
  return isGoverningBody(user) || isRDAdmin(user);
};

export const canManageMembers = (user: UserRole) => {
  if (isAlumniMember(user)) return false;
  if (isSuperUser(user)) return true;
  
  return (
    ["Director", "Assistant Director"].includes(user.designation)
  );
};

export const canManageEvents = (user: UserRole) => {
  if (isAlumniMember(user)) return false;
  if (isSuperUser(user)) return true;
  
  return (
    user.buccDepartment === "Event Management" &&
    ["Director", "Assistant Director"].includes(user.designation)
  );
};

export const canManageBlogs = (user: UserRole) => {
  if (isAlumniMember(user)) return false;
  return isGoverningBody(user) || ["Director", "Assistant Director"].includes(user.designation);
};
export const canManageWaitingRoomCoordinators = (user: UserRole) => {
  if (isAlumniMember(user)) return false;
  return isGoverningBody(user) || isRDAdmin(user) || isHRAdmin(user);
};

export const canAccessTaskSubmissions = (user: UserRole) => {
  if (isAlumniMember(user)) return false;
  return isGoverningBody(user) || isRDAdmin(user) || isHRAdmin(user);
};

export const canManageRecruitmentConfig = (user: UserRole) => {
  if (isAlumniMember(user)) return false;
  return isGoverningBody(user) || isRDAdmin(user) || isHRAdmin(user);
};

export const hasGeneralRecruitmentAccess = (user: UserRole, allowSERecruitmentAccess: boolean = false) => {
  if (isAlumniMember(user)) return false;
  const isEB = ["Director", "Assistant Director"].includes(user.designation);
  const isGB = isGoverningBody(user);
  const isSE = user.designation === "Senior Executive" && Boolean(allowSERecruitmentAccess);
  return isGB || isEB || isSE;
};
