import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { getCloudflareEnv } from "../lib/cloudflare-env";
import { insertInquiry } from "../lib/inquiries";

function errorDetail(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return String(error);
}

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
      try {
        const env = await getCloudflareEnv();
        if (!env.DB) {
          throw new Error("D1 binding DB is missing on this Worker");
        }
        await insertInquiry(env.DB, input);
      } catch (error) {
        console.error("[inquiry] failed to save", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to save inquiry (${errorDetail(error)}). Please try again later, or contact us by email.`,
        });
      }

      return {
        ok: true as const,
        name: input.name,
      };
    },
  }),
};
