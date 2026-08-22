import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { UserRole } from "./generated/prisma/enums";
import { hashedPassword, comparePassword } from "@/lib/bcrypt";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  account: {
    accountLinking: {
      trustedProviders: ["google", "github"],
      requireLocalEmailVerified: false,
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
    requireEmailVerification: false,
    password: {
      hash: hashedPassword,
      verify: comparePassword,
    },
  },
  session: {
    expiresIn: 24 * 60 * 60,
  },

  plugins: [
    admin({
      defaultRole: UserRole.CANDIDATE,
      adminRoles: [UserRole.COMPANY_ADMIN],
    }),
    nextCookies(),
  ],
});
