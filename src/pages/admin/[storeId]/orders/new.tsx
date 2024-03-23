import AdminLayout from "~/components/layouts/admin-layout";

import { OrderForm } from "~/modules/orders/components/admin/order-form";

const NewOrderPage = () => {
  return (
    <AdminLayout>
      <OrderForm initialData={null} />
    </AdminLayout>
  );
};

export default NewOrderPage;
