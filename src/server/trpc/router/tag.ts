import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const tagRouter = router({
   getAll: publicProcedure.query(({ ctx }) => {
      return ctx.prisma.tag.findMany();
   }),
});
