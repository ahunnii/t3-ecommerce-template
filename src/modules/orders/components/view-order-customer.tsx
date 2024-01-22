type ViewOrderCustomerProps = {
  name: string;
  email: string;
  phone: string;
};
export const ViewOrderCustomer = ({
  name,
  email,
  phone,
}: ViewOrderCustomerProps) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Customer
      </h3>

      <p>{name}</p>
      <p>{email}</p>
      <p>{phone}</p>
    </div>
  );
};
