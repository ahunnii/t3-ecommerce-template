import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type AdminPreviewInStoreButtonProps = {
  url: string;
};
export const AdminPreviewInStoreButton = ({
  url,
}: AdminPreviewInStoreButtonProps) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger>
          <Link href={url} target="_blank">
            <Button
              className="invisible m-0 h-6 w-6 rounded-full p-0 hover:text-blue-600 group-hover:visible"
              variant={"ghost"}
            >
              <Eye className=" size-4 " />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Preview in Store</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
