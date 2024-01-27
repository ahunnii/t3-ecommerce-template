import { Footer } from "~/components/core/footer";
import { Navbar } from "~/components/core/navbar";
import Container from "~/components/core/ui/container";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen flex-col">
      <Navbar />
      <Container>{children}</Container>
      <Footer />
    </main>
  );
}
