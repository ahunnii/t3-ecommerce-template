import { MailIcon } from "lucide-react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import AuthLayout from "~/components/layouts/AuthLayout";
import { Button } from "~/components/ui/button";
import { authOptions } from "~/server/auth";

export default function SignIn({
  providers,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AuthLayout>
      <div className=" my-auto flex h-full w-full items-center gap-5">
        <div className="justify-left flex w-4/12">
          {" "}
          <div className="w-96 rounded bg-white p-4 ">
            {error && (
              <p className="text-center font-semibold text-red-700">{error}</p>
            )}
            <h1 className="mb-4 text-center text-2xl">Sign In to Store</h1>
            <div className="flex flex-col gap-y-2">
              {Object.values(providers).map((provider) => {
                if (provider.name !== "Auth0") {
                  return (
                    <div key={provider.name}>
                      <Button
                        onClick={() => void signIn(provider.id)}
                        variant={"outline"}
                        className="flex w-full justify-center gap-x-5 rounded-full"
                      >
                        {" "}
                        <Image
                          src={`/img/${provider.id}.svg`}
                          width={25}
                          height={25}
                          alt={provider.name}
                        />
                        Sign in with {provider.name}
                      </Button>
                    </div>
                  );
                }
              })}

              <div className="my-3 flex items-center px-3">
                <hr className="w-full border-slate-600" />
                <span className="mx-3 text-slate-500">or</span>
                <hr className="w-full border-slate-600" />
              </div>

              <div>
                <Button
                  onClick={() => void signIn("auth0")}
                  variant={"outline"}
                  className="flex w-full gap-x-5 rounded-full"
                >
                  <MailIcon className="mr-2 text-gray-400" size={25} />
                  Sign in with email using Auth0000
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex w-8/12 justify-end  ">
          <Image
            src="/img/web_shopping.svg"
            alt="under development"
            width={500}
            height={500}
          />
        </div>
      </div>
    </AuthLayout>
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

  const errorMessage: Record<string, string> = {
    OAuthCallback: "Oops, something went wrong there. Please try again later.",
    OAuthAccountNotLinked:
      "The email associated with your selected provider is already in use. Please try another provider or contact us.",
  };

  const error = context.query.error
    ? errorMessage[(context.query.error as string) ?? "OAuthCallback"]
    : null;

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [], error: error },
  };
}
