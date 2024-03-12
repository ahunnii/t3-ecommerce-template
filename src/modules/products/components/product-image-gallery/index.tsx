"use client";

import { Tab } from "@headlessui/react";
import NextImage from "next/image";

import type { Image } from "~/types";

import ProductImageGalleryTab from "./product-image-gallery-tab";

import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

interface GalleryProps {
  images: Image[];
}

const ProductImageGallery: React.FC<GalleryProps> = ({ images = [] }) => {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      <div className="mx-auto mt-6  block w-full max-w-2xl lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images.map((image) => (
            <ProductImageGalleryTab key={image.id} image={image} />
          ))}
        </Tab.List>
      </div>
      <Tab.Panels className="aspect-square w-full">
        {images.map((image) => (
          <Tab.Panel key={image.id}>
            <div
              className="relative aspect-square h-full w-full overflow-hidden bg-cover bg-no-repeat sm:rounded-lg"
              style={{ backgroundImage: `url(${image.url})` }}
            >
              <div className="h-full w-full bg-purple-500/50 backdrop-blur-md"></div>
              <Dialog>
                <DialogTrigger asChild>
                  <NextImage
                    fill
                    src={image.url}
                    alt="Image"
                    className="object-contain object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </DialogTrigger>
                <DialogContent className="w-full ">
                  <NextImage
                    src={image.url ?? ""}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </DialogContent>
              </Dialog>
            </div>{" "}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default ProductImageGallery;
