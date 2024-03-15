import { Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const AdminEditButton = ({
  href,
  text = "Edit...",
}: {
  href: string;
  text?: string;
}) => {
  return (
    <Link href={href}>
      <Button className="flex gap-2" size={"sm"}>
        <Pencil className="h-5 w-5" /> {text}
      </Button>
    </Link>
  );
};
