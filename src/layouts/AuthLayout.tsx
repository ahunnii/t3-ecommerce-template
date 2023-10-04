"use client";

import Footer from "~/components/app/footer";
import Navbar from "~/components/app/navbar";
import Container from "~/components/app/ui/container";

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
