import { BlogPostPage as DefaultBlogPostPage } from "~/blueprints/core/blog-post.blueprint";
import { BlogPostPage as CustomBlogPostPage } from "~/blueprints/custom/blog-post.blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const BlogPostPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultBlogPostPage />;

  return <CustomBlogPostPage />;
};

export default BlogPostPage;
