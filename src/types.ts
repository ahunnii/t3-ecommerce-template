import type { Discount, Prisma, Product } from "@prisma/client";

export interface Image {
  id: string;
  url: string;
}

export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  billboard: Billboard;
  attributes: Attribute[];
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface Variation {
  id: string;
  names: string;
  values: string;
  quantity: number;
  price: number;
  productId: string;
}

export interface Attribute {
  id: string;
  name: string;
  values: string;
  quantity?: number;
}

export interface CartItem {
  product: DetailedProductFull;
  discountBundle?: { price: number; discount: Discount | null } | null;
  variant: Variation | null;
  quantity: number;
}

export interface Collection {
  id: string;
  name: string;
  products: Product[] | Partial<Product>[];
  billboard: Billboard;
}

export type DetailedProduct = Prisma.ProductGetPayload<{
  include: {
    images: true;
    category: {
      include: {
        collection: {
          include: {
            image: true;
          };
        };
      };
    };
  };
}>;

export type DetailedProductFull = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    category: {
      include: {
        attributes: true;
      };
    };
    discounts: true;
    store: {
      select: {
        id: true;
        hasFlatRate: true;
        flatRateAmount: true;
        hasFreeShipping: true;
        minFreeShipping: true;
      };
    };
  };
}>;

export type DetailedCategory = Prisma.CategoryGetPayload<{
  include: {
    attributes: true;
    collection: {
      include: {
        image: true;
      };
    };
  };
}>;

export type DetailedCollection = Prisma.CollectionGetPayload<{
  include: {
    products: true;
    image: true;
  };
}>;

export type Popup = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export type DetailedOrder = Prisma.OrderGetPayload<{
  include: {
    shippingAddress: true;
    billingAddress: true;
    orderItems: {
      include: {
        variant: true;
        product: true;
      };
    };
    fulfillments: true;
    timeline: true;
  };
}>;

export enum ShippingType {
  FREE = "FREE",
  FLAT_RATE = "FLAT_RATE",
  PICKUP = "PICKUP",
  CUSTOM = "CUSTOM",
}

export type CustomerShippingRate = {
  type: ShippingType;
  cost: number;
  label: string;
};
