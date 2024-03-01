import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCheckIcon,
  CircleIcon,
  HelpCircleIcon,
  LucideIcon,
  TimerIcon,
  XCircleIcon,
} from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];
export type FilterOption = {
  column: string;
  title: string;
  filters: {
    value: string;
    label: string;
    icon: LucideIcon;
  }[];
};

export const statuses = {
  column: "status",
  title: "Status",
  filters: [
    {
      value: "PENDING",
      label: "Pending",
      icon: HelpCircleIcon,
    },
    {
      value: "PAID",
      label: "Paid",
      icon: CircleIcon,
    },
    {
      value: "SHIPPED",
      label: "Shipped",
      icon: TimerIcon,
    },
  ],
};

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];
