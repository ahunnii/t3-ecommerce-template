import { useRouter } from "next/navigation";
import usePreviewModal from "~/hooks/core/use-preview-modal";
import useCart from "~/modules/cart/hooks/use-cart";
import type { DetailedProductFull } from "~/types";

export const useProductCard = (data: DetailedProductFull) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();
  return {};
};
