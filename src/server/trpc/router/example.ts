import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';
/* import { v2 as cloudinary } from 'cloudinary'; */

// Return "https" URLs by setting secure: true
/* cloudinary.config({ */
/*    cloud_name: 'bearedweb', */
/*    api_key: '141286935378877', */
/*    api_secret: '1YVT4PluNep2fOmi0e2365vHhh4', */
/*    secure: true, */
/* }); */

export const exampleRouter = router({
   hello: publicProcedure
      .input(z.object({ text: z.string().nullish() }).nullish())
      .query(({ input }) => {
         return {
            greeting: `Hello ${input?.text ?? 'world'}`,
         };
      }),
   cloud: publicProcedure
      .input(z.object({ text: z.string().nullish() }).nullish())
      .query(({ input, ctx }) => {
         const name = input?.text as string;
         const result = ctx.cloudinary.api.resource(name);
         return result;
      }),
});
