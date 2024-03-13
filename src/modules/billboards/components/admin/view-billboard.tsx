import type { Billboard } from "@prisma/client";
import Image from "next/image";
import { ViewSection } from "~/components/common/sections/view-section.admin";
import BillboardDisplay from "~/modules/billboards/components/billboard";

export const ViewBillboard = ({ billboard }: { billboard: Billboard }) => {
  return (
    <>
      <ViewSection
        title="As a collection image"
        description="This is what represents the assigned collection in the admin."
        className=" aspect-square md:w-1/2 lg:w-1/3"
      >
        <div className="relative my-2 aspect-square overflow-hidden rounded-xl border">
          <Image
            src={billboard.imageUrl}
            alt={billboard.label}
            fill
            className={
              "aspect-square h-auto w-auto object-cover transition-all hover:scale-105"
            }
          />
        </div>
      </ViewSection>

      <ViewSection
        title="As a page header (deprecated)"
        description="This is what is shown at the top of each collections page."
        className=""
      >
        <BillboardDisplay data={billboard} textStyle="text-white" />
      </ViewSection>
    </>
  );
};
