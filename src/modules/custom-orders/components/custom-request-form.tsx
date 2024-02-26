import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import * as Form from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { useConfig } from "~/providers/style-config-provider";

import { cn } from "~/utils/styles";

import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ImageUpload from "~/services/image-upload/components/image-upload";
import {
  customProductOptions,
  customRequestFormSchema,
  type CustomRequestFormValues,
} from "../types";

type TContactFormBasicProps = {
  onSubmit: (values: CustomRequestFormValues) => void;
  loading?: boolean;
};

const formPlaceholders = {
  email: "e.g. janedoe@example.com",
  name: "e.g. Jane Doe",
  body: "e.g. Hey! I had a question about a product.",
  submit: "Email Us",
};

export const CustomRequestForm = ({
  onSubmit,
  loading = false,
}: TContactFormBasicProps) => {
  const form = useForm<CustomRequestFormValues>({
    resolver: zodResolver(customRequestFormSchema),

    defaultValues: {
      email: "",
      name: "",
      body: "",
      productType: undefined,
      images: [],
    },
  });

  const config = useConfig();

  return (
    <Form.Form {...form}>
      <form
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
        className="space-y-5 py-5"
      >
        <Form.FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <Form.FormItem className=" sm:col-span-3">
              <Form.FormLabel className="label">
                <span className="label-text text-error">Email</span>
              </Form.FormLabel>
              <Form.FormControl>
                <Input
                  disabled={loading}
                  placeholder={formPlaceholders.email}
                  {...field}
                />
              </Form.FormControl>
              <Form.FormMessage />
            </Form.FormItem>
          )}
        />{" "}
        <Form.FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <Form.FormItem className=" sm:col-span-3">
              {" "}
              <Form.FormLabel className="label">
                <span className="label-text text-error">Name</span>
              </Form.FormLabel>
              <Form.FormControl>
                <Input
                  disabled={loading}
                  placeholder={formPlaceholders.name}
                  {...field}
                />
              </Form.FormControl>
              <Form.FormMessage />
            </Form.FormItem>
          )}
        />{" "}
        <Form.FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <Form.FormItem className=" sm:col-span-3">
              {" "}
              <Form.FormLabel className="label">
                <span className="label-text text-error">Name</span>
              </Form.FormLabel>
              <Form.FormControl>
                <Input
                  disabled={loading}
                  placeholder={formPlaceholders.name}
                  {...field}
                />
              </Form.FormControl>
              <Form.FormMessage />
            </Form.FormItem>
          )}
        />
        <Form.FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <Form.FormItem>
              <Form.FormLabel>Product Type</Form.FormLabel>
              <Select
                disabled={loading}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <Form.FormControl>
                  <SelectTrigger>
                    <SelectValue
                      defaultValue={field.value}
                      placeholder="Select a category"
                    />
                  </SelectTrigger>
                </Form.FormControl>
                <SelectContent>
                  {customProductOptions.map((category, idx) => (
                    <SelectItem
                      key={category.value + idx}
                      value={category.value}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Form.FormMessage />
            </Form.FormItem>
          )}
        />
        {/* <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" />
        </div> */}
        <Form.FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <Form.FormItem className=" sm:col-span-3">
              {" "}
              <Form.FormLabel className="label">
                <span className="label-text text-error">Body</span>
              </Form.FormLabel>
              <Form.FormControl>
                <Textarea
                  disabled={loading}
                  placeholder={formPlaceholders.body}
                  {...field}
                />
              </Form.FormControl>
              <Form.FormMessage />
            </Form.FormItem>
          )}
        />
        <Form.FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <Form.FormItem>
              <Form.FormLabel>Images</Form.FormLabel>
              <Form.FormDescription>
                Upload images to help us better understand your request (max of
                3)
              </Form.FormDescription>
              <Form.FormControl>
                {/* <>
                    {!initialData?.images && <ImageLoader />} */}
                <ImageUpload
                  value={field.value.map((image) => image.url)}
                  disabled={loading}
                  onChange={(url) => {
                    return field.onChange([...field.value, { url }]);
                  }}
                  onRemove={(url) =>
                    field.onChange([
                      ...field.value.filter((current) => current.url !== url),
                    ])
                  }
                />
                {/* </> */}
              </Form.FormControl>
              <Form.FormMessage />
            </Form.FormItem>
          )}
        />{" "}
        <Button
          type="submit"
          className={cn("ml-auto w-full", config.contact.submit)}
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {formPlaceholders.submit}
        </Button>
      </form>
    </Form.Form>
  );
};
