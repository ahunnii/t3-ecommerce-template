import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { FC } from "react";
import getCollection from "~/actions/core/get-collection";
import getProducts from "~/actions/core/get-products";
import { MainNav } from "~/components/admin/main-nav";
import AttributeFilter from "~/components/core/category/attribute-filter";
import { CollectionCard } from "~/components/core/category/collection-card";
import MobileFilters from "~/components/core/category/mobile-filters";
import Billboard from "~/components/core/ui/billboard";
import Header from "~/components/core/ui/header";
import NoResults from "~/components/core/ui/no-results";
import ProductCard from "~/components/core/ui/product-card";
import PageLoader from "~/components/ui/page-loader";
import StorefrontLayout from "~/layouts/StorefrontLayout";
import { DetailedCollection, DetailedProductFull } from "~/types";
import { api } from "~/utils/api";

type ICollectionPageProps = {
  collectionId: string;
};
const CollectionPage = () => {
  const { data: collections, isLoading } =
    api.collections.getAllCollections.useQuery({});

  return (
    <StorefrontLayout>
      {/* <Billboard data={collection?.billboard} /> */}

      <nav className="mx-6 mb-4   flex  px-1 pb-2 pt-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-black"
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
          <li>
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
        </ol>
      </nav>

      <div className="px-4 pb-24 sm:px-6 lg:px-8">
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="mt-6 lg:col-span-4 lg:mt-0">
            {collections?.length === 0 && <NoResults />}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {collections?.map((item: DetailedCollection) => (
                <CollectionCard
                  key={item.id}
                  collection={item}
                  aspectRatio="square"
                  width={150}
                  height={150}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default CollectionPage;
