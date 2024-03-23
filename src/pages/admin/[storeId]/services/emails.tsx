import type { GetServerSidePropsContext } from "next";
import { useEffect, useState, type FC } from "react";

import { set, uniqueId } from "lodash";
import { CreditCard, DollarSign, Info, Mail, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import AdminLayout from "~/components/layouts/admin-layout";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { env } from "~/env.mjs";
import { AdminCustomRequestNotificationEmailBody } from "~/services/email/email-templates/admin.custom-order-notify";
import { AdminInquiryEmailBody } from "~/services/email/email-templates/admin.inquiry-notify";
import { AdminNewOrderEmailBody } from "~/services/email/email-templates/admin.new-order-notify";
import { CustomOrderAcceptEmailBody } from "~/services/email/email-templates/customer.custom-order-accept";
import {
  CustomerCustomRequestNotificationEmail,
  CustomerCustomRequestNotificationEmailBody,
} from "~/services/email/email-templates/customer.custom-order-notify";
import { CustomerReceiptEmailBody } from "~/services/email/email-templates/customer.receipt";
import { CustomerTrackOrderEmailBody } from "~/services/email/email-templates/customer.track-order";
import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

type EmailTemplateOption = {
  title: string;
  description: string;

  Template: FC;
};

const AdminCustomRequestNotifyEmail = () => (
  <AdminCustomRequestNotificationEmailBody
    firstName="John Doe"
    orderLink="#!"
  />
);

const CustomerCustomRequestNotifyEmail = () => (
  <CustomerCustomRequestNotificationEmailBody firstName="John" />
);

const CustomOrderAcceptEmail = () => (
  <CustomOrderAcceptEmailBody
    name={env.NEXT_PUBLIC_STORE_NAME}
    customerName="Jane Doe"
    email="jane@doe.net"
    productLink="#!"
    invoiceId="123456"
    product="Product Name"
    price="$99.99"
    total="$99.99"
    dueDate="12/31/2021"
    notes="Some notes"
  />
);

const CustomerOrderTrackingEmail = () => (
  <CustomerTrackOrderEmailBody
    orderId="123456"
    orderLink="#!"
    trackingLink="#!"
  />
);

const AdminInquiryEmail = () => (
  <AdminInquiryEmailBody
    question="Random question?"
    userName="John Doe"
    userEmail="test@doe.net"
  />
);

const ReceiptEmail = () => (
  <CustomerReceiptEmailBody
    name="John Doe"
    email="jdoe@test.com"
    orderId="123456"
    orderItems={[
      {
        id: "333333",
        price: 99.99,
        quantity: 1,
        product: {
          id: "123456",
          name: "Product Name",
          featuredImage: "https://via.placeholder.com/150",
        },
        variant: {
          id: "43222",

          values: "S, M",
        },
        discount: {
          description: "Some discount",
        },
      },
    ]}
    subtotal={99.99}
    tax={0}
    shipping={0}
    total={99.99}
    purchaseDate="12/31/2021"
    notes="Some notes"
    storeName="Store Name"
  />
);

const AdminNewOrderEmail = () => <AdminNewOrderEmailBody link="#!" />;
const EmailServicePage: FC = () => {
  const router = useRouter();
  const { storeId } = router.query as {
    storeId: string;
  };

  const [activeTemplate, setActiveTemplate] =
    useState<EmailTemplateOption | null>(null);

  const [open, setOpen] = useState(false);
  const emailTemplates: EmailTemplateOption[] = [
    {
      title: "Admin Custom Request Notification",
      description:
        "This is the email that is sent to the admin when a custom request is made.",

      Template: AdminCustomRequestNotifyEmail,
    },
    {
      title: "Customer Custom Request Notification",
      description:
        "This is the email that is sent to the customer when a custom request is made, notifying them that the request has been received.",

      Template: CustomerCustomRequestNotifyEmail,
    },
    {
      title: "Custom Order Accept Notification",
      description:
        "When a custom order is accepted, the customer then receives this email / invoice.",

      Template: CustomOrderAcceptEmail,
    },
    {
      title: "Order Tracking Notification",
      description:
        "When a fulfillment is created (i.e. creating the shipping label), the customer receives this email with the tracking information.",

      Template: CustomerOrderTrackingEmail,
    },
    {
      title: "Store Inquiry Notification",
      description:
        "When a customer asks a question on the site, this email is sent to the admin.",

      Template: AdminInquiryEmail,
    },
    {
      title: "New Order Notification",
      description:
        "When a customer places an order, this email is sent to the admin.",

      Template: AdminNewOrderEmail,
    },
    {
      title: "Receipt Email (WIP)",
      description:
        "If your payment processor doesn't send a receipt, this email is sent to the customer after a purchase.",

      Template: ReceiptEmail,
    },
  ];

  return (
    <AdminLayout>
      {/* <GalleryForm initialData={null} /> */}

      <EmailDialog
        open={open}
        setOpen={setOpen}
        title={activeTemplate?.title ?? ""}
        description={activeTemplate?.description ?? ""}
        template={
          activeTemplate ?? {
            title: "",
            description: "",

            Template: () => <></>,
          }
        }
      />
      <AdminFormHeader
        title={"Resend / ImprovMX Email Service"}
        description={"Review and manage your emailing service here."}
        contentName="Services"
        link={`/admin/${storeId}/services`}
      ></AdminFormHeader>

      <section className="mx-auto w-full max-w-7xl space-y-4 p-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Wait, two services?</AlertTitle>
          <AlertDescription>
            So in order to keep the cost of emails down, emails are handled like
            this: business emails are forwarded to your personal email. This
            means that you can send emails from your business email, but you
            will receive them in your personal email. This is a free service
            provided by ImprovMX. To send out emails, Resend is used. The free
            tier is limited to 100 emails per day.
          </AlertDescription>
        </Alert>
        <div className="grid  grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Email Forwarding
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 / 1</div>
            </CardContent>{" "}
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 / 1</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> 0</div>
            </CardContent>{" "}
          </Card>{" "}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Another Thing
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="">
            <CardTitle className="text-sm font-medium">
              Email Templates
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Click to view what your emails look like to your customers.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-scroll">
            <div className=" space-y-4">
              {emailTemplates.map((template) => (
                <EmailTemplateLink
                  key={uniqueId()}
                  title={template.title}
                  description={template.description}
                  handleOnClick={() => {
                    setActiveTemplate(template);

                    setOpen(true);
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </AdminLayout>
  );
};

const EmailTemplateLink = ({
  title,
  description,
  handleOnClick,
}: {
  title: string;
  description: string;
  handleOnClick: () => void;
}) => {
  return (
    <div
      className="flex cursor-pointer items-center py-4 hover:bg-accent"
      onClick={handleOnClick}
    >
      <Mail className="h-9 w-9" />
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {/* <div className="ml-auto font-medium">+$1,999.00</div> */}
    </div>
  );
};

const EmailDialog = ({
  open,
  setOpen,
  title,
  description,
  template,
}: {
  title: string;
  description: string;
  open: boolean;
  setOpen: (state: boolean) => void;
  template: EmailTemplateOption;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
          <template.Template />
        </ScrollArea>
        <DialogFooter>
          <Button type="button" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default EmailServicePage;
