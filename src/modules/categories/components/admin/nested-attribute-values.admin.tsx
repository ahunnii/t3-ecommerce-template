import { Trash } from "lucide-react";

import {
  useFieldArray,
  type Control,
  type UseFormReturn,
} from "react-hook-form";

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
import { type CategoryFormValues } from "../../types";

export const NestedAttributeValues = ({
  nestIndex,
  control,
  form,
}: {
  nestIndex: number;
  control: Control<CategoryFormValues>;
  form: UseFormReturn<CategoryFormValues>;
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `attributes.${nestIndex}.values` as const,
  });

  return (
    <>
      {" "}
      <div className="flex w-full items-center justify-between gap-2 pt-4">
        <FormLabel className="flex">Attribute Values</FormLabel>{" "}
      </div>
      <div className="flex  w-full flex-col gap-1 space-y-1">
        {fields.map((item, k) => {
          return (
            <FormField
              key={item.id}
              control={control}
              name={`attributes.${nestIndex}.values.${k}.content`}
              render={({ field }) => (
                <FormItem className="flex w-full items-center gap-2">
                  <div className=" flex w-4/6 flex-col max-lg:w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Attribute Value"
                        className=""
                        onChange={(e) => {
                          field.onChange(e);

                          if (
                            e.target.value !== "" &&
                            form
                              .watch(`attributes.${nestIndex}.values`)
                              .filter((val) => val.content === "").length === 0
                          ) {
                            append({ content: "" }, { shouldFocus: false });
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                  {((k !== 0 && fields.length > 1) || fields.length > 1) && (
                    <Button
                      type="button"
                      variant={"destructive"}
                      className="m-0  h-5 w-5 rounded-full  bg-transparent p-0  text-red-500 hover:bg-transparent hover:text-red-700 "
                      onClick={() => remove(k)}
                    >
                      <Trash className="size-5" />
                    </Button>
                  )}
                </FormItem>
              )}
            />
          );
        })}

        <FormDescription>
          Example: If you did an attribute like <em>Size</em>, some attribute
          values could be <strong>S, M, L, XL</strong>
        </FormDescription>
      </div>{" "}
    </>
  );
};
