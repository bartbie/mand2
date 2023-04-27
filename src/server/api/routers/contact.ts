import { TypeOf, z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const ContactMessageSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  subject: z.string().trim().min(1),
  message: z.string(),
});

export type ContactMessage = z.infer<typeof ContactMessageSchema>;

const CompleteMessageSchema = ContactMessageSchema.and(
  z.object({ answered: z.boolean() })
);

type CompleteMessage = z.infer<typeof CompleteMessageSchema>;

export const contactRouter = createTRPCRouter({
  postMessage: protectedProcedure
    .input(ContactMessageSchema)
    .query(({ ctx, input }) => {
      const message: CompleteMessage = { ...input, answered: false };
      ctx.prisma.message.create({ data: message });
      // TODO: in future, move this task to a CRON job or some similar solution
      // TODO: here be our mail service
      return {};
    }),
});
