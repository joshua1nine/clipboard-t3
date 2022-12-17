import { trpc } from './trpc';

export function useUser(id: string) {
   if (id == undefined || id == null) {
      return 'no session';
   }
   const { data: user } = trpc.auth.getUser.useQuery(id);
   return user;
}
