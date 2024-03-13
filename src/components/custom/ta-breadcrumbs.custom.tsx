import type { TCrumbPath } from "../common/breadcrumb-bar/breadcrumb-path";
import Breadcrumbs from "../common/breadcrumb-bar/breadcrumbs";

export const TaBreadCrumbs = ({ pathway }: { pathway: TCrumbPath[] }) => {
  return (
    <Breadcrumbs
      pathway={pathway}
      className="pt-0"
      linkClassName="text-purple-500 hover:text-purple-700 after:bg-purple-700"
      activeClassName="text-purple-900 after:bg-purple-700 after:w-full"
    />
  );
};
