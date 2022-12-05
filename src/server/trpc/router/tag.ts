import { router, publicProcedure } from "../trpc";

export const tagRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tag.findMany();
  }),
});
