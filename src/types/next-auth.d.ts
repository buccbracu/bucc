import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string;
      id: int;
      email: string;
      image: string;
      designation: string;
      buccDepartment: string;
    };
  }
}
