import Link from "next/link";

import { useConfig } from "~/providers/style-config-provider";
import { cn } from "~/utils/styles";

export type CrumbPath = {
  name: string;
  link?: string;
};

export const BreadCrumbPath = ({ name, link }: CrumbPath) => {
  const params = link
    ? ({
        "aria-current": "page",
      } as React.HTMLAttributes<HTMLLIElement>)
    : {};

  const config = useConfig();

  return (
    <li {...params}>
      <div className="flex items-center">
        <ArrowIcon color={config.breadCrumbs.icon ?? ""} />
        {link ? (
          <Link
            href={link}
            className={cn(
              " text-sm font-medium text-black transition-colors ",
              config.breadCrumbs.secondary
            )}
          >
            {name}
          </Link>
        ) : (
          <span
            className={cn(
              "text-sm font-medium text-black transition-colors",
              config.breadCrumbs.current
            )}
          >
            {name}
          </span>
        )}
      </div>
    </li>
  );
};

const ArrowIcon = ({ color }: { color?: string }) => (
  <svg
    className={cn("h-6 w-6 ", color)}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    ></path>
  </svg>
);
