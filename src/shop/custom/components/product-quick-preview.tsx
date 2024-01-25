import { Expand } from "lucide-react";
import IconButton from "~/components/core/ui/icon-button";

const ProductQuickPreview = () => {
  return (
    <IconButton
      onClick={onPreview}
      icon={<Expand size={20} className="text-gray-600" />}
    />
  );
};
