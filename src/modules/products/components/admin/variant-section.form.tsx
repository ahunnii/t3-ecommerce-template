import { useMemo, type FC } from "react";

import { Trash } from "lucide-react";
import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { FormDescription, FormField, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ProductFormValues } from "../../types";

type Props = {
  form: UseFormReturn<ProductFormValues>;
};

export const VariantProductFormSection = ({ form }: Props) => {
  //   const { fields, remove, replace } = useFieldArray({
  //     control: form.control,
  //     name: "variants",
  //   });

  //   const handleGenerateVariations = () => {
  //     function splitValues(attribute: Attribute): string[] {
  //       return attribute.values.split(";");
  //     }

  //     function cartesianProduct(
  //       sets: string[][],
  //       prefix: string[] = []
  //     ): string[][] {
  //       if (!sets.length) {
  //         return [prefix];
  //       }

  //       const resultSet: string[][] = [];
  //       const [currentSet, ...remainingSets] = sets;

  //       for (const item of currentSet!) {
  //         const newPrefix = [...prefix, item];
  //         const productOfRemaining = cartesianProduct(remainingSets, newPrefix);
  //         resultSet.push(...productOfRemaining);
  //       }

  //       return resultSet;
  //     }

  //     const attributeValues = currentAttributes.map(splitValues);

  //     const test = cartesianProduct(attributeValues);

  //     const generatedVariations = test.map((variation) => ({
  //       names: currentAttributes.map((attribute) => attribute.name).join(", "),
  //       values: variation.join(", "),
  //       price: form.getValues("price"),
  //       quantity: 1,
  //     }));

  //     return generatedVariations;
  //   };

  return null;
  //   return (
  //     <div className="w-full rounded-md border border-border bg-background/50 p-4 ">
  //       <FormField
  //         control={form.control}
  //         name="variants"
  //         render={({ field }) => (
  //           <>
  //             <FormLabel>Variations</FormLabel>{" "}
  //             <FormDescription>
  //               Create variations for customers to choose from. Note that these
  //               will override your default values above.
  //             </FormDescription>
  //             {category === undefined ? (
  //               <p className="leading-7 text-primary [&:not(:first-child)]:mt-6">
  //                 Choose a category first
  //               </p>
  //             ) : (
  //               <div className="my-5 flex gap-5">
  //                 <Button
  //                   variant={"secondary"}
  //                   className="my-2"
  //                   type="button"
  //                   onClick={() => replace(handleGenerateVariations())}
  //                 >
  //                   Generate Variations
  //                 </Button>
  //                 <Button
  //                   variant={"destructive"}
  //                   className="my-2"
  //                   type="button"
  //                   onClick={() => replace([])}
  //                 >
  //                   Delete all Variations
  //                 </Button>
  //               </div>
  //             )}
  //             {field.value.length > 0 && (
  //               <div className="my-5 max-h-96 overflow-y-auto">
  //                 <Table>
  //                   <TableHeader>
  //                     <TableRow>
  //                       {/* <TableHead className="w-[100px]">ID</TableHead> */}
  //                       {currentAttributes.length > 0 &&
  //                         currentAttributes
  //                           .map((attribute) => attribute.name)
  //                           .map((name) => (
  //                             <TableHead key={name}>{name}</TableHead>
  //                           ))}
  //                       <TableHead className="">Quantity</TableHead>
  //                       <TableHead>$ Price</TableHead>
  //                       <TableHead className="text-right">
  //                         Delete Variant
  //                       </TableHead>
  //                     </TableRow>
  //                   </TableHeader>
  //                   <TableBody>
  //                     {fields.map((item, index) => (
  //                       <TableRow key={item.id}>
  //                         {/* <TableCell className="font-medium">
  //                     VAR00{index}
  //                   </TableCell> */}
  //                         {item?.values?.split(", ").map((name) => (
  //                           <TableCell key={name}>{name}</TableCell>
  //                         ))}
  //                         <TableCell>
  //                           <Controller
  //                             render={({ field }) => (
  //                               <Input
  //                                 {...field}
  //                                 type="number"
  //                                 placeholder="Attribute (e.g., Size)"
  //                                 onChange={(e) =>
  //                                   field.onChange(Number(e.target.value))
  //                                 }
  //                               />
  //                             )}
  //                             name={`variants.${index}.quantity`}
  //                             control={form.control}
  //                             defaultValue={Number(item.quantity)}
  //                           />
  //                         </TableCell>
  //                         <TableCell className="text-right">
  //                           {" "}
  //                           <Controller
  //                             render={({ field }) => (
  //                               <Input
  //                                 {...field}
  //                                 type="number"
  //                                 placeholder="Value (e.g., M, Red)"
  //                                 onChange={(e) =>
  //                                   field.onChange(Number(e.target.value))
  //                                 }
  //                               />
  //                             )}
  //                             name={`variants.${index}.price`}
  //                             control={form.control}
  //                             defaultValue={Number(item.price)}
  //                           />{" "}
  //                         </TableCell>
  //                         <TableCell className="text-right">
  //                           <Button
  //                             onClick={() => remove(index)}
  //                             variant="destructive"
  //                           >
  //                             <Trash className="h-4 w-4" />
  //                           </Button>
  //                         </TableCell>
  //                       </TableRow>
  //                     ))}
  //                   </TableBody>
  //                 </Table>
  //               </div>
  //             )}
  //           </>
  //         )}
  //       />
  //     </div>
  //   );
};
