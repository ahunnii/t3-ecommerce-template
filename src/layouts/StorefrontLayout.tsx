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
    <main className="flex h-full  min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto h-full w-full max-w-7xl flex-grow">
        {children}
      </div>
      <Footer />
    </main>
  );
}
