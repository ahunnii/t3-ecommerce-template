import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
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

import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";

import { useState } from "react";
import { calculateVariantDetails } from "~/modules/variations/utils/handle-variants";
import type { Variation } from "~/types";
import { cn } from "~/utils/styles";
import type { VariantFormValues } from "./variant-selector";

type Props = {
  form: UseFormReturn<VariantFormValues>;
  formField: ControllerRenderProps<VariantFormValues, `selection.${string}`>;
  attributes: string[];
  variantOption: {
    name: string;
    values: string[];
  };
  productVariants: Variation[];
};

export const VariantSearchSelect = (props: Props) => {
  const watchedValues = props.form.watch();

  const [open, setOpen] = useState(false);
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between lg:w-[200px]",
            !props.formField.value && "text-muted-foreground"
          )}
        >
          {props.formField.value
            ? props.attributes.find(
                (attribute) => attribute === props.formField.value
              )
            : `Select a ${props.variantOption.name}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 lg:w-[200px]">
        <Command>
          <CommandInput placeholder={`Search ${props.variantOption.name}...`} />
          <CommandEmpty>No {props.variantOption.name} found.</CommandEmpty>
          <CommandGroup>
            {props.variantOption.values.map((givenOption, index) => {
              const { isSelectable, isSelected, optionLabel, optionDetail } =
                calculateVariantDetails({
                  optionName: props.variantOption.name,
                  selection: watchedValues.selection,
                  givenOption,
                  productVariants: props.productVariants,
                });

              return (
                <CommandItem
                  value={givenOption}
                  key={index}
                  className={cn(
                    isSelectable ? "" : "text-gray-400 line-through"
                  )}
                  disabled={!isSelectable}
                  onSelect={() => {
                    props.form.setValue(
                      `selection.${props.variantOption.name}`,
                      isSelected ? "" : givenOption
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      givenOption === props.formField.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {optionLabel}
                  {optionDetail}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
