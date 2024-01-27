import Link from "next/link";

import { Button } from "~/components/ui/button";

import type { SocialMedia } from "~/modules/contact/types";

type ContactInfoProps = {
  location: string;
  hours: string[];
  socials: SocialMedia[];
};

export const ContactInfo = ({ location, hours, socials }: ContactInfoProps) => {
  return (
    <div className="flex w-full justify-between py-4">
      <div className="text-left">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Location
        </h4>
        <p>{location}</p>
      </div>
      <div className="text-left">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Hours
        </h4>
        {hours.map((hour) => (
          <p key={hour}>{hour}</p>
        ))}
      </div>
      <div className="text-left">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Follow Us
        </h4>
        <div className="flex  gap-1.5 ">
          {socials.map((social) => (
            <Link href={social.href} target="_blank" key={social.name}>
              <Button
                variant="outline"
                className="group  aspect-square rounded-full p-0"
              >
                <span className="sr-only">{social.name}</span>
                <social.Icon className="h-6 w-6 text-black transition-all duration-150 ease-linear group-hover:text-purple-500" />
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
