import axios from "axios";
import { useState } from "react";
import type Shippo from "shippo";

export type ShippingAddress = {
  name: string;
  street: string;
  additional?: string;
  city: string;
  state: string;
  zip: string;
};

export type ShippingResponse = {
  isValid: boolean;
  message: string;
};

const DEFAULT_COUNTRY = "US";

const useShippingLabel = () => {
  const [rates, setRates] = useState<Shippo.Rate[]>([]);
  const [customerAddress, setCustomerAddress] = useState<ShippingAddress>({
    name: "",
    street: "",
    additional: "",
    city: "",
    state: "",
    zip: "",
  });

  const [businessAddress, setBusinessAddress] = useState<ShippingAddress>({
    name: "",
    street: "",
    additional: "",
    city: "",
    state: "",
    zip: "",
  });

  const validateAddress = async (address: ShippingAddress) => {
    const addressResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/shipping/addresses`,
      {
        street1: address.street,
        street2: address.additional,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: DEFAULT_COUNTRY,
      }
    );

    if (addressResponse.status !== 200)
      return {
        isValid: false,
        message: `There was an issue with validating the address.
    Please try again later.`,
      };

    const validationResults = addressResponse.data.validation_results;

    if (validationResults.is_valid)
      return { isValid: true, message: "Success" };
    else
      return { isValid: false, message: validationResults.messages?.[0]?.text };
  };

  return { validateAddress, setCustomerAddress, setBusinessAddress };
};

export default useShippingLabel;
