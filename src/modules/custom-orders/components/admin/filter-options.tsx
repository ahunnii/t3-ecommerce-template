import { Mail, MailCheckIcon, MailXIcon } from "lucide-react";

export const filterOptions = [
  {
    column: "status",
    title: "Status",
    filters: [
      {
        value: "PENDING",
        label: "Pending",
        icon: Mail,
      },
      {
        value: "ACCEPTED",
        label: "Accepted",
        icon: MailCheckIcon,
      },
      {
        value: "REJECTED",
        label: "Rejected",
        icon: MailXIcon,
      },
    ],
  },
];
