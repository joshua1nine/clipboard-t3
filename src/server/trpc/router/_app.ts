import { router } from '../trpc';
import { authRouter } from './auth';
import { exampleRouter } from './example';
import { resourceRouter } from './resource';
import { reservationRouter } from './reservations';
import { tagRouter } from './tag';
import { cloudinaryRouter } from './cloudinary';

export const appRouter = router({
   example: exampleRouter,
   auth: authRouter,
   resource: resourceRouter,
   tag: tagRouter,
   reservation: reservationRouter,
   cloudinary: cloudinaryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
