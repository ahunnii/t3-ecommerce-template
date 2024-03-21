import { phoneFormatStringToNumber } from "~/utils/format-utils.wip";

type ViewOrderDetailsProps = {
  name?: string;
  phone?: string;
  address: {
    id: string;
    street: string;
    additional: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string | null;
    storeId: string | null;
    orderId: string | null;
  } | null;
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

      <div className="grid  grid-cols-4 items-start divide-x py-2 text-sm">
        <div className="col-span-1  text-center">
          <p className="text-muted-foreground">Name:</p>
          <p>{name}</p>
        </div>
        {/* <Separator orientation="vertical" /> */}
        <div className="col-span-1  text-center">
          <p className="text-muted-foreground">Phone:</p>
          <p>{phoneFormatStringToNumber(phone ?? "")}</p>
        </div>{" "}
        {/* <Separator orientation="vertical" /> */}
        {/* <Separator orientation="vertical" /> */}
        <div className="col-span-1  text-center">
          <p className="text-muted-foreground">Email:</p>
          <p>{email}</p>
        </div>
        <div className="col-span-1  text-center">
          <p className="text-muted-foreground">Address:</p>
          <p>{address?.street}</p>
          <p>{address?.additional}</p>
          <p>
            {address?.city}, {address?.state} {address?.postal_code}
          </p>
        </div>{" "}
      </div>
    </div>
  );
};
