import { signIn, signOut, useSession } from "next-auth/react";
import type { FC } from "react";
import getProducts from "~/actions/app/get-products";
import ProductList from "~/components/app/product-list";
import Billboard from "~/components/app/ui/billboard";
import StorefrontLayout from "~/layouts/StorefrontLayout";
import type { Product } from "~/types";
import { api } from "~/utils/api";

export const revalidate = 0;

export const getServerSideProps = async () => {
  const products = await getProducts({ isFeatured: true });
  return {
    props: {
      products,
    },
  };
};

interface IProps {
  products: Product[];
}
const HomePage: FC<IProps> = ({ products }) => {
  // const { data: products } = api.products.getAllProducts.useQuery({
  //   isFeatured: true,
  // });
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  return (
    <StorefrontLayout>
      <div className="space-y-10 pb-10">
        <Billboard data={{ id: "000", label: "hero", imageUrl: "/hero.png" }} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Featured Products" items={products} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl text-indigo-500">
          {hello.data ? hello.data.greeting : "Loading tRPC query..."}
        </p>
        <AuthShowcase />
      </div>
    </StorefrontLayout>
  );
};

export default HomePage;

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-indigo-500">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-indigo-500 no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
