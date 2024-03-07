import type { Variation } from "~/types";

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

export const calculateVariantDetails = (props: {
  optionName: string;
  selection: Record<string, string>;
  givenOption: string;
  productVariants: Variation[];
}) => {
  // Prepare the array of currently selected attribute values, including the current 'props.variantOption.name'
  const attributeValues = Object.entries(props.selection)
    .map(([key, value]) => {
      return key === props.optionName ? props.givenOption : value; // Replace the current field's value with the option
    })
    .filter(Boolean); // Filter out any undefined or empty strings

  // Find the matching variant based on current and new selection
  const matchingVariant = getVariantByAttributes(
    attributeValues,
    props.productVariants || []
  );

  const variantAvailable = matchingVariant
    ? matchingVariant.quantity > 0
    : false;
  const variantPrice = matchingVariant ? matchingVariant.price : null;
  const isSelected = props.selection[props.optionName] === props.givenOption;
  const isSelectable = variantAvailable && variantPrice !== null;

  const optionLabel = `${props.givenOption} ${
    variantPrice !== null ? `- $${variantPrice.toFixed(2)}` : ""
  }`;

  const optionLabelSimplified = `${props.givenOption}`;
  const optionDetail = !variantAvailable
    ? " - Out of stock"
    : isSelected
    ? ``
    : "";

  return {
    variantAvailable,
    variantPrice,
    isSelected,
    isSelectable,
    optionLabel,
    optionDetail,
    optionLabelSimplified,
  };
};
