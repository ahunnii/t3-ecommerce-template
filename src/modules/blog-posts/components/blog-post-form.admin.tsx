/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import type { Tag } from "@prisma/client";

import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
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
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

import { Input } from "~/components/ui/input";

import { TagInput } from "~/components/ui/tag-input";

import { AdminFormHeader } from "~/components/common/admin/admin-form-header";

import MarkdownEditor from "~/components/common/inputs/markdown-editor";
import { EditSection } from "~/components/common/sections/edit-section.admin";
import ImageUpload from "~/services/image-upload/components/image-upload";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";

import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { blogPostFormSchema } from "../schema";
import type { BlogPost, BlogPostFormValues } from "../types";

type Props = { initialData: BlogPost | null };

export const BlogPostForm: React.FC<Props> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();

  const { storeId, blogPostId } = params.query as {
    storeId: string;
    blogPostId: string;
  };

  const [open, setOpen] = useState(false);

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
    resolver: zodResolver(blogPostFormSchema),
    defaultValues,
  });

  const apiContext = api.useContext();

  const updateBlogPost = api.blogPosts.updateBlogPost.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error) =>
      toastService.error(
        "Something went wrong with updating your post. Please try again.",
        error
      ),
    onSettled: () => {
      router.push(`/admin/${storeId}/blog-posts`);
      void apiContext.blogPosts.invalidate();
    },
  });

  const createBlogPost = api.blogPosts.createBlogPost.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error) =>
      toastService.error(
        "Something went wrong with creating your post. Please try again.",
        error
      ),

    onSettled: () => {
      router.push(`/admin/${storeId}/blog-posts`);
      void apiContext.blogPosts.invalidate();
    },
  });

  const deleteBlogPost = api.blogPosts.deleteBlogPost.useMutation({
    onSuccess: () => toastService.success("Product deleted."),
    onError: (error) =>
      toastService.error(
        "Something went wrong with deleting. Please try again later.",
        error
      ),

    onSettled: () => {
      setOpen(false);
      router.push(`/admin/${storeId}/blog-posts`);
      void apiContext.blogPosts.invalidate();
    },
  });

  const loading =
    updateBlogPost.isLoading ||
    createBlogPost.isLoading ||
    deleteBlogPost.isLoading;

  const onSubmit = (data: BlogPostFormValues) => {
    if (initialData) {
      updateBlogPost.mutate({
        ...data,
        slug: data?.slug
          ? data?.slug.toLowerCase().replace(/ /g, "-")
          : undefined,
        storeId,
        blogPostId,
      });
    } else {
      createBlogPost.mutate({
        ...data,
        slug: data?.slug
          ? data?.slug.toLowerCase().replace(/ /g, "-")
          : undefined,
        storeId,
      });
    }
  };

  const onDelete = () => deleteBlogPost.mutate({ blogPostId });

  const [tags, setTags] = useState<{ name: string; id: string }[]>(
    initialData?.tags ?? []
  );

  const { setValue } = form;

  return (
    <>
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
          <AdminFormHeader
            title={title}
            description={description}
            contentName="Blog Posts"
            link={`/admin/${storeId}/blog-posts`}
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
          <AdminFormBody className="mx-auto max-w-7xl space-y-0 lg:flex-col xl:flex-row">
            <div className="flex w-full flex-col space-y-4 lg:w-8/12">
              <EditSection
                title="Details"
                description=" Write to your heart's content."
                className="bg-white shadow-sm"
              >
                <div className=" grid gap-8 md:grid-cols-2 ">
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
                        <FormLabel>Slug (optional)</FormLabel>
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
                      <FormItem className="col-span-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
              </EditSection>
            </div>
            <div className="flex w-full flex-col space-y-4 lg:w-4/12">
              <EditSection
                title="Media"
                description="Images, videos, and more associated with the post."
              >
                <FormField
                  control={form.control}
                  name="featuredImg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image (optional)</FormLabel>{" "}
                      <FormDescription>
                        Used to represent your blog on social media and other
                        sharing
                      </FormDescription>
                      <FormControl>
                        <ImageUpload
                          value={field.value ? [field.value] : []}
                          disabled={loading}
                          onChange={(url) => {
                            return field.onChange(url);
                          }}
                          onRemove={() => form.setValue("featuredImg", "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
              </EditSection>
              <EditSection
                title="Attributes"
                description="Used for searching, SEO, and other info on blogs."
              >
                <div className="my-5 gap-8 md:grid md:grid-cols-2 ">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="col-span-full flex flex-col items-start">
                        <FormLabel className="text-left">
                          Tags (optional)
                        </FormLabel>
                        <FormControl>
                          <TagInput
                            {...field}
                            placeholder="Enter a tag name and press enter."
                            tags={tags}
                            className="w-full"
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
              </EditSection>
            </div>
          </AdminFormBody>
        </form>
      </Form>
    </>
  );
};
