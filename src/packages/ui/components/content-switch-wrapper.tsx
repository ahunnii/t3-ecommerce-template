import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";

import {
  forwardRef,
  useEffect,
  useState,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { cn } from "~/utils/styles";

export const contentSwitchWrapperVariants = cva(
  "object-cover object-center transition-all duration-500 ease-in-out absolute inset-0 h-full w-full object-cover",
  {
    variants: {
      variant: {
        video: "z-20 aspect-auto",
        image: "z-0 aspect-square",
      },
      overlay: {
        default: "bg-transparent",
        tinted: "bg-black/30",
      },
    },
    defaultVariants: {
      variant: "image",
      overlay: "default",
    },
  }
);

export interface ContentSwitchWrapperProps
  extends HTMLAttributes<ElementRef<"div">>,
    VariantProps<typeof contentSwitchWrapperVariants> {
  asChild?: boolean;
  imageClassName?: string;
  primaryContentUrl: string;
  secondaryContentUrl?: string;
}
export const ContentSwitchWrapper = forwardRef<
  ElementRef<"div">,
  ContentSwitchWrapperProps
>(
  (
    {
      className,
      variant,
      imageClassName,
      overlay,
      primaryContentUrl,
      secondaryContentUrl,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const [switchView, setSwitchView] = useState<boolean>(false);

    const Comp = asChild ? Slot : "div";

    const [isImage, setIsImage] = useState(false);
    const [isVideo, setIsVideo] = useState(false);

    useEffect(() => {
      if (!secondaryContentUrl) return;
      // Fetch the URL with a HEAD request
      fetch(secondaryContentUrl, { method: "HEAD" })
        .then((response) => {
          // Get the content type from the response headers
          const contentType = response.headers.get("content-type");

          // Check if the content type indicates an image or video
          if (contentType && contentType.startsWith("image")) {
            setIsImage(true);
          } else if (contentType && contentType.startsWith("video")) {
            setIsVideo(true);
          }
        })
        .catch((error) => console.error("Error fetching URL:", error));
    }, [secondaryContentUrl]);

    return (
      <Comp
        className={cn(
          "group relative mx-auto aspect-square h-96 overflow-hidden bg-cover bg-center",
          className
        )}
        onMouseOver={() => setSwitchView(true)}
        onMouseLeave={() => setSwitchView(false)}
        {...props}
        ref={ref}
      >
        {props.children}
        <div
          className={cn(
            contentSwitchWrapperVariants({ overlay }),
            isImage && "z-[5]",
            isVideo && "z-[40]",
            "transition-opacity duration-150 ease-in-out group-hover:opacity-0"
          )}
        ></div>
        <div className="relative h-full w-full transition-all duration-300 ease-in-out">
          <Image
            src={primaryContentUrl ?? "/placeholder-image.webp"}
            alt=""
            fill
            className={cn(
              contentSwitchWrapperVariants({ variant }),
              imageClassName
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {isImage && (
            <Image
              src={
                secondaryContentUrl ??
                primaryContentUrl ??
                "/placeholder-image.webp"
              }
              alt=""
              fill
              className={cn(
                contentSwitchWrapperVariants({ variant }),
                imageClassName,
                "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>

        {switchView && isVideo && secondaryContentUrl && (
          <video
            src={secondaryContentUrl ?? "/placeholder-image.webp"}
            className={cn(contentSwitchWrapperVariants({ variant }))}
            autoPlay
            loop
            muted
          />
        )}
      </Comp>
    );
  }
);

ContentSwitchWrapper.displayName = "ContentSwitchWrapper";
