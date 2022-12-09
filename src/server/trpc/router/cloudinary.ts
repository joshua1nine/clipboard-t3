import { z } from 'zod';

import { router, publicProcedure } from '../trpc';

export const cloudinaryRouter = router({
   getById: publicProcedure
      .input(z.object({ text: z.string().nullish() }).nullish())
      .query(({ input, ctx }) => {
         const name = input?.text as string;
         const result = ctx.cloudinary.api.resource(name);
         return result;
      }),
   deleteImage: publicProcedure
      .input(z.object({ publicId: z.string(), resource_type: z.string() }))
      .mutation(async ({ input, ctx }) => {
         const publicId = input?.publicId as string;
         const resource_type = input?.resource_type as string;
         try {
            const result = await ctx.cloudinary.uploader.destroy(publicId, {
               resource_type: resource_type,
            });
            return result;
         } catch (error) {
            console.log(error);
            return { result: 'Image failed to be deleted.' };
         }
      }),
});
