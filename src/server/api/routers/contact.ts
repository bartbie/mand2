import { TypeOf, z } from "zod";
import { ContactMessageSchema,  type ContactMessage as _CMT } from "~/pages/protected/contact";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { sendMessageReceivedMail } from "~/server/mail";

export type ContactMessage = _CMT;

const CompleteMessageSchema = ContactMessageSchema.and(
  z.object({ answered: z.boolean() })
);

type CompleteMessage = z.infer<typeof CompleteMessageSchema>;

export const contactRouter = createTRPCRouter({
  postMessage: protectedProcedure
    .input(ContactMessageSchema)
    .mutation(async ({ ctx, input }) => {
      const message: CompleteMessage = { ...input, answered: false };
      await ctx.prisma.message.create({ data: message });
      // TODO: in future, move this task to a CRON job or some similar solution
      return await sendMessageReceivedMail(input);
    }),
});