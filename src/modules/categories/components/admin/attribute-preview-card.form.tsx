import type { FieldErrors } from "react-hook-form";

import { Button } from "~/components/ui/button";

import { Badge } from "~/components/ui/badge";

import { cn } from "~/utils/styles";

import type { ElementRef, HTMLAttributes } from "react";
import type { CategoryFormValues } from "../../types";

type Props = {
  errors: FieldErrors<CategoryFormValues>;

  handleOnEdit: () => void;
  attributeIndex: number;
  attributeTitle: string;
  attributeValues: { content: string }[];

  loading?: boolean;
} & HTMLAttributes<ElementRef<"div">>;
export const AttributePreviewCard = ({
  errors,
  handleOnEdit,
  attributeTitle,
  attributeIndex,
  attributeValues,
  className,
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        "hidden w-full flex-col items-start rounded-md border border-border p-4 shadow ",
        className
      )}
      {...props}
    >
      <div className="flex w-full items-start">
        <h3
          className={cn(
            "text-sm font-semibold",
            errors?.attributes?.[attributeIndex] && "text-red-600"
          )}
        >
          {attributeTitle}
        </h3>

        <Button
          className="ml-auto"
          type="button"
          size={"sm"}
          variant={"outline"}
          onClick={handleOnEdit}
        >
          Edit Item...
        </Button>
      </div>
      <div className="flex gap-2">
        {attributeValues.map((val, idx) => (
          <Badge
            key={idx}
            variant={"secondary"}
            className={cn(val.content === "" && "hidden")}
          >
            {val.content}{" "}
          </Badge>
        ))}
      </div>
    </div>
  );
};
