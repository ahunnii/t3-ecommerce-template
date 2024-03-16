import { Copy } from "lucide-react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

import { toastService } from "~/services/toast";

type IdCopyMenuItemProps = {
  id: string;
  name?: string;
};
export const IdCopyMenuItem: React.FC<IdCopyMenuItemProps> = ({
  id,
  name = "ID",
}) => {
  const onCopySelection = () => {
    navigator.clipboard
      .writeText(id)
      .then(() => toastService.success(`${name} copied to clipboard.`))
      .catch((err: unknown) =>
        toastService.error(`Failed to copy ${name} to clipboard.`, err)
      );
  };

  return (
    <DropdownMenuItem onClick={onCopySelection} className="cursor-pointer">
      <Copy className="mr-2 h-4 w-4" /> Copy Id
    </DropdownMenuItem>
  );
};
