import { PaymentService } from "./payment-service";
import { stripePaymentProcessor } from "./stripe/stripe-payment-processor";

const paymentService = new PaymentService(stripePaymentProcessor);

export default paymentService;
