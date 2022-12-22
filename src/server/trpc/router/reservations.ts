import { TRPCError } from '@trpc/server';
import { nodeMail } from 'src/utils/nodemailer';
import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

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
               code: 'NOT_FOUND',
               message: `No reservation with an id of '${id}'`,
            });
         }
         return resource;
      }),
   add: protectedProcedure
      .input(
         z.object({
            startDate: z.string(),
            endDate: z.string(),
            userId: z.string(),
            resourceId: z.string(),
            userEmail: z.string().email(),
         })
      )
      .mutation(async ({ input }) => {
         const reservation = await prisma?.reservation.create({
            data: {
               userId: input.userId,
               resourceId: input.resourceId,
               startDate: input.startDate,
               endDate: input.endDate,
            },
         });

         const info = await nodeMail.sendMail({
            from: '"Clipboard" <info@spsclipboard.com>',
            to: input.userEmail,
            subject: 'Reservation Confirmation',
            html: '<strong>Thank you for your reservation!</strong>',
            headers: { 'x-myheader': 'test header' },
         });
         console.log(info);
         return reservation;
      }),
});
