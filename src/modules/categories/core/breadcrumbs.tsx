import Link from "next/link";

import { useConfig } from "~/providers/style-config-provider";
import { cn } from "~/utils/styles";
import { BreadCrumbPath, type CrumbPath } from "./breadcrumb-path";

const Breadcrumbs = ({ pathway }: { pathway: CrumbPath[] }) => {
  const config = useConfig();

  return (
    <nav className="mb-4 flex pb-5 pt-16 " aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-1">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className={cn(
              "inline-flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-black",
              config.breadCrumbs.primary
            )}
          >
            <HomeIcon /> Home
          </Link>
        </li>

        {pathway.map((path, idx) => (
          <BreadCrumbPath name={path.name} link={path?.link} key={idx} />
        ))}
      </ol>
    </nav>
  );
};

const HomeIcon = () => (
  <svg
    className="mr-2.5 h-5 w-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
  </svg>
);

export default Breadcrumbs;
