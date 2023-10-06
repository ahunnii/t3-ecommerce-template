export interface Product {
  id: string;
  category: Category;
  name: string;
  price: string;
  isFeatured: boolean;
  size: Size;
  color: Color;
  images: Image[];
  variants: Variation[];
}

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

export interface Color {
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
}

export interface CartItem {
  product: Product;
  variant: Variation;
  quantity: number;
}
