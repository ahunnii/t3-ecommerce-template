import { env } from "~/env.mjs";

const useStorePageRender = () => {
  const isTemplate = env.NEXT_PUBLIC_STORE_TYPE === "core";

  return {
    isTemplate,
  };
};

export default useStorePageRender;
