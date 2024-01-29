import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { env } from "~/env.mjs";
import paymentService from "~/services/payment";
import { retrievePaymentResult } from "~/services/payment/types";
import { toastService } from "~/services/toast";
import type { DetailedOrder } from "~/types";

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { error, data, isFetching } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      axios
        .get("https://api.github.com/repos/tannerlinsley/react-query")
        .then((res) => res.data),
  });

  const [paymentDetails, setPaymentDetails] =
    useState<retrievePaymentResult | null>(null);
  const fetchPaymentDetails = async (order: DetailedOrder) => {
    console.log(order.referenceId);
    setIsLoading(true);
    const results = await axios.post(
      `${env.NEXT_PUBLIC_API_URL}/payment/order-details`,
      {
        orderId: order.id,
      }
    );

    console.log(results);
    setIsLoading(false);

    if (results.status === 200) {
      setPaymentDetails(results.data as retrievePaymentResult);
    } else {
      setPaymentDetails(null);
      toastService.error(
        "Sorry, unable to connect to the payment processor.",
        "Payment fetch error"
      );
    }

    // return results;
  };

  return {
    paymentDetails,
    isLoading,
    isFetching,
    data,
    fetchPaymentDetails,
  };
};
