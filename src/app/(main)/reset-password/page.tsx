// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams } from "next/navigation";
// import { Suspense, useEffect, useState } from "react";
// import { toast } from "sonner";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { LoadingButton } from "@/components/ui/loading-button";
// import PasswordField from "@/components/ui/password-field";
// import SpinnerComponent from "@/components/SpinnerComponent";
// import { resetPasswordSchema, ResetPasswordSchema } from "@/schemas/resetPasswordSchema";

// function ResetPassword() {
//   const token = useSearchParams().get("token");

//   const [loading, setLoading] = useState(false);
//   const [isStrongPassword, setIsStrongPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm<ResetPasswordSchema>({
//     resolver: zodResolver(resetPasswordSchema),
//   });

//   const newPassword = watch("newPassword");
//   const confirmPassword = watch("confirmPassword");

//   useEffect(() => {
//     if (newPassword && confirmPassword) {
//       setIsStrongPassword(newPassword === confirmPassword);
//     }
//   }, [newPassword, confirmPassword]);

//   async function handleResetSubmit(data: ResetPasswordSchema) {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/users/resetPassword`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             token,
//             newPassword: data.newPassword,
//           }),
//         }
//       );
//       if (response.ok) {
//         toast.success("Password changed successfully");
//       } else {
//         toast.error("Failed to change password");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleEmailSubmit(data: { email: string }) {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/users/resetPassword`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email: data.email }),
//         }
//       );
//       if (response.ok) {
//         toast.success("Reset link sent to your email");
//       } else {
//         toast.error("Failed to send reset link");
//       }
//     } catch (error) {
//       toast.error("An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (token) {
//     return (
//       <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
//         <Card className="w-96">
//           <CardHeader className="text-2xl font-semibold">Reset Password</CardHeader>
//           <CardContent className="space-y-2">
//             <form onSubmit={handleSubmit(handleResetSubmit)}>
//               <div>
//                 <Label className="mb-2" htmlFor="newPassword">
//                   New Password
//                 </Label>
//                 <PasswordField
//                   register={register}
//                   errors={errors}
//                   name="newPassword"
//                   placeholder="New password"
//                 />
//               </div>
//               <div>
//                 <Label className="mb-2" htmlFor="confirmPassword">
//                   Confirm Password
//                 </Label>
//                 <PasswordField
//                   register={register}
//                   errors={errors}
//                   name="confirmPassword"
//                   placeholder="Confirm password"
//                 />
//               </div>
//               <LoadingButton
//                 type="submit"
//                 disabled={!isStrongPassword || isSubmitting}
//                 loading={isSubmitting}
//               >
//                 Change Password
//               </LoadingButton>
//             </form>
//           </CardContent>
//           <DialogFooter />
//         </Card>
//       </main>
//     );
//   }

//   return (
//     <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
//       <Card className="w-96">
//         <CardHeader className="text-2xl font-semibold">Reset Password</CardHeader>
//         <CardContent className="space-y-2">
//           <form onSubmit={handleSubmit(handleEmailSubmit)}>
//             <Label htmlFor="email">G-Suite Email</Label>
//             <Input
//               type="email"
//               pattern=".+@g.bracu.ac.bd"
//               id="email"
//               error={errors.email?.message}
//               placeholder="Email address"
//               {...register("email")}
//               required
//             />
//             <LoadingButton type="submit" loading={loading} className="mt-4">
//               Send Reset Link
//             </LoadingButton>
//           </form>
//         </CardContent>
//       </Card>
//     </main>
//   );
// }

// export default function ResetPasswordPage() {
//   return (
//     <Suspense fallback={<SpinnerComponent />}>
//       <ResetPassword />
//     </Suspense>
//   );
// }

export default function resetPassword() {
  return <div>Reset Password</div>;
}
