import { Mail, MailCheckIcon } from "lucide-react";

export const productFilterOptions = [
  {
    column: "isArchived",
    title: "Archive Status",
    filters: [
      {
        value: "Archived",
        label: "Archived",
        icon: Mail,
      },
      {
        value: "Not Archived",
        label: "Not Archived",
        icon: MailCheckIcon,
      },
    ],
  },
  {
    column: "customOrder",
    title: "Custom Orders",
    filters: [
      {
        value: "Custom Order",
        label: "Custom Order",
        icon: Mail,
      },
      {
        value: "Not Custom Order",
        label: "Not Custom Order",
        icon: MailCheckIcon,
      },
    ],
  },
];
