import { Expand, ShoppingCart } from "lucide-react";
import IconButton from "~/components/core/ui/icon-button";

const ProductCardQuickActions = () => {
  return (
    <div className="absolute bottom-5 z-50 w-full px-6 opacity-0 transition group-hover:opacity-100">
      <div className="flex justify-center gap-x-6">
        <IconButton
          onClick={onPreview}
          icon={<Expand size={20} className="text-gray-600" />}
        />
        {data.variants?.length === 0 && (
          <IconButton
            onClick={onAddToCart}
            icon={<ShoppingCart size={20} className="text-gray-600" />}
          />
        )}
      </div>
    </div>
  );
};
