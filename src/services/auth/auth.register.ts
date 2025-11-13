//

import { uploadToCloudinary } from "@/lib/cloudinary/uploadToCloudinary";
import prisma from "@/lib/prisma";
import { throwError } from "@/utils/throwError";
import { registerZodSchema_server } from "@/zod-schema/auth/auth.register.zod-schema";
import { Prisma } from "@prisma/client";

export const register = async (
  data: Prisma.UserCreateInput | FormData,
  isGoogle = false,
) => {
  try {
    if (isGoogle) {
      const payload = data as Prisma.UserCreateInput;
      const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (existingUser) return existingUser;

      const newUser = await prisma.user.create({ data: payload });
      if (!newUser) throwError("Failed to create user");
      return newUser;
    } else {
      const formData = data as FormData;

      const file = formData.get("file") as File;
      const values = formData.get("data") || {};

      if (!file) throwError("Avatar is required");

      const safeValues = await registerZodSchema_server.parseAsync(values);

      return prisma.$transaction(async (trx) => {
        const [uploaded] = await uploadToCloudinary(file, {
          folder: "happyTour/users",
          maxWidth: 400,
          maxHeight: 400,
        });

        if (!uploaded.secure_url) throwError("Failed to upload avatar");

        return await trx.user.create({
          data: {
            ...(safeValues as Prisma.UserCreateInput),
            avatar: uploaded.secure_url,
          },
          omit: { password: true },
        });
      });

      //
    }
  } catch (error) {
    throw error;
  }
};
