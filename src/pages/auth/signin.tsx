import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import { authOptions } from "~/server/auth";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center  bg-slate-100">
      <section className="flex h-96 w-96 flex-col items-center justify-center space-y-4 rounded bg-slate-400">
        <h1 className="text-2xl ">Sign in </h1>
        {Object.values(providers).map((provider) => (
          <div key={provider.name} className="flex">
            <button
              onClick={() => void signIn(provider.id)}
              className="rounded-md bg-slate-800 px-4 py-2 font-semibold text-white "
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();
  console.log(providers);
  return {
    props: { providers: providers ?? [] },
  };
}
