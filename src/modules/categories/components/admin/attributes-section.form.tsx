import { useState } from "react";

import { Plus, Trash } from "lucide-react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";

import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { Input } from "~/components/ui/input";

import { cn } from "~/utils/styles";

import type { CategoryFormValues } from "../../types";
import { AttributePreviewCard } from "./attribute-preview-card.form";
import { NestedAttributeValues } from "./nested-attribute-values.admin";

export const AttributeSection = ({
  form,
}: {
  form: UseFormReturn<CategoryFormValues>;
  loading?: boolean;
}) => {
  const formErrors = form.formState.errors;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });
  const [toggleView, setToggleView] = useState(``);

  return (
    <>
      {fields.map((item, index) => (
        <section key={`attribute_` + item.id} className="group">
          <div
            className={cn(
              " hidden w-full  flex-col items-start space-y-4 rounded-md border border-border p-4 shadow",
              toggleView === `attribute_${index}` && "flex",
              formErrors?.attributes?.[index] && "border-red-600"
            )}
            tabIndex={0}
          >
            <div className=" flex w-full items-center gap-2">
              <FormField
                control={form.control}
                name={`attributes.${index}.name`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className={cn()}>Attribute Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center  gap-2">
                        <Input
                          {...field}
                          placeholder="Attribute (e.g., Size, Color)"
                          className="w-4/6 max-lg:w-full"
                          // className="h-10 w-20 border-0 px-0 pt-0 font-semibold group-focus-within:h-10 group-focus-within:w-full group-focus-within:border group-focus-within:px-3 group-focus-within:pt-2 group-focus-within:font-normal"
                        />

                        <Button
                          onClick={() => remove(index)}
                          variant="destructive"
                          type="button"
                          className="m-0  h-5 w-5 rounded-full  bg-transparent p-0  text-red-500 hover:bg-transparent hover:text-red-700 "
                        >
                          <Trash className="size-5" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription className="w-4/6 max-lg:w-full">
                      Tip: This represents a type of product, so make sure it
                      has a name that fits
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <NestedAttributeValues
              nestIndex={index}
              {...{ control: form.control, form: form }}
            />

            <Button
              type="button"
              size={"sm"}
              variant={"default"}
              disabled={form.watch(`attributes.${index}.name`) === ""}
              onClick={() => {
                if (form.watch(`attributes.${index}.name`) !== "")
                  setToggleView(``);
              }}
            >
              Done
            </Button>
          </div>
          <AttributePreviewCard
            errors={formErrors}
            attributeTitle={form.watch(`attributes.${index}.name`)}
            attributeValues={form.watch(`attributes.${index}.values`)}
            attributeIndex={index}
            handleOnEdit={() => {
              setToggleView(`attribute_${index}`);

              if (
                form
                  .watch(`attributes.${index}.values`)
                  .filter((val) => val.content === "").length === 0
              )
                form.setValue(`attributes.${index}.values`, [
                  ...form.watch(`attributes.${index}.values`),
                  { content: "" },
                ]);
            }}
            tabIndex={0}
            className={cn(toggleView !== `attribute_${index}` && "flex")}
          />
        </section>
      ))}

      <Button
        onClick={() => {
          append({
            name: "",
            values: [{ content: "" }],
          });
          setToggleView(`attribute_${form.watch("attributes").length - 1}`);
        }}
        type="button"
        className=" w-full   gap-2 "
      >
        <Plus className="h-5 w-5" />
        Add New Attribute
      </Button>
    </>
  );
};
