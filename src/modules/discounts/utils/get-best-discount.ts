import type { Discount } from "@prisma/client";

export const getBestDiscount = (price: number, discounts: Discount[]) => {
  if (discounts.length === 0) return { price, discount: null };
  if (discounts.length === 1) {
    const discount = discounts[0]!;

    if (discount.valueType === "PERCENTAGE") {
      return { price: price - price * (discount.value / 100), discount };
    }
    if (discount.valueType === "FIXED") {
      return { price: price - discount.value, discount };
    }
  }

  //Find the highest discount value
  const possibleDiscounts = discounts.map((discount) => {
    if (discount.valueType === "PERCENTAGE") {
      return { price: price - price * (discount.value / 100), discount };
    }
    if (discount.valueType === "FIXED") {
      return { price: price - discount.value, discount };
    }

    return { price, discount: null };
  });

  const bestDiscount = possibleDiscounts.reduce((acc, loc) =>
    acc.price < loc.price ? acc : loc
  );

  return bestDiscount;
};
