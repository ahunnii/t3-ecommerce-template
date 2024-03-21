import { Mail, MailCheckIcon } from "lucide-react";

export const productFilterOptions = [
  {
    column: "status",
    title: "Archive Status",
    filters: [
      {
        value: "ARCHIVED",
        label: "Archived",
        icon: Mail,
      },
      {
        value: "DRAFT",
        label: "Draft",
        icon: MailCheckIcon,
      },
      {
        value: "ACTIVE",
        label: "Active Listing",
        icon: MailCheckIcon,
      },
      {
        value: "CUSTOM",
        label: "Custom Order",
        icon: MailCheckIcon,
      },
    ],
  },
];
