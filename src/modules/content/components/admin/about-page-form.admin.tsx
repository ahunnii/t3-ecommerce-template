import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
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

import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";

import { EditSection } from "~/components/common/sections/edit-section.admin";

import { Checkbox } from "~/components/ui/checkbox";

import MarkdownEditor from "~/components/common/inputs/markdown-editor";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import { aboutPageSchema } from "../../schema";
import type { AboutPageFormValues, BasicGraphQLPage } from "../../types";

type Props = {
  initialData: BasicGraphQLPage | null;
};

export const AboutPageForm: React.FC<Props> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const apiContext = api.useContext();

  const { storeId, contentSlug } = params.query as {
    storeId: string;
    contentSlug: string;
  };

  const [open, setOpen] = useState(false);

  const title = initialData
    ? `Edit ${initialData?.page?.slug.replace("-", " ")} Page `
    : "Create the Page";
  const description = initialData ? "Edit the page." : "Add a new page";
  const toastMessage = initialData ? "Page updated." : "Page created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<AboutPageFormValues>({
    resolver: zodResolver(aboutPageSchema),
    defaultValues: {
      title: initialData?.page?.title ?? "",
      content: initialData?.page?.content ?? "",
      slug: initialData?.page?.slug ?? "",
    },
  });

  const updateSinglePage = api.content.updatePage.useMutation({
    onSuccess: () => {
      toastService.success(toastMessage);
      router.push(`/admin/${storeId}/content`);
    },
    onError: (error) =>
      toastService.error("Something went wrong with updating the page.", error),

    onSettled: () => {
      void apiContext.content.invalidate();
    },
  });

  const createSinglePage = api.content.createPage.useMutation({
    onSuccess: () => {
      toastService.success(toastMessage);
      router.push(`/admin/${storeId}/content`);
    },
    onError: (error) =>
      toastService.error("Something went wrong with updating the page.", error),

    onSettled: () => {
      void apiContext.content.invalidate();
    },
  });

  const deleteSinglePage = api.content.deletePage.useMutation({
    onSuccess: () => {
      toastService.success("Page was successfully deleted");
      router.push(`/admin/${storeId}/content`);
    },
    onError: (error) =>
      toastService.error("Something went wrong with deleting the page.", error),

    onSettled: () => {
      void apiContext.content.invalidate();
    },
  });

  const onDelete = () => deleteSinglePage.mutate({ slug: contentSlug });

  const onSubmit = (data: AboutPageFormValues) => {
    if (initialData) {
      updateSinglePage.mutate({
        ...data,
      });
    } else {
      createSinglePage.mutate({
        ...data,
      });
    }
  };

  const loading =
    updateSinglePage.isLoading ||
    createSinglePage.isLoading ||
    deleteSinglePage.isLoading;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <AdminFormHeader
            title={title}
            description={description}
            contentName="Content"
            link={`/admin/${storeId}/content`}
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
            <div className={cn("flex w-full flex-col space-y-4 ")}>
              <EditSection
                title="Page Content"
                description="Write to your heart's content"
                bodyClassName="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!initialData && (
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Slug" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
              </EditSection>
            </div>
          </AdminFormBody>{" "}
        </form>
      </Form>
    </>
  );
};
