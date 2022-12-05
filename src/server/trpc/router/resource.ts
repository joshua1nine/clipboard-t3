import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const resourceRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.resource.findMany({
      include: {
        tags: true,
      },
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const { id }: any = input;
      const resource = await ctx.prisma.resource.findFirst({
        where: { id },
        include: {
          reservations: true,
          tags: true,
        },
      });
      if (!resource) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No resource with an id of '${id}'`,
        });
      }
      return resource;
    }),
  add: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        mainImage: z.string().url(),
        type: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const resource = await prisma?.resource.create({
        data: input,
      });
      return resource;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma?.resource.delete({
        where: { id: input.id },
      });
      return input.id;
    }),
});
