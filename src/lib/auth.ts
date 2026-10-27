import { singleResetMail } from "@/helpers/mailer";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { twoFactor } from "better-auth/plugins";

export let client: MongoClient;
export let db: any;

if (process.env.NODE_ENV === "production") {
  client = new MongoClient(process.env.MONGODB_URI as string);
  db = client.db(process.env.MONGODB_DB as string);
} else {
  if (!(global as any)._mongoClientForBetterAuth) {
    (global as any)._mongoClientForBetterAuth = new MongoClient(process.env.MONGODB_URI as string);
  }
  client = (global as any)._mongoClientForBetterAuth;
  db = client.db(process.env.MONGODB_DB as string);
}

export const auth = betterAuth({
  appName: "BUCC",
  database: mongodbAdapter(db),
  plugins: [
    twoFactor()
  ],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({user, url, token}, request) => {
       await singleResetMail(user.email, url);
    },
    onPasswordReset: async ({ user }, request) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },

  user: {
    additionalFields: {
      designation: {
        type: "string",
        required: true,
        defaultValue: "General Member",
      },
      buccDepartment: {
        type: "string",
        required: true,
        defaultValue: "Communication and Marketing",
      },
      studentId: {
        type: "string",
        required: true,
      },
      phoneNumber: {
        type: "string",
        required: true,
      },
      bracuDepartment: {
        type: "string",
        required: true,
      },
      memberStatus: {
        type: "string",
        required: true,
        defaultValue: "Active",
      },
      personalEmail: {
        type: "string",
        required: false,
      },
      joinedBracu: {
        type: "string",
        required: false,
      },
      birthDate: {
        type: "date",
        required: false,
      },
      bloodGroup: {
        type: "string",
        required: false,
      },
      gender: {
        type: "string",
        required: false,
      },
      emergencyContact: {
        type: "string",
        required: false,
      },
      joinedBucc: {
        type: "string",
        required: false,
      },
      lastPromotion: {
        type: "string",
        required: false,
      },
      memberSkills: {
        type: "string[]", // Better Auth supports arrays if the adapter does
        required: false,
      },
      memberSocials: {
        type: "string", // Store as JSON string or complex type if supported
        required: false,
      },
      profileSlug: {
        type: "string",
        required: false,
      },
      isPublicProfile: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      currentJob: {
        type: "string",
        required: false,
      },
      cvLink: {
        type: "string",
        required: false,
      },
      showPersonalEmail: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      showPhoneNumber: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      showProjects: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      showBlogs: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      showTestimonials: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      coverImage: {
        type: "string",
        required: false,
      },
      experience: {
        type: "string",
        required: false,
      },
      recentActivity: {
        type: "string",
        required: false,
      },
      showExperience: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      showRecentActivity: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      education: {
        type: "string",
        required: false,
      },
      achievements: {
        type: "string",
        required: false,
      },
      certifications: {
        type: "string",
        required: false,
      },
      showEducation: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      showAchievements: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      showCertifications: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      showGithubStats: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    },
  },
});
