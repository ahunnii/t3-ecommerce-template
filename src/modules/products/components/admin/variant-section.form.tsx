import { useEffect, useMemo, useRef, useState } from "react";

import type { Attribute, Prisma } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { Boxes, DollarSign, Trash } from "lucide-react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { EditSection } from "~/components/common/sections/edit-section.admin";

import { AdvancedDataTableForm } from "~/components/common/tables/advanced-data-table-form";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import type { ProductFormValues } from "../../types";

type Props = {
  form: UseFormReturn<ProductFormValues>;

  categories:
    | Prisma.CategoryGetPayload<{ include: { attributes: true } }>[]
    | undefined;
};

type VariantColumn = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;

  values: string;
  [value: string]: string | number;
};

const columns: ColumnDef<VariantColumn>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    meta: {
      type: "image",
    },
  },

  {
    accessorKey: "values",
    header: "Attribute Values",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-2 ">
          <span className="text-xs text-muted-foreground">
            {row.original.names}
          </span>
          <span> {row.original.values}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "In Stock",
  },

  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.original.price);

      return <div>{formatted}</div>;
    },
  },

  {
    accessorKey: "edit",
    header: "",
  },
  {
    id: "actions",
  },
];

export const VariantProductFormSection = ({ form, categories }: Props) => {
  const [openPrice, setOpenPrice] = useState(false);

  const [openQuantity, setOpenQuantity] = useState(false);

  const [open, setOpen] = useState(false);

  const categoryId = form.watch("categoryId");

  const currentAttributes: Attribute[] = useMemo(() => {
    return categories && categoryId
      ? categories.find((cat) => cat.id === categoryId)!.attributes
      : [];
  }, [categories, categoryId]);

  const handleGenerateVariations = () => {
    function splitValues(attribute: Attribute): string[] {
      return attribute.values.split(";");
    }

    function cartesianProduct(
      sets: string[][],
      prefix: string[] = []
    ): string[][] {
      if (!sets?.length) {
        return [prefix];
      }

      const resultSet: string[][] = [];
      const [currentSet, ...remainingSets] = sets;

      for (const item of currentSet!) {
        const newPrefix = [...prefix, item];
        const productOfRemaining = cartesianProduct(remainingSets, newPrefix);
        resultSet.push(...productOfRemaining);
      }

      return resultSet;
    }

    const attributeValues = currentAttributes?.map(splitValues);

    const test = cartesianProduct(attributeValues);

    const generatedVariations = test.map((variation) => ({
      imageUrl: undefined,
      sku: "",
      names: currentAttributes?.map((attribute) => attribute.name).join(", "),
      values: variation.join(", "),
      price: form.getValues("price"),
      quantity: form.getValues("quantity"),
    }));

    return generatedVariations;
  };

  const { replace, prepend } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const handleOnMediaDelete = (url: string) => {
    form.setValue("images", [
      ...form.watch("images").filter((current) => current !== url),
    ]);

    if (form.watch("featuredImage") === url) {
      form.setValue("featuredImage", "");
    }

    form.watch("variants").forEach((variant, idx) => {
      if (variant.imageUrl === url) {
        form.setValue(`variants.${idx}.imageUrl`, "");
      }
    });
  };

  return (
    <EditSection
      title="Variations"
      description="Create variations for customers to choose from. Note
          that these will override your default values above."
    >
      <FormField
        control={form.control}
        name="variants"
        render={({ field }) => (
          <>
            {form.watch("categoryId") === undefined ? (
              <p className="leading-7 text-primary [&:not(:first-child)]:mt-6">
                Choose a category first
              </p>
            ) : (
              <div className="my-5 flex justify-around gap-5">
                <Button
                  variant={"secondary"}
                  className="my-2"
                  type="button"
                  onClick={() => {
                    replace(handleGenerateVariations());
                  }}
                >
                  Generate Variations
                </Button>
                <Button
                  variant={"destructive"}
                  className="my-2"
                  type="button"
                  onClick={() => replace([])}
                >
                  Delete all Variations
                </Button>

                <Button
                  variant={"outline"}
                  className="my-2"
                  type="button"
                  onClick={() =>
                    prepend({
                      imageUrl: "",
                      sku: "",
                      values: "",
                      names: "",
                      price: 0,
                      quantity: 0,
                    })
                  }
                >
                  Create a Variation
                </Button>

                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="my-2">
                      More Options...
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setOpenPrice(true)}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Set all prices to...
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setOpenQuantity(true)}>
                        <Boxes className="mr-2 h-4 w-4" />
                        Set all quantities...
                      </DropdownMenuItem>
                      {/* <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Tags className="mr-2 h-4 w-4" />
                Apply label
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Filter label..."
                    autoFocus={true}
                  />
                  <CommandList>
                    <CommandEmpty>No label found.</CommandEmpty>
                    <CommandGroup>
                      {labels.map((label) => (
                        <CommandItem
                          key={label}
                          value={label}
                          onSelect={(value) => {
                            setLabel(value)
                            setOpen(false)
                          }}
                        >
                          {label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub> */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {form.watch("categoryId") !== undefined &&
              form.watch("variants").length === 0 && (
                <p className="leading-7 text-primary [&:not(:first-child)]:mt-6">
                  No variations have been created yet.
                </p>
              )}

            {form.watch("categoryId") === undefined && (
              <p className="leading-7 text-primary [&:not(:first-child)]:mt-6">
                You need to select a category first.
              </p>
            )}

            {(currentAttributes?.length === 0 || !currentAttributes) && (
              <p className="leading-7 text-primary [&:not(:first-child)]:mt-6">
                Your category needs to have some attributes first before
                creating variations.
              </p>
            )}
            {form.watch("variants").length > 0 &&
              currentAttributes &&
              currentAttributes?.length > 0 && (
                <>
                  <AdvancedDataTableForm
                    columns={columns}
                    data={field.value as unknown as VariantColumn[]}
                    form={form}
                    searchKey="values"
                    formKey="variants"
                    ignoreColumns={["values", "actions", "imageUrl", "edit"]}
                    renderSelect={currentAttributes}
                    handleOnMediaDelete={handleOnMediaDelete}
                  />
                </>
              )}

            <AdjustVariationsDialog
              open={openPrice}
              setOpen={setOpenPrice}
              title="Price"
              onAccept={(value) => {
                const newVariants = field.value.map((variant) => ({
                  ...variant,
                  price: Number(value),
                }));

                replace(newVariants);

                console.log(value);
                setOpenPrice(false);
              }}
            />

            <AdjustVariationsDialog
              open={openQuantity}
              setOpen={setOpenQuantity}
              title="Quantity"
              onAccept={(value) => {
                const newVariants = field.value.map((variant) => ({
                  ...variant,
                  quantity: Number(value),
                }));

                replace(newVariants);

                console.log(value);
                setOpenQuantity(false);
              }}
            />
          </>
        )}
      />
    </EditSection>
  );
};

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import { set, uniqueId } from "lodash";
import { Label } from "~/components/ui/label";

export function AdjustVariationsDialog({
  title,
  onAccept,
  open,
  setOpen,
}: {
  title: string;
  onAccept: (e: number | string) => void;
  open: boolean;
  setOpen: (e: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Set all variant {title.toLowerCase()}s to the same value.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {title}
            </Label>
            <Input
              type="number"
              defaultValue="0"
              min="0"
              className="col-span-3"
              ref={inputRef}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            disabled={!inputRef?.current?.value}
            onClick={() => onAccept(inputRef.current!.value)}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
