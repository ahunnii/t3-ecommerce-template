import { uniqueId } from "lodash";
import { Star, User } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/utils/styles";

export const ReviewTemplate = (props: {
  title: string;
  content: string;
  rating: number;
  user: {
    name: string | null;
    image: string | null;
  };
  images: { url: string }[];
  createdAt: Date;
  updatedAt: Date;
}) => {
  return (
    <article className="flex flex-col space-y-1">
      <div className="flex items-center gap-1">
        <Avatar>
          <AvatarFallback className=" rounded-full bg-zinc-100">
            <User />
          </AvatarFallback>
          <AvatarImage
            src={props?.user?.image ?? "/placeholder-image.webp"}
            alt={props?.user?.name ?? ""}
          />
        </Avatar>

        <p>{props?.user?.name}</p>
      </div>
      <div className="flex gap-1">
        <Star className={cn("fill-fuchsia-500")} />
        <Star className={cn("", props.rating >= 2 && "fill-fuchsia-500")} />
        <Star className={cn("", props.rating >= 3 && "fill-fuchsia-500")} />
        <Star className={cn("", props.rating >= 4 && "fill-fuchsia-500")} />
        <Star className={cn("", props.rating >= 5 && "fill-fuchsia-500")} />
      </div>

      <h5 className="font-semibold">{props?.title}</h5>
      <h6>
        {props.updatedAt?.toDateString() ?? props.createdAt.toDateString()}
        {props.createdAt.toISOString() !== props.updatedAt.toISOString() &&
          "(edited)"}
      </h6>
      <p>{props?.content}</p>

      <div className="flex gap-2">
        {props?.images.map((image) => (
          <div
            className="relative aspect-square h-20 w-20 rounded-md"
            key={uniqueId()}
          >
            <Image
              src={image.url}
              alt={"For review"}
              fill={true}
              className="rounded-md object-cover"
            />
          </div>
        ))}
      </div>
    </article>
  );
};
