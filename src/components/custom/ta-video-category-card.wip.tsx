import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "~/utils/styles";
import { Button } from "../ui/button";

type Props = {
  link: string;
  title: string;
  imageURL: string;
  videoURL?: string;
  gifURL?: string;
};
export const TaVideoCategoryCard = (props: Props) => {
  const [toggleVideo, setToggleVideo] = useState<boolean>(false);

  if (!props.imageURL) return null;

  const bgVideo = `bg-[url(` + props?.imageURL + `)] `;

  if (!props.imageURL || props.imageURL === "") return null;
  return (
    <Link
      href={props.link}
      className={cn(
        "relative mx-auto aspect-square h-96 overflow-hidden bg-purple-500  bg-cover bg-center transition-all duration-500 ease-in-out max-md:w-11/12 md:w-1/3",
        bgVideo
      )}
      onMouseOver={() => setToggleVideo(true)}
      onMouseLeave={() => setToggleVideo(false)}
    >
      <p className="absolute bottom-32 left-5 z-10  text-lg font-semibold text-white lg:text-xl ">
        Featured Collection
      </p>
      <p className="absolute bottom-20  left-5  z-10  text-2xl font-semibold text-white lg:text-3xl">
        {props?.title}
      </p>
      <Button className="absolute bottom-5 left-5" variant={"outline"}>
        Shop {props.title}
      </Button>

      <div className="h-full w-full bg-black/20 md:hidden"></div>
      {toggleVideo ? (
        <>
          {props?.videoURL && (
            <video
              src={props.videoURL ?? ""}
              className=" z-20  aspect-auto h-full w-full object-cover object-center transition-all duration-500 ease-in-out"
              autoPlay
              loop
              muted
            />
          )}

          {props?.gifURL && (
            <Image
              src={props?.gifURL ?? props?.imageURL ?? ""}
              className=" z-0 aspect-square object-cover object-center transition-all duration-500 ease-in-out"
              fill
              alt=""
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </>
      ) : (
        <div className="h-full w-full bg-black/20 "></div>
      )}
    </Link>
  );
};

{
  /* <Link
href="/collections/ff0990fa-b6f4-4cea-a391-46b05b9b04b8"
className="relative aspect-square h-96 w-1/3 overflow-hidden bg-purple-500 bg-[url(/custom/ta_bleach.jpg)] bg-cover bg-center transition-all duration-500 ease-in-out"
onMouseOver={() => setBleach(true)}
onMouseLeave={() => setBleach(false)}
>
<p className="absolute bottom-0 z-10 text-2xl font-bold text-white">
  The Bleach Collection
</p>
{bleach ? (
  <Image
    src="/custom/ta_bleach.gif"
    className=" z-0 aspect-square object-cover object-center transition-all duration-500 ease-in-out"
    fill
    alt=""
  />
) : (
  <div className="h-full w-full bg-black/20 "></div>
)}{" "}
</Link>
<Link
href="/collections/1bf47853-88a3-40a3-9dc8-cd5954ad9b68"
className="relative aspect-square h-96 w-1/3 overflow-hidden bg-purple-500 bg-[url(/custom/ta_embroidery_still_alt.png)] bg-cover bg-center transition-all duration-500 ease-in-out"
onMouseOver={() => setHover(true)}
onMouseLeave={() => setHover(false)}
>
<p className="absolute bottom-0 text-2xl font-bold text-white">
  The Embroidery Collection
</p>
{hover ? (
  <video
    src="/custom/ta_embroidery.mp4"
    className=" z-20 aspect-square object-cover object-center transition-all duration-500 ease-in-out"
    autoPlay
    loop
    muted
  />
) : (
  <div className="h-full w-full bg-black/20 "></div>
)}{" "}
</Link>
<Link
href="/contact-us"
className="relative aspect-square h-96 w-1/3 overflow-hidden bg-purple-500 bg-[url(/custom/ta_custom.png)] bg-cover bg-center transition-all duration-500 ease-in-out"
onMouseOver={() => setCustom(true)}
onMouseLeave={() => setCustom(false)}
>
<p className="absolute bottom-0 text-2xl font-bold text-white">
  Custom Clothing
</p>
{custom ? (
  <video
    src="/custom/ta_custom.mp4"
    className=" z-20 aspect-square object-cover object-center transition-all duration-500 ease-in-out"
    autoPlay
    loop
    muted
  />
) : (
  <div className="h-full w-full bg-black/20 "></div>
)}{" "}
</Link> */
}
