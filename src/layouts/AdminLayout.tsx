"use client";

import Navbar from "~/components/admin/navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen flex-col">
      <Navbar />
      {children}
    </main>
  );
}
