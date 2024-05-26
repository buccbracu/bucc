import { compare } from "bcrypt";
export async function saltAndHashPassword(pass: string, hash: string) {
  return await compare(pass, hash);
}
