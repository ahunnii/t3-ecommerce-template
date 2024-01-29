import { BlogHomePage as DefaultBlogHomePage } from "~/blueprints/core/blog-home.blueprint";
import { BlogHomePage as CustomBlogHomePage } from "~/blueprints/custom/blog-home.blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const BlogHomePage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultBlogHomePage />;

  return <CustomBlogHomePage />;
};

export default BlogHomePage;
