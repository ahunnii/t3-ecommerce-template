import Link from "next/link";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import * as Form from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import StorefrontLayout from "~/layouts/storefront-layout";

import { api } from "~/utils/api";

import { SEO } from "~/shop/custom/components/seo-head";
import { storeTheme } from "~/shop/custom/config";

const emailSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  body: z.string(),
  images: z.object({ url: z.string() }).array().optional(),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export const ContactUsPage = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: undefined,
      name: undefined,
      body: undefined,
      images: [],
    },
  });

  const { mutate: sendEmail } = api.email.sendEmailInquiry.useMutation({
    onSuccess: () => {
      toast.success("Email sent. We will get back to you shortly.");
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
    },
  });

  const onSubmit = (values: EmailFormValues) => {
    sendEmail(values);
  };
  return (
    <>
      <SEO
        title={`Contact Us | Trend Anomaly`}
        description={
          "Contact Us for any questions, concerns, or custom orders."
        }
      />
      <StorefrontLayout
        bodyStyle="items-center justify-center flex"
        {...storeTheme.layout}
      >
        <div className="flex h-full flex-grow place-content-center items-center justify-center ">
          <div className=" my-auto flex flex-col-reverse gap-y-8 space-y-10  px-4  py-10  max-md:items-center sm:px-6  md:flex-row lg:px-8">
            <div className="justify-left mx-auto flex w-full flex-col gap-y-3 max-md:p-4 md:w-6/12">
              <>
                {" "}
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Contact Us
                </h1>
                <p className="leading-7 ">
                  Got a question? Need help with an order? Want to let us know
                  your thoughts on a product or collection? Send us a message
                  using the contact form below, or just shoot an email to
                  store@trendanomaly.com.
                </p>
                <Form.Form {...form}>
                  <form
                    onSubmit={(event) =>
                      void form.handleSubmit(onSubmit)(event)
                    }
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
                              placeholder="e.g. janedoe@example.com"
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
                              placeholder="e.g. Jane Doe"
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
                              placeholder="e.g. Hey! I had a question about a product."
                              {...field}
                            />
                          </Form.FormControl>
                          <Form.FormMessage />
                        </Form.FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="ml-auto w-full bg-purple-600 hover:bg-purple-500"
                    >
                      Email Us
                    </Button>
                  </form>
                </Form.Form>
              </>

              <p></p>

              <div className="flex w-full justify-between py-4">
                <div className="text-left">
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Location
                  </h4>
                  <p>Southfield, MI 48034</p>
                </div>
                <div className="text-left">
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Hours
                  </h4>
                  <p>Sunday CLOSED</p>
                  <p>Mon - Sat 10am - 6pm</p>
                </div>
                <div className="text-left">
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Follow Us
                  </h4>
                  <div className="flex  gap-1.5 ">
                    <Link
                      href="https://www.instagram.com/trendanomaly/?hl=en"
                      target="_blank"
                    >
                      <Button
                        variant="outline"
                        className="group  aspect-square rounded-full p-0"
                      >
                        {" "}
                        <Instagram className="h-6 w-6 text-black transition-all duration-150 ease-linear group-hover:text-purple-500" />
                      </Button>
                    </Link>{" "}
                    <Link href="/">
                      <Button
                        variant="outline"
                        className="group  aspect-square rounded-full p-0"
                      >
                        {" "}
                        <Facebook className="h-6 w-6 text-black transition-all duration-150 ease-linear group-hover:text-purple-500" />
                      </Button>
                    </Link>{" "}
                    <Link href="/">
                      <Button
                        variant="outline"
                        className="group  aspect-square rounded-full p-0"
                      >
                        {" "}
                        <Twitter className="h-6 w-6 text-black transition-all duration-150 ease-linear group-hover:text-purple-500" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StorefrontLayout>{" "}
    </>
  );
};
