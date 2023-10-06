import CartNavbar from "~/components/app/cart-navbar";
import Footer from "~/components/app/footer";
import Container from "~/components/app/ui/container";

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
