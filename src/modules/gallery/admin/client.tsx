import { Plus } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";

import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import { columns, type GalleryImageColumn } from "./columns";

interface ProductsClientProps {
  data: GalleryImageColumn[];
}

export const GalleryImageClient: React.FC<ProductsClientProps> = ({ data }) => {
  const params = useRouter();
  const router = useNavigationRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Gallery Images (${data.length})`}
          description="Manage your site's gallery"
        />
        <Button
          onClick={() =>
            router.push(`/admin/${params.query.storeId as string}/gallery/new`)
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data} />
      <Heading title="Public API" description="API Calls for Gallery Images" />
      <Separator />
      <ApiList entityName="gallery" entityIdName="galleryId" />
    </>
  );
};
