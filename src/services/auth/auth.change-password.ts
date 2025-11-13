"use server";

import { getUserServer } from "@/helper/getUserServer";
import _response from "@/helper/response";
import { AppError } from "@/lib/errors/AppError";
import { logError } from "@/lib/errors/logger";
import prisma from "@/lib/prisma";
import { bcrypt } from "@/utils/bcrypt";
import { statusCode } from "@/utils/status-code";
import {
  ChangePasswordZodSchema_server,
  iChangePasswordZodSchema_server,
} from "@/zod-schema/auth/auth.password.zod-schema";

export const changePassword = async (data: iChangePasswordZodSchema_server) => {
  try {
    const { oldPassword, newPassword } =
      await ChangePasswordZodSchema_server.parseAsync(data);

    const id = await getUserServer("id");

    if (!id)
      throw new AppError("Unauthorized user or token not found", {
        statusCode: statusCode.UNAUTHORIZED,
      });

    const user = await prisma.user.findUniqueOrThrow({ where: { id } });

    const isValidPass = await bcrypt.compare(oldPassword, user.password || "");
    if (!isValidPass) throw new AppError("Invalid old password");

    const hashedNewPass = await bcrypt.buildHash(newPassword);

    await prisma.user.update({
      where: { id },
      data: { password: hashedNewPass },
    });

    return _response({
      message: "Password updated successfully!",
    });
  } catch (error) {
    logError(error);
    throw error;
  }
};
