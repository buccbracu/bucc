"use client";
import { useQuery } from "@tanstack/react-query";
export interface User {
  _id: string;
  name: string;
  studentId: string;
  email: string;
  buccDepartment: string;
  designation: string;
  joinedBucc: string;
  memberStatus: string;
  memberSkills: string[];
  __v: number;
}
export default function Members() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      fetch("http://localhost:3000/api/members").then((res) => res.json()),
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="container mx-auto mt-10">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                BUCC Department
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Designation
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map((user: User) => (
              <tr key={user._id}>
                <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                  {user.name}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                  {user.studentId}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                  {user.buccDepartment}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                  {user.designation}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                  {user.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
