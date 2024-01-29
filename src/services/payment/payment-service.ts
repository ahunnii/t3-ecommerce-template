import type { Order } from "@prisma/client";
import { DetailedOrder } from "~/types";
import { retrievePaymentResult } from "./types";

export interface PaymentProcessor {
  processPayment(order: Order): Promise<void>;
  retrievePayment(order: DetailedOrder): Promise<retrievePaymentResult | null>;
}

export class PaymentService {
  constructor(private paymentProcessor: PaymentProcessor) {}

  async processPayment(order: Order) {
    await this.paymentProcessor.processPayment(order);
  }

  async retrievePayment(order: DetailedOrder) {
    const paymentDetails = await this.paymentProcessor.retrievePayment(order);
    return paymentDetails;
  }
}
