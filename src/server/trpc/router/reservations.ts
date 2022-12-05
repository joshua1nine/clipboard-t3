import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const reservationRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.reservation.findMany({
      include: {
        user: true,
        resource: true,
      },
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const { id }: any = input;
      const resource = await ctx.prisma.resource.findFirst({
        where: { id },
      });
      if (!resource) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No reservation with an id of '${id}'`,
        });
      }
      return resource;
    }),
});
