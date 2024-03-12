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

import * as React from "react";
import { Button } from "~/components/ui/button";

import * as z from "zod";

import type { DetailedProductFull } from "~/types";
import { cn } from "~/utils/styles";

import type { ProductVariant } from "../types";
import { VariantSearchSelect } from "./variant-search-select";

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
  variant: ProductVariant | null;

  setVariant: (variant: ProductVariant | null) => void;
  setQuantity: (quantity: number) => void;
}
const formSchema = z.object({
  selection: z.record(z.string(), z.string()),
  quantity: z.coerce.number().min(1),
});

export type VariantFormValues = z.infer<typeof formSchema>;

const VariantSelector: FC<IProps> = ({
  product,

  variant,
  setVariant,
  setQuantity,
  ...props
}) => {
  // Define a zod schema for validation

  const form = useForm<VariantFormValues>({
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

  const possibleOptions = React.useMemo(() => {
    return product.category.attributes?.map((attribute) => {
      return {
        name: attribute.name,
        values: attribute.values.split(";"),
      };
    });
  }, [product.category.attributes]);

  const textStyles = infoVariants({ labels: props?.labels ?? "default" });

  return (
    <>
      <Form {...form}>
        <form className="space-y-5">
          <div className="flex flex-col space-y-4 ">
            {product.variants?.length > 0 &&
              possibleOptions?.map((possibleOption, idx) => (
                <FormItem key={idx} className="flex flex-col">
                  <FormLabel className={cn("", textStyles)}>
                    {possibleOption.name}
                  </FormLabel>{" "}
                  <Controller
                    name={`selection.${possibleOption.name}`}
                    control={form.control}
                    render={({ field: formField }) => (
                      <>
                        <VariantSearchSelect
                          form={form}
                          formField={formField}
                          attributes={product.category.attributes[
                            idx
                          ]!.values.split(";")}
                          variantOption={possibleOption}
                          productVariants={product.variants}
                        />
                      </>
                    )}
                  />
                </FormItem>
              ))}
          </div>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("", textStyles)}>Quantity</FormLabel>
                <FormControl>
                  <div className="relative w-full rounded-md border border-slate-100 lg:w-36 ">
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
