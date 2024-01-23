import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "~/utils/styles";
export type BreadCrumbPath = {
  name: string;
  link?: string;
} & VariantProps<typeof infoVariants>;
const infoVariants = cva("", {
  variants: {
    variant: {
      default: "text-neutral-500 hover:text-black",
      dark: " hover:text-purple-500 text-neutral-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
const Breadcrumbs = ({
  pathway,
  ...props
}: { pathway: BreadCrumbPath[] } & VariantProps<typeof infoVariants>) => {
  return (
    <nav className="mb-4 flex px-5 pb-5 pt-10 " aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className={cn(
              "inline-flex items-center text-sm font-medium  transition-colors ",
              infoVariants({ variant: props?.variant ?? "default" })
            )}
          >
            <svg
              className="mr-2.5 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            Home
          </Link>
        </li>

        {pathway.map((path, idx) => (
          <BreadcrumbPath pathway={path} key={idx} variant={props?.variant} />
        ))}
        {/* <li>
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-neutral-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <Link
              href="/collections/all-products"
              className="ml-1 text-sm font-medium text-neutral-500 transition-colors hover:text-black md:ml-2"
            >
              Collections
            </Link>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-neutral-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="ml-1 text-sm font-medium  text-black md:ml-2">
              {collection?.name}
            </span>
          </div>
        </li> */}
      </ol>
    </nav>
  );
};

const BreadcrumbPath = ({
  pathway,
  ...props
}: {
  pathway: {
    name: string;
    link?: string;
  };
} & VariantProps<typeof infoVariants>) => {
  const params = pathway?.link
    ? ({
        "aria-current": "page",
      } as React.HTMLAttributes<HTMLLIElement>)
    : {};

  return (
    <li {...params}>
      <div className="flex items-center">
        <svg
          className="h-6 w-6 text-neutral-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          ></path>
        </svg>

        {pathway?.link ? (
          <Link
            href={pathway?.link}
            className={cn(
              "ml-1 text-sm font-medium transition-colors  md:ml-2",
              props?.variant === "dark"
                ? "text-black hover:text-purple-500"
                : "text-black"
            )}
          >
            {pathway.name}
          </Link>
        ) : (
          <span
            className={cn(
              "ml-1 text-sm font-medium   md:ml-2",
              props?.variant === "dark" ? "text-fuchsia-700" : "text-black"
            )}
          >
            {pathway.name}
          </span>
        )}
      </div>
    </li>
  );
};

export default Breadcrumbs;
