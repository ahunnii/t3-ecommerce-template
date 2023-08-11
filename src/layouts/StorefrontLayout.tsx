"use client";

import Footer from "~/components/app/footer";
import Navbar from "~/components/app/navbar";
import Container from "~/components/app/ui/container";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-full">
      <Navbar />
      <Container>{children}</Container>

      <Footer />
    </main>
  );
}
