import { useEffect, type FC } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronsUpDown, Minus, Plus } from "lucide-react";
import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import * as z from "zod";

import type { DetailedProductFull, Variation } from "~/types";
import { cn } from "~/utils/styles";

const infoVariants = cva("", {
  variants: {
    labels: {
      default: "",
      dark: "text-white/75",
    },
  },
  defaultVariants: {
    labels: "default",
  },
});

interface IProps extends VariantProps<typeof infoVariants> {
  product: DetailedProductFull;
  variant: Variation | null;

  setVariant: (variant: Variation | null) => void;
  setQuantity: (quantity: number) => void;
}
const formSchema = z.object({
  selection: z.record(z.string(), z.string()),
  quantity: z.coerce.number().min(1),
});

type ProductFormValues = z.infer<typeof formSchema>;

const VariantSelector: FC<IProps> = ({
  product,

  variant,
  setVariant,
  setQuantity,
  ...props
}) => {
  // Define a zod schema for validation

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selection: {},
      quantity: 1,
    },
  });

  const watchedValues = form.watch();

  const incrementQuantity = () => {
    form.setValue("quantity", watchedValues.quantity + 1);
  };

  const decrementQuantity = () => {
    if (watchedValues.quantity <= 0) return;
    form.setValue("quantity", watchedValues.quantity - 1);
  };

  const getVariantByAttributes = (
    attributeValues: string[],
    variants: Variation[]
  ) => {
    // Loop through the variants to find a match
    return variants.find((variant) => {
      // Split the variant values by comma and trim spaces for comparison
      const variantValues = variant.values
        .split(", ")
        .map((value) => value.trim());
      // Check if all selected attribute values are in the variant's values
      return attributeValues.every((attrValue) =>
        variantValues.includes(attrValue)
      );
    });
  };

  const getVariantPrice = (optionValue: string, attributeName: string) => {
    // Assuming each variant has a unique combination of values
    const variant = product.variants?.find((v) => {
      const values = v.values.split(", ").map((v) => v.trim());
      return values.includes(optionValue);
    });

    // If variant is found and has a price, return it
    return variant ? variant.price : null;
  };

  const formatPrice = (price: number | null) => {
    // Format the price as a currency string, or return an empty string if null
    return price ? `$${price.toFixed(2)}` : "";
  };

  useEffect(() => {
    const getVariant = () => {
      return product.variants?.find(
        (variant) =>
          Object.values(watchedValues.selection).join(", ") === variant.values
      );
    };

    const selectedVariant = getVariant();

    if (product.variants?.length > 0 && selectedVariant) {
      setVariant(selectedVariant);
    } else {
      setVariant(null);
    }
    setQuantity(watchedValues.quantity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues, product.variants]);

  useEffect(() => {
    if (variant) form.setValue("quantity", 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const availableOptions = product?.variants?.map((variant) => {
    if (variant.quantity >= 1) return `${variant.values}, ${variant.quantity}`;
    return "";
  });

  const isOptionAvailable = (option: string) => {
    // Assuming availableOptions is an array of strings
    // Update this logic based on how your availableOptions are structured
    return availableOptions.some((availableOption) =>
      availableOption.includes(option)
    );
  };

  const possibleOptions = React.useMemo(() => {
    return product.category.attributes?.map((attribute) => {
      return {
        name: attribute.name,
        values: attribute.values.split(";"),
      };
    });
  }, [product.category.attributes]);

  //  First, generate an array of possible options and array of available options
  //  Second, compare the two arrays and return the available options
  function doesMatch(option: string, idx: number, name: string): boolean {
    const searchArray = Object.values({
      ...form.watch("selection"),
      [name]: option,
    });
    for (const target of availableOptions) {
      const splitTarget = target.split(", ").map((s) => s.trim());
      let isMatch = true;

      for (let i = 0; i < searchArray.length; i++) {
        const searchElement = searchArray[i];
        const targetElement = splitTarget[i];

        // Check if the elements match, considering undefined as a wildcard
        if (searchElement !== undefined && searchElement !== targetElement) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        return true; // Found a matching string in targetArray
      }
    }

    return false; // No match found in targetArray
  }

  // console.log(availableOptions);
  const textStyles = infoVariants({ labels: props?.labels ?? "default" });
  // const btnStyles = infoVariants({ button: props?.button ?? "default" });
  return (
    <>
      <Form {...form}>
        <form className="space-y-5">
          {product.variants?.length > 0 &&
            possibleOptions?.map((field, idx) => (
              <FormItem key={idx} className="flex flex-col">
                <FormLabel className={cn("", textStyles)}>
                  {field.name}
                </FormLabel>{" "}
                <Controller
                  name={`selection.${field.name}`}
                  control={form.control}
                  render={({ field: formField }) => (
                    <>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !formField.value && "text-muted-foreground"
                              )}
                            >
                              {formField.value
                                ? product.category.attributes[
                                    idx
                                  ]!.values.split(";").find(
                                    (language) => language === formField.value
                                  )
                                : `Select a ${field.name}`}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder={`Search ${field.name}...`}
                            />
                            <CommandEmpty>No {field.name} found.</CommandEmpty>
                            <CommandGroup>
                              {field.values.map((givenOption, index) => {
                                // Prepare the array of currently selected attribute values, including the current 'field.name'
                                const attributeValues = Object.entries(
                                  watchedValues.selection
                                )
                                  .map(([key, value]) => {
                                    return key === field.name
                                      ? givenOption
                                      : value; // Replace the current field's value with the option
                                  })
                                  .filter(Boolean); // Filter out any undefined or empty strings

                                // Find the matching variant based on current and new selection
                                const matchingVariant = getVariantByAttributes(
                                  attributeValues,
                                  product.variants || []
                                );

                                const variantAvailable = matchingVariant
                                  ? matchingVariant.quantity > 0
                                  : false;
                                const variantPrice = matchingVariant
                                  ? matchingVariant.price
                                  : null;
                                const isSelected =
                                  watchedValues.selection[field.name] ===
                                  givenOption;
                                const isSelectable =
                                  variantAvailable && variantPrice !== null;

                                const optionLabel = `${givenOption} ${
                                  variantPrice !== null
                                    ? `- $${variantPrice.toFixed(2)}`
                                    : ""
                                }`;
                                const optionDetail = !variantAvailable
                                  ? " - Out of stock"
                                  : isSelected
                                  ? ``
                                  : "";

                                return (
                                  <CommandItem
                                    value={givenOption}
                                    key={index}
                                    className={cn(
                                      isSelectable
                                        ? ""
                                        : "text-gray-400 line-through"
                                    )}
                                    disabled={!isSelectable}
                                    onSelect={() => {
                                      form.setValue(
                                        `selection.${field.name}`,
                                        isSelected ? "" : givenOption
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        givenOption === formField.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {/* {givenOption} -{" "}
                                    {formatPrice(
                                      getVariantPrice(givenOption, field.name)
                                    )}
                                    {!available || !combo
                                      ? " - Out of stock"
                                      : ""} */}

                                    {optionLabel}
                                    {optionDetail}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </>
                  )}
                />
              </FormItem>
            ))}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("", textStyles)}>Quantity</FormLabel>
                <FormControl>
                  {/* <div className="flex gap-1"> */}

                  <div className="relative w-36 rounded-md border border-slate-100 ">
                    <div className=" absolute inset-y-0 left-0 z-30 flex items-center">
                      <Button
                        variant={"ghost"}
                        type="button"
                        onClick={decrementQuantity}
                      >
                        -
                      </Button>
                    </div>
                    <Input
                      {...field}
                      // className="w-[180px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      type="text"
                      min={1}
                      onChange={(e) => {
                        if (isNaN(Number(e.target.value))) {
                          if (!isNaN(field.value)) return;
                          field.onChange(1);
                          return;
                        }
                        field.onChange(Number(e.target.value));
                      }}
                      inputMode="numeric"
                      className="z-10 block  rounded-md px-12 py-1.5  text-center     text-gray-900 sm:text-sm sm:leading-6"
                      max={variant ? variant.quantity : product.quantity}
                    />

                    <div className=" absolute inset-y-0 right-0 z-30 flex items-center">
                      <Button
                        variant={"ghost"}
                        type="button"
                        onClick={incrementQuantity}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  {/* </div> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default VariantSelector;
