/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DiscountMethodType,
  DiscountType,
  DiscountValueType,
  type Collection,
  type Product,
} from "@prisma/client";
import { Command as CommandPrimitive } from "cmdk";
import { CalendarIcon, Trash, X } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Heading } from "~/components/ui/heading";
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";
// import ImageLoader from "~/components/ui/image-loader";

import { Input } from "~/components/ui/input";

import { Separator } from "~/components/ui/separator";

import { BackToButton } from "~/components/common/buttons/back-to-button";

import { Textarea } from "~/components/ui/textarea";

import { format } from "date-fns";
import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { EditSection } from "~/components/common/sections/edit-section.admin";
import { Badge } from "~/components/ui/badge";
import { Calendar } from "~/components/ui/calendar";
import { Command, CommandGroup, CommandItem } from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import { discountFormSchema } from "../schemas";
import type { DiscountFormValues, SingleDiscount } from "../types";
interface FormProps {
  initialData: SingleDiscount | null;
}

export const DiscountForm: React.FC<FormProps> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();

  const { storeId, discountId } = params.query as {
    storeId: string;
    discountId: string;
  };

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit discount" : "Create discount";
  const description = initialData ? "Edit a discount." : "Add a new discount";
  const toastMessage = initialData ? "Discount updated." : "Discount created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = {
    startDate: initialData?.startDate ?? new Date(),
    endDate: initialData?.endDate ?? undefined,
    code: initialData?.code ?? "",
    active: initialData?.active ?? false,
    stackable: initialData?.stackable ?? false,
    value: initialData?.value ?? 0,
    type: initialData?.type ?? "GLOBAL",
    valueType: initialData?.valueType ?? "PERCENTAGE",
    methodType: initialData?.methodType ?? "SALE",
    minValue: initialData?.minValue ?? undefined,
    maxValue: initialData?.maxValue ?? undefined,
    products: initialData?.products ?? [],
    collections: initialData?.collections ?? [],
  };

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues,
  });

  const apiContext = api.useContext();

  const products = api.products.getAllStoreProducts.useQuery({});
  const collections = api.collections.getAllCollections.useQuery({});

  const updateDiscount = api.discounts.updateDiscount.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error) =>
      toastService.error(
        "Something went wrong with updating. Please try again later.",
        error
      ),
    onSettled: async () => {
      router.push(`/admin/${params.query.storeId as string}/discounts`);
      await apiContext.discounts.invalidate();
    },
  });

  const createDiscount = api.discounts.createDiscount.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error) =>
      toastService.error(
        "Something went wrong with creating. Please try again later.",
        error
      ),
    onSettled: async () => {
      router.push(`/admin/${params.query.storeId as string}/discounts`);
      await apiContext.discounts.invalidate();
    },
  });

  const deleteDiscount = api.discounts.deleteDiscount.useMutation({
    onSuccess: () => toastService.success("Discount was successfully deleted."),
    onError: (error) =>
      toastService.error(
        "Something went wrong with deleting. Please try again later.",
        error
      ),

    onSettled: async () => {
      setOpen(false);
      router.push(`/admin/${params.query.storeId as string}/discounts`);
      await apiContext.discounts.invalidate();
    },
  });

  const loading =
    updateDiscount.isLoading ||
    createDiscount.isLoading ||
    deleteDiscount.isLoading;

  const onSubmit = (data: DiscountFormValues) => {
    if (initialData) {
      updateDiscount.mutate({
        ...data,
        id: params.query.discountId as string,
        maxValue:
          data.maxValue === 0 || data.maxValue === undefined
            ? undefined
            : data.maxValue,
      });
    } else {
      createDiscount.mutate({
        ...data,
        storeId: params.query.storeId as string,
        maxValue:
          data.maxValue === 0 || data.maxValue === undefined
            ? undefined
            : data.maxValue,
      });
    }
  };

  const onDelete = () =>
    deleteDiscount.mutate({ id: params.query.discountId as string });

  const inputRef = useRef<HTMLInputElement>(null);
  const [productsOpen, setProductsOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback((product: Product) => {
    const current = form
      .getValues("products")
      .filter((s) => s.id !== product.id);
    form.setValue("products", current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelected = [...form.getValues("products")];
            newSelected.pop();

            form.setValue("products", newSelected);
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const selectables = useMemo(() => {
    const currentIds = form.getValues("products").map((p) => p.id);
    return products?.data?.filter(
      (product) => !currentIds.includes(product.id)
    );
  }, [products?.data, form.watch("products")]);

  const inputCollectionsRef = useRef<HTMLInputElement>(null);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const [inputCollectionsValue, setInputCollectionsValue] = useState("");

  const handleCollectionsUnselect = useCallback((collection: Collection) => {
    const current = form
      .getValues("collections")
      .filter((s) => s.id !== collection.id);
    form.setValue("collections", current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCollectionsKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputCollectionsRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelected = [...form.getValues("collections")];
            newSelected.pop();

            form.setValue("collections", newSelected);
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const selectablesCollections = useMemo(() => {
    const currentIds = form.getValues("collections").map((p) => p.id);
    return collections?.data?.filter(
      (product) => !currentIds.includes(product.id)
    );
  }, [collections?.data, form.watch("collections")]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
          <AdminFormHeader
            title={title}
            description={description}
            contentName="Discount"
            link={`/admin/${storeId}/discounts/${discountId ?? ""}`}
          >
            {initialData && (
              <AlertModal
                isOpen={open}
                setIsOpen={setOpen}
                onConfirm={onDelete}
                loading={loading}
                asChild={true}
              />
            )}

            <Button disabled={loading} className="ml-auto" type="submit">
              {action}
            </Button>
          </AdminFormHeader>

          <AdminFormBody className="flex w-full flex-col gap-4 space-y-4">
            <EditSection
              title="Details"
              description="What is the discount and how is it being used?"
            >
              <div className="my-5 gap-8 md:grid md:grid-cols-6 ">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Code</FormLabel>

                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="e.g. SUMMER-SALE-2024"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Sales get this code applied automatically.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="e.g. Cool new blog post!"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Defaults to title if left blank. The url of your blog
                        post.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valueType"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Value Type</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select what type your discount is"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(DiscountValueType).map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Decide whether the discount is a percentage or a fixed
                        dollar amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Discount Value</FormLabel>
                      <FormControl>
                        <div className="relative ">
                          {form.watch("valueType") === "FIXED" && (
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">
                                $
                              </span>
                            </div>
                          )}

                          <Input
                            type="number"
                            disabled={loading}
                            className={cn(
                              "block w-full rounded-md py-1.5  text-gray-900     sm:text-sm sm:leading-6",
                              form.watch("valueType") === "FIXED" && "pl-7",
                              form.watch("valueType") === "PERCENTAGE" &&
                                "pr-14"
                            )}
                            placeholder="0.00"
                            {...field}
                          />

                          {form.watch("valueType") === "PERCENTAGE" && (
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <span className="py-0 pl-2 pr-7 text-gray-500 sm:text-sm">
                                %
                              </span>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        How much is the discount for?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="methodType"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Method Type</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select what type your discount is"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(DiscountMethodType).map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Decide whether the discount is automatic or requires the
                        code.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="col-span-3 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active?</FormLabel>
                        <FormDescription>
                          If active, the code will be live and usable.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stackable"
                  render={({ field }) => (
                    <FormItem className="col-span-3 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is the discount stackable?</FormLabel>
                        <FormDescription>
                          If active, the code will stack with other discounts
                          also stackable.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </EditSection>

            <EditSection
              title="Restrictions"
              description="How can this discount be used?"
            >
              <div className="my-5 gap-8 md:grid md:grid-cols-6 ">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="col-span-3 flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When is this code valid from?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="col-span-3 flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When is this code valid to?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minValue"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Minimum Value (optional)</FormLabel>
                      <FormControl>
                        <div className="relative ">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>

                          <Input
                            type="number"
                            disabled={loading}
                            className={cn(
                              "block w-full rounded-md py-1.5  text-gray-900     sm:text-sm sm:leading-6",
                              "pl-7"
                            )}
                            placeholder="0.00"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Is there a minimum value for the discount to apply?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="maxValue"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Maximum Value(optional)</FormLabel>
                      <FormControl>
                        <div className="relative ">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>

                          <Input
                            type="number"
                            disabled={loading}
                            className={cn(
                              "block w-full rounded-md py-1.5  text-gray-900     sm:text-sm sm:leading-6",
                              "pl-7"
                            )}
                            placeholder="0.00"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Is there a maximum value for the discount to apply?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Discount applies to:</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select what type your discount is"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(DiscountType).map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      <FormDescription>
                        Where does this discount apply?
                      </FormDescription>
                    </FormItem>
                  )}
                />
                {form.watch("type") === "PER_PRODUCT" && (
                  <FormField
                    control={form.control}
                    name="products"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Products</FormLabel>
                        <FormControl>
                          <Command
                            onKeyDown={handleKeyDown}
                            className="overflow-visible bg-transparent"
                          >
                            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                              <div className="flex flex-wrap gap-1">
                                {field.value.map((product) => {
                                  return (
                                    <Badge
                                      key={(product as Product).name}
                                      variant="secondary"
                                    >
                                      {(product as Product).name}
                                      <button
                                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        aria-label={(product as Product).name}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            handleUnselect(product as Product);
                                          }
                                        }}
                                        onMouseDown={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }}
                                        onClick={() =>
                                          handleUnselect(product as Product)
                                        }
                                      >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                      </button>
                                    </Badge>
                                  );
                                })}
                                {/* Avoid having the "Search" Icon */}
                                <CommandPrimitive.Input
                                  ref={inputRef}
                                  value={inputValue}
                                  onValueChange={setInputValue}
                                  onBlur={() => setProductsOpen(false)}
                                  onFocus={() => setProductsOpen(true)}
                                  placeholder={
                                    products?.data?.length === 0
                                      ? "Add some products first."
                                      : "Select products..."
                                  }
                                  disabled={products?.data?.length === 0}
                                  className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                                />
                              </div>
                            </div>
                            <div className="relative mt-2">
                              {productsOpen &&
                              selectables &&
                              selectables?.length > 0 ? (
                                <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                                  <CommandGroup className="h-full overflow-auto">
                                    {selectables?.map((product) => {
                                      return (
                                        <CommandItem
                                          key={product.name}
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                          }}
                                          onSelect={() => {
                                            setInputValue("");
                                            form.setValue("products", [
                                              ...field.value,
                                              product,
                                            ]);
                                          }}
                                          className={"cursor-pointer"}
                                        >
                                          {product.name}
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </div>
                              ) : null}
                            </div>
                          </Command>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {form.watch("type") === "PER_COLLECTION" && (
                  <FormField
                    control={form.control}
                    name="collections"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Collections</FormLabel>
                        <FormControl>
                          <Command
                            onKeyDown={handleCollectionsKeyDown}
                            className="overflow-visible bg-transparent"
                          >
                            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                              <div className="flex flex-wrap gap-1">
                                {field.value.map((product) => {
                                  return (
                                    <Badge
                                      key={(product as Collection).name}
                                      variant="secondary"
                                    >
                                      {(product as Collection).name}
                                      <button
                                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        aria-label={
                                          (product as Collection).name
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            handleCollectionsUnselect(
                                              product as Collection
                                            );
                                          }
                                        }}
                                        onMouseDown={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }}
                                        onClick={() =>
                                          handleCollectionsUnselect(
                                            product as Collection
                                          )
                                        }
                                      >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                      </button>
                                    </Badge>
                                  );
                                })}
                                {/* Avoid having the "Search" Icon */}
                                <CommandPrimitive.Input
                                  ref={inputCollectionsRef}
                                  value={inputCollectionsValue}
                                  onValueChange={setInputCollectionsValue}
                                  onBlur={() => setCollectionsOpen(false)}
                                  onFocus={() => setCollectionsOpen(true)}
                                  placeholder={
                                    collections?.data?.length === 0
                                      ? "Add some collections first."
                                      : "Select collections..."
                                  }
                                  disabled={collections?.data?.length === 0}
                                  className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                                />
                              </div>
                            </div>
                            <div className="relative mt-2">
                              {collectionsOpen &&
                              selectablesCollections &&
                              selectablesCollections?.length > 0 ? (
                                <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                                  <CommandGroup className="h-full overflow-auto">
                                    {selectablesCollections?.map((product) => {
                                      return (
                                        <CommandItem
                                          key={product.name}
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                          }}
                                          onSelect={() => {
                                            setInputValue("");
                                            form.setValue("collections", [
                                              ...field.value,
                                              product,
                                            ]);
                                          }}
                                          className={"cursor-pointer"}
                                        >
                                          {product.name}
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </div>
                              ) : null}
                            </div>
                          </Command>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </EditSection>
          </AdminFormBody>
        </form>
      </Form>
    </>
  );
};
