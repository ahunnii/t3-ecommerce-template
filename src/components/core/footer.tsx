import { env } from "~/env.mjs";

const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto py-10">
        <p className="text-center text-xs text-black">
          &copy; 2023 {env.NEXT_PUBLIC_STORE_NAME}, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
