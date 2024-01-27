import CartNavbar from "~/components/core/cart-navbar";
import { Footer } from "~/components/core/footer";
import Container from "~/components/core/ui/container";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen flex-col">
      <CartNavbar />
      <Container>{children}</Container>
      <Footer />
    </main>
  );
}
