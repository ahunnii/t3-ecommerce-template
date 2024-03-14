import * as React from "react";

import { Label } from "~/components/ui/label";

type ViewProductVariantsProps = {
  weight: number | null;
  materials: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  length: number | null;
  width: number | null;
  height: number | null;
};
export const ViewProductAttributes = ({
  weight,
  materials,
  tags,
  length,
  width,
  height,
}: ViewProductVariantsProps) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Attributes
        </h3>
      </div>
      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="price">
          Weight
        </Label>
        <div className="col-span-2 flex items-center gap-1 text-sm">
          {weight ? `${Math.floor(weight / 16)} lbs ${weight % 16} oz` : "N/A"}
        </div>
      </div>
      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="price">
          Length
        </Label>
        <div className="col-span-2 flex items-center gap-1 text-sm">
          {length ? `${length}in` : "N/A"}
        </div>
      </div>
      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="price">
          Width
        </Label>
        <div className="col-span-2 flex items-center gap-1 text-sm">
          {width ? `${width}in` : "N/A"}
        </div>
      </div>
      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="price">
          Height
        </Label>
        <div className="col-span-2 flex items-center gap-1 text-sm">
          {height ? `${height}in` : "N/A"}
        </div>
      </div>

      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="availability">
          Tags
        </Label>
        <div className="col-span-2 flex items-center text-sm">
          {tags?.length === 0 && <p>No tags provided</p>}
          {tags.map((tag, idx) => (
            <span key={tag.id}>
              {tag?.name} {idx < tags?.length - 1 ? "," : ""}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="availability">
          Materials
        </Label>
        <div className="col-span-2 flex items-center text-sm">
          {materials?.length === 0 && <p>No materials provided</p>}
          {materials.map((material, idx) => (
            <span key={material.id}>
              {material?.name} {idx < materials?.length - 1 ? "," : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
