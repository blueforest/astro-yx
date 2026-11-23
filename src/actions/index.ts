import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export const server = {
  submitInquiry: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().trim().min(1).max(100),
      email: z.email().max(254),
      country: z.preprocess(
        (value) =>
          value === "" || value === null || value === undefined
            ? undefined
            : value,
        z.string().trim().max(100).optional(),
      ),
      application_details: z.string().trim().min(1).max(300),
    }),
    handler: async (input) => {
      // 后续可接入邮件、CRM 或数据库；当前先在服务端记录并返回成功
      console.info("[inquiry]", {
        name: input.name,
        email: input.email,
        country: input.country ?? null,
        application_details: input.application_details,
        receivedAt: new Date().toISOString(),
      });

      return {
        ok: true as const,
        name: input.name,
      };
    },
  }),
};
