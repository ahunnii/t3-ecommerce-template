"use client";

import { Tab } from "@headlessui/react";
import NextImage from "next/image";

import type { Image } from "~/types";

import GalleryTab from "./product-gallery-tab";

import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

type Props = { images: Image[] };

export const ProductGallery: React.FC<Props> = ({ images = [] }) => {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images.map((image) => (
            <GalleryTab key={image.id} image={image} />
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
                  />
                </DialogTrigger>
                <DialogContent className="w-full ">
                  <NextImage
                    src={image.url ?? ""}
                    alt=""
                    width={462}
                    height={825}
                    layout="responsive"
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
