import { Toggle } from "~/components/ui/toggle";
import type { VariantSelector } from "~/modules/variations/types";
import { calculateVariantDetails } from "~/modules/variations/utils/handle-variants";
import { cn } from "~/utils/styles";

export const VariantButtonSelect = (props: VariantSelector) => {
  const watchedValues = props.form.watch();
  return (
    <div className="flex flex-wrap gap-2">
      {props.variantOption.values.map((givenOption, index) => {
        const {
          isSelectable,
          isSelected,
          optionLabelSimplified,
          optionDetail,
        } = calculateVariantDetails({
          optionName: props.variantOption.name,
          selection: watchedValues.selection,
          givenOption,
          productVariants: props.productVariants,
        });

        return (
          <Toggle
            value={givenOption}
            type="button"
            variant={"outline"}
            key={index}
            className={cn(
              "bg-gray-200",
              isSelectable ? "" : "text-gray-400 line-through"
            )}
            disabled={!isSelectable}
            pressed={isSelected}
            onPressedChange={(toggled) => {
              if (toggled)
                props.form.setValue(
                  `selection.${props.variantOption.name}`,
                  isSelected ? "" : givenOption
                );
              else {
                props.form.setValue(
                  `selection.${props.variantOption.name}`,
                  ""
                );
              }
            }}
          >
            {optionLabelSimplified}
            {optionDetail}
          </Toggle>
        );
      })}
    </div>
  );
};
