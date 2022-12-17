import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const authRouter = router({
   getSession: publicProcedure.query(({ ctx }) => {
      return ctx.session;
   }),
   getUser: publicProcedure.input(z.string()).query(({ ctx, input }) => {
      const user = ctx.prisma.user.findFirst({
         where: { id: input },
      });
      return user;
   }),
   getSecretMessage: protectedProcedure.query(() => {
      return 'you can now see this secret message!';
   }),
   getAnotherMessage: protectedProcedure.query(() => {
      return 'Oh Hi!';
   }),
});
