import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NewCustomOrderCustomer from "~/services/email_new/email-templates/new-custom-order-customer";

const Home = () => {
  return <NewCustomOrderCustomer />;
};

export default Home;
