import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

import StorefrontLayout from "~/components/layouts/storefront-layout";
import { Button } from "~/components/ui/button";
import { useConfig } from "~/providers/style-config-provider";
import { authOptions } from "~/server/auth";
import { cn } from "~/utils/styles";

export default function SignIn({
  providers,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const config = useConfig();

  return (
    <StorefrontLayout
      {...config.layout}
      bodyStyle="items-center justify-center flex"
    >
      <div className=" my-auto flex h-full w-full items-center gap-5 max-md:flex-col-reverse">
        <div className="justify-left flex lg:w-4/12">
          <div
            className={cn(
              "w-96 rounded bg-white p-4 ",
              config.signIn.background
            )}
          >
            {error && (
              <p className="text-center font-semibold text-red-700">{error}</p>
            )}

            <h1
              className={cn("mb-4 text-center text-2xl", config.signIn.title)}
            >
              Sign In to {config.brand.name}
            </h1>

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
              {/* 
                <div className="my-3 flex items-center px-3">
                  <hr className="w-full border-slate-600" />
                  <span className="mx-3 text-slate-500">or</span>
                  <hr className="w-full border-slate-600" />
                </div> */}

              {/* <div>
                  <Button
                    onClick={() => void signIn("auth0")}
                    variant={"outline"}
                    className="flex w-full gap-x-5 rounded-full"
                  >
                    <MailIcon className="mr-2 text-gray-400" size={25} />
                    Sign in with email using Auth0
                  </Button>
                </div> */}
            </div>
          </div>
        </div>
        <div className=" flex justify-end px-4  lg:w-8/12">
          <Image
            src="/img/web_shopping.svg"
            alt="under development"
            width={500}
            height={500}
          />
        </div>
      </div>
    </StorefrontLayout>
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

  // const isLoggedIn = context.req.cookies.login;

  // if (!isLoggedIn) {
  //   return { redirect: { destination: "/password-protect" } };
  // }
  // const isPathPasswordProtect =
  //   req.nextUrl.pathname.startsWith("/password-protect");
  // if (isPasswordEnabled && !isLoggedIn && !isPathPasswordProtect) {
  //   return NextResponse.redirect(new URL("/password-protect", req.url));
  // }
  // return NextResponse.next();

  const providers = await getProviders();

  console.log(providers);

  const errorMessage: Record<string, string> = {
    "account-not-found":
      "Oops, that account doesn't exist. You can sign up for a new account below. ",
    OAuthCallback: "Oops, something went wrong there. Please try again later.",
    OAuthAccountNotLinked:
      "The email associated with your selected provider is already in use. Please try another provider or contact us.",
  };

  const error = context.query.error
    ? errorMessage[(context.query.error as string) ?? "OAuthCallback"]
    : null;

  console.log(error);
  return {
    props: {
      providers: providers ?? [],
      error: typeof error === "string" ? error : "",
    },
  };
}
