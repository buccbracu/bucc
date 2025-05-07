import Fuse from "fuse.js";
import executiveBodyMembers from "@/constants/all-executive-body/executive-body-2025/data";

const fuse = new Fuse(executiveBodyMembers, {
  keys: ["fullName", "nickName", "department"],
  threshold: 0.3,
});

export function searchExecutiveBody(query: string) {
  return fuse.search(query).map((result) => result.item);
}
