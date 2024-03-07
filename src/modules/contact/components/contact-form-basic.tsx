import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import * as Form from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { useConfig } from "~/providers/style-config-provider";

import { cn } from "~/utils/styles";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import {
  contactFormSchema,
  type ContactFormValues,
} from "~/modules/contact/types";

type TContactFormBasicProps = {
  onSubmit: (values: ContactFormValues) => void;
  clearForm?: boolean;
  setClearForm?: (value: boolean) => void;
  loading?: boolean;
};

const formPlaceholders = {
  email: "e.g. janedoe@example.com",
  name: "e.g. Jane Doe",
  body: "e.g. Hey! I had a question about a product.",
  submit: "Email Us",
};

export const ContactFormBasic = ({
  onSubmit,
  clearForm,
  setClearForm,
  loading = false,
}: TContactFormBasicProps) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),

    defaultValues: {
      email: "",
      name: "",
      body: "",
      images: [],
    },
  });

  const config = useConfig();

  useEffect(() => {
    if (clearForm) {
      form.reset();
      setClearForm?.(false);
    }
  }, [clearForm, form]);
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
        />
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
