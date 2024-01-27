import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import Container from "~/components/core/ui/container";
import { Button } from "~/components/ui/button";
import { env } from "~/env.mjs";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="w-full bg-black px-4 sm:px-6 lg:px-8">
      <Container>
        <footer className="border-t border-t-white/20 ">
          <div className="mx-auto flex items-center justify-between py-10">
            <p className="text-left text-xs text-white">
              &copy; {year} {env.NEXT_PUBLIC_STORE_NAME}, Inc. All rights
              reserved.
            </p>

            <div className="flex gap-2 ">
              <Link
                href="https://www.instagram.com/trendanomaly/?hl=en"
                target="_blank"
              >
                <Button
                  variant="ghost"
                  className="group  aspect-square rounded-full p-0"
                >
                  {" "}
                  <Instagram className="h-6 w-6 text-white transition-all duration-150 ease-linear group-hover:text-black" />
                </Button>
              </Link>{" "}
              <Link href="/">
                <Button
                  variant="ghost"
                  className="group  aspect-square rounded-full p-0"
                >
                  {" "}
                  <Facebook className="h-6 w-6 text-white transition-all duration-150 ease-linear group-hover:text-black" />
                </Button>
              </Link>{" "}
              <Link href="/">
                <Button
                  variant="ghost"
                  className="group  aspect-square rounded-full p-0"
                >
                  {" "}
                  <Twitter className="h-6 w-6 text-white transition-all duration-150 ease-linear group-hover:text-black" />
                </Button>
              </Link>
            </div>
          </div>
        </footer>
      </Container>
    </div>
  );
};

export default Footer;
