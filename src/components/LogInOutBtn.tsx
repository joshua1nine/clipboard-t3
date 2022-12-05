import { signIn, signOut, useSession } from "next-auth/react";

export const LogInOutBtn: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex items-center space-x-2">
      <button
        className="rounded px-2 py-2 font-semibold text-blue no-underline transition hover:bg-blue hover:text-white"
        onClick={sessionData ? () => signOut() : () => signIn("auth0")}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
