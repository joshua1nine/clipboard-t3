import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

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
               code: 'NOT_FOUND',
               message: `No resource with an id of '${id}'`,
            });
         }
         return resource;
      }),
   update: protectedProcedure
      .input(
         z.object({
            id: z.string(),
            title: z.string().min(1),
            mainImage: z.string().url(),
            type: z.string().min(1),
            tags: z.array(z.object({ id: z.string() })),
         })
      )
      .mutation(async ({ input }) => {
         const resourceTags = input.tags.map((tag) => ({ id: tag.id }));
         const resource = await prisma?.resource.update({
            where: { id: input.id },
            data: {
               title: input.title,
               mainImage: input.mainImage,
               type: input.type,
               tags: {
                  set: resourceTags,
               },
            },
         });
         if (!resource) {
            throw new TRPCError({
               code: 'NOT_FOUND',
               message: `No resource with an id of '${input.id}'`,
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
            tags: z.array(z.object({ id: z.string() })),
         })
      )
      .mutation(async ({ input }) => {
         const resourceTags = input.tags.map((tag) => ({ id: tag.id }));
         const resource = await prisma?.resource.create({
            data: {
               title: input.title,
               mainImage: input.mainImage,
               type: input.type,
               tags: {
                  connect: resourceTags,
               },
            },
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
