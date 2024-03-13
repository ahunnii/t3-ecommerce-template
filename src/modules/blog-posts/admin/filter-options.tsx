import { Mail, MailCheckIcon } from "lucide-react";

export const filterOptions = [
  {
    column: "published",
    title: "Status",
    filters: [
      {
        value: "Published",
        label: "Published",
        icon: Mail,
      },
      {
        value: "Draft",
        label: "Not Published",
        icon: MailCheckIcon,
      },
    ],
  },
];
