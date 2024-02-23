import { Mail, MapPin, Phone, User } from "lucide-react";

type ViewOrderCustomerProps = {
  name: string;
  email: string;
  phone: string;
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
};
export const ViewOrderCustomer = ({
  name,
  email,
  phone,
  address,
}: ViewOrderCustomerProps) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Customer
      </h3>
      <div className="py-4">
        <p className="flex gap-1">
          <User size={20} />
          {name}
        </p>
        <p className="flex gap-1">
          {" "}
          <Mail size={20} />
          {email}
        </p>
        <p className="flex gap-1">
          <Phone size={20} /> {phone}
        </p>
        <p className="flex gap-1">
          <MapPin size={20} /> {address?.street} {address?.additional}
          {", "}
          {address?.city}, {address?.state} {address?.postal_code}
        </p>
      </div>
    </div>
  );
};
