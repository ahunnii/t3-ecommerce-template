import { Separator } from "~/components/ui/separator";

type ViewOrderDetailsProps = {
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
};
export const ViewOrderDetails = ({
  name,
  phone,
  address,
  email,
}: ViewOrderDetailsProps) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Details
      </h3>

      <div className="flex h-5 items-center space-x-4 py-8 text-sm">
        <div className="text-left">
          <p className="text-muted-foreground">Name:</p>
          <p>{name}</p>
        </div>
        <Separator orientation="vertical" />
        <div className="text-left">
          <p className="text-muted-foreground">Phone:</p>
          <p>{phone}</p>
        </div>{" "}
        <Separator orientation="vertical" />
        <div className="text-left">
          <p className="text-muted-foreground">Address:</p>
          <p>{address}</p>
        </div>{" "}
        <Separator orientation="vertical" />
        <div className="text-left">
          <p className="text-muted-foreground">Email:</p>
          <p>{email}</p>
        </div>
      </div>
    </div>
  );
};
