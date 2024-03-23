import type { Order, Prisma } from "@prisma/client";
import type { CartItem, CustomerShippingRate } from "~/types";
import type {
  CheckoutSessionResponse,
  THandleCheckoutProps,
  retrievePaymentResult,
} from "./types";

type TCreateLineItemProps = {
  cartItems: CartItem[];
  quantities: number[];
};

type TCreateCheckoutSessionProps<TLineItems, TShippingOptions> = {
  items: TLineItems;
  shippingOptions: TShippingOptions;
  order_id?: string;
  user_id?: string;
  store_id: string;
};

export interface PaymentProcessor<TLineItems, TShippingOptions> {
  processPayment(order: Order): Promise<void>;
  retrievePayment<
    T extends Prisma.OrderGetPayload<{
      include: {
        orderItems: true;
        shippingAddress: true;
        billingAddress: true;
      };
    }>
  >(
    order: T
  ): Promise<retrievePaymentResult | null>;
  createLineItems(props: TCreateLineItemProps): TLineItems;

  createCheckoutSession(
    props: TCreateCheckoutSessionProps<TLineItems, TShippingOptions>
  ): Promise<unknown>;

  handleCheckout(props: THandleCheckoutProps): Promise<CheckoutSessionResponse>;

  createShippingOptions(
    shippingOptions: CustomerShippingRate[]
  ): TShippingOptions;

  retrieveSession(session_id: string): Promise<CheckoutSessionResponse>;
}

export class PaymentService<TLineItems, TShippingOptions> {
  constructor(
    private paymentProcessor: PaymentProcessor<TLineItems, TShippingOptions>
  ) {}

  createLineItems(props: TCreateLineItemProps): TLineItems {
    return this.paymentProcessor.createLineItems(props);
  }

  createShippingOptions(shippingOptions: CustomerShippingRate[]) {
    return this.paymentProcessor.createShippingOptions(shippingOptions);
  }

  async handleCheckout(
    props: THandleCheckoutProps
  ): Promise<CheckoutSessionResponse> {
    const res: CheckoutSessionResponse =
      await this.paymentProcessor.handleCheckout(props);
    return res;
  }

  async createCheckoutSession(
    props: TCreateCheckoutSessionProps<TLineItems, TShippingOptions>
  ) {
    const res = await this.paymentProcessor.createCheckoutSession(props);
    return res;
  }
  async processPayment(order: Order) {
    await this.paymentProcessor.processPayment(order);
  }

  async retrieveSession(session_id: string) {
    const session = await this.paymentProcessor.retrieveSession(session_id);
    return session;
  }

  async retrievePayment<
    T extends Prisma.OrderGetPayload<{
      include: {
        orderItems: true;
        shippingAddress: true;
        billingAddress: true;
      };
    }>
  >(order: T) {
    const paymentDetails = await this.paymentProcessor.retrievePayment(order);
    return paymentDetails;
  }
}
