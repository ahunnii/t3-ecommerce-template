/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import type { Tag } from "@prisma/client";

import { Trash } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { AlertModal } from "~/components/admin/modals/alert-modal";
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
// import ImageLoader from "~/components/ui/image-loader";

import { Input } from "~/components/ui/input";

import { Separator } from "~/components/ui/separator";
import { TagInput } from "~/components/ui/tag-input";

import { BackToButton } from "~/components/common/buttons/back-to-button";
import MarkdownEditor from "~/components/common/inputs/markdown-editor";
import ImageUpload from "~/services/image-upload/components/image-upload";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import type { BlogPost } from "../types";

const formSchema = z.object({
  title: z.string().min(1),
  featuredImg: z.string().optional(),
  tags: z.array(z.object({ name: z.string(), id: z.string() })),
  content: z.string(),
  author: z.string().optional(),
  slug: z.string().optional(),
  published: z.boolean(),
});

type BlogPostFormValues = z.infer<typeof formSchema>;

interface BlogPostFormProps {
  initialData: BlogPost | null;
}

export const BlogPostForm: React.FC<BlogPostFormProps> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();

  const { storeId, blogPostId } = params.query as {
    storeId: string;
    blogPostId: string;
  };

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit blog post" : "Create blog post";
  const description = initialData ? "Edit a blog post." : "Add a new blog post";
  const toastMessage = initialData
    ? "Blog post updated."
    : "Blog post created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = {
    title: initialData?.title ?? "",
    featuredImg: initialData?.featuredImg ?? undefined,
    content: initialData?.content ?? "",
    author: initialData?.author ?? "",
    slug: initialData?.slug ?? "",
    published: initialData?.published ?? false,
    tags: initialData?.tags ?? [],
  };

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const apiContext = api.useContext();

  const { mutate: updateBlogPost } = api.blogPosts.updateBlogPost.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error) =>
      toastService.error(
        "Something went wrong with updating. Please try again later.",
        error
      ),
    onMutate: () => setLoading(true),
    onSettled: async () => {
      setLoading(false);
      router.push(`/admin/${params.query.storeId as string}/blog-posts`);
      await apiContext.blogPosts.invalidate();
    },
  });

  const { mutate: createBlogPost } = api.blogPosts.createBlogPost.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error) =>
      toastService.error(
        "Something went wrong with creating. Please try again later.",
        error
      ),
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
      router.push(`/admin/${params.query.storeId as string}/blog-posts`);
    },
  });

  const { mutate: deleteBlogPost } = api.blogPosts.deleteBlogPost.useMutation({
    onSuccess: () => toastService.success("Product deleted."),
    onError: (error) =>
      toastService.error(
        "Something went wrong with deleting. Please try again later.",
        error
      ),
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
      setOpen(false);
      router.push(`/admin/${params.query.storeId as string}/blog-posts`);
    },
  });

  const onSubmit = (data: BlogPostFormValues) => {
    if (initialData) {
      updateBlogPost({
        ...data,
        slug: data?.slug
          ? data?.slug.toLowerCase().replace(/ /g, "-")
          : undefined,
        storeId: params.query.storeId as string,
        blogPostId: params.query.blogPostId as string,
      });
    } else {
      createBlogPost({
        ...data,
        slug: data?.slug
          ? data?.slug.toLowerCase().replace(/ /g, "-")
          : undefined,
        storeId: params.query.storeId as string,
      });
    }
  };

  const onDelete = () => {
    deleteBlogPost({
      storeId: params.query.storeId as string,
      blogPostId: params.query.productId as string,
    });
  };

  const [tags, setTags] = useState<{ name: string; id: string }[]>(
    initialData?.tags ?? []
  );

  const { setValue } = form;

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />{" "}
      <BackToButton
        link={`/admin/${storeId}/blog-posts/${blogPostId ?? ""}`}
        title="Back to Blog Post"
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="w-full space-y-8"
        >
          <section className="flex w-full gap-4 max-lg:flex-col">
            <div className="flex w-full flex-col space-y-4 lg:w-8/12">
              <div className="w-full  rounded-md border border-border bg-background/50 p-4 ">
                <FormLabel>Details</FormLabel>{" "}
                <FormDescription>
                  Write to your heart&apos;s content.
                </FormDescription>
                <div className="my-5 gap-8 md:grid md:grid-cols-2 ">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="e.g. Cool new blog post!"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input
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
                    name="content"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <MarkdownEditor
                            description={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="col-span- flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Published?</FormLabel>
                          <FormDescription>
                            If published, the blog post will appear on the site
                            for everyone.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>{" "}
              </div>

              <div className="w-full rounded-md border border-border bg-background/50 p-4 ">
                <FormLabel>Attributes</FormLabel>{" "}
                <FormDescription className="pb-5">
                  Used for searching, SEO, and other info on blogs.
                </FormDescription>
                <div className="my-5 gap-8 md:grid md:grid-cols-2 ">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="col-span-full flex flex-col items-start">
                        <FormLabel className="text-left">Tags</FormLabel>
                        <FormControl>
                          <TagInput
                            {...field}
                            placeholder="Enter a topic"
                            tags={tags}
                            className="sm:min-w-[450px]"
                            setTags={(newTags) => {
                              setTags(newTags);
                              setValue("tags", newTags as [Tag, ...Tag[]]);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Anything you want to associate this blog with?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col lg:w-4/12">
              <FormField
                control={form.control}
                name="featuredImg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>{" "}
                    <FormDescription>
                      Used to represent your blog on social media and other
                      sharing
                    </FormDescription>
                    <FormControl>
                      {/* <>
                    {!initialData?.images && <ImageLoader />} */}
                      <ImageUpload
                        value={field.value ? [field.value] : []}
                        disabled={loading}
                        onChange={(url) => {
                          return field.onChange(url);
                        }}
                        onRemove={() => form.setValue("featuredImg", "")}
                      />
                      {/* </> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
            </div>
          </section>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
