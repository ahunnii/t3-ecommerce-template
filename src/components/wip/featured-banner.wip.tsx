import Link from "next/link";
import { Button } from "../ui/button";

export const FeaturedBanner = () => {
  return (
    <div className="mt-10 w-full bg-fuchsia-400/50 p-4 text-white ">
      <p className="text-semibold text-center text-lg">
        Featured Banner: Check out our latest artist, Dabls!{" "}
        <Link href="/about-us">
          <Button className="mx-o px-0 text-lg" variant={"link"}>
            Learn More
          </Button>
        </Link>
      </p>
    </div>
  );
};
