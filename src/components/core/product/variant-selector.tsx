import { FC, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import type { Attribute, Variation } from "~/types";

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

interface IProps {
  attributes: Attribute[];
  variant: Variation | null;
  variants: Variation[];
  setVariant: (variant: Variation | null) => void;
  setQuantity: (quantity: number) => void;
}
const formSchema = z.object({
  selection: z.record(z.string(), z.string()),
  quantity: z.number().min(1),
});

type ProductFormValues = z.infer<typeof formSchema>;

const VariantSelector: FC<IProps> = ({
  attributes,
  variants,
  variant,
  setVariant,
  setQuantity,
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

  useEffect(() => {
    const selected = Object.values(watchedValues.selection)
      .filter((item) => item)
      .join(", ");

    const available = variants?.map((variant) => {
      return variant.values;
    });

    const isAvailable = available?.indexOf(selected);

    if (variants?.length > 0 && available?.includes(selected)) {
      setVariant(variants[isAvailable]!);
      setQuantity(watchedValues.quantity);
    } else {
      setVariant(null);
      setQuantity(0);
    }
  }, [watchedValues, variants]);

  return (
    <>
      <Form {...form}>
        <form>
          {variants?.length > 0 &&
            attributes?.map((field, idx) => (
              <FormItem key={idx}>
                <FormLabel>{field.name}</FormLabel>{" "}
                <Controller
                  name={`selection.${field.name}`}
                  control={form.control}
                  render={({ field: formField }) => (
                    <Select
                      {...formField}
                      onValueChange={(e) => formField.onChange(e)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={`Select a ${field.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="capitalize">
                            {field.name}
                          </SelectLabel>
                          {attributes[idx]!.values.split(";").map(
                            (value, idx) => (
                              <SelectItem
                                key={idx}
                                value={value}
                                className="flex"
                              >
                                {value}
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormItem>
            ))}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-[180px]"
                    type="number"
                    min={1}
                    max={variant ? variant.quantity : 10}
                  />
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
