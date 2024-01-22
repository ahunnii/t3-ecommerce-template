import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

const Hero = () => {
  return (
    <div className="mx-auto flex  w-full max-w-7xl flex-col justify-between   gap-x-11  pt-28 md:flex-row ">
      {/* <Image
        layout="fill"
        src="/custom/wickedbackground.svg"
        alt="hero"
        objectFit="cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="rounded"
      /> */}
      <div className=" relative aspect-square w-full md:w-3/5">
        <Image
          layout="fill"
          src="/custom/hero_transparent.png"
          alt="hero"
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded"
        />
      </div>
      <div className=" w-full max-md:mt-8 max-md:p-4 md:w-2/5 md:space-y-8">
        <h1 className="text-default text-balance space-y-2 text-5xl font-extrabold leading-[1.25] tracking-tight max-md:text-center sm:text-[5rem]">
          Judy <span className="text-purple-500">Sledge</span> Designs
        </h1>

        <p className="text-default my-5 py-5  text-lg max-md:p-4">
          Lorem excepteur enim enim eu minim amet. Dolor consectetur proident
          occaecat id sunt ex ex eu. Amet esse ipsum irure eu mollit dolor sit
          quis. Sit cupidatat quis et anim mollit sint. Et veniam consectetur
          Lorem tempor tempor id reprehenderit irure adipisicing veniam irure
          eiusmod dolore.
        </p>

        <Button
          size={"lg"}
          className="bg-purple-500 shadow-xl shadow-purple-200 transition-all duration-150 ease-in hover:bg-purple-600 hover:shadow-purple-300 max-md:w-full"
        >
          <Link href="/products">Shop Now</Link>
        </Button>
      </div>
    </div>
  );
};
export default Hero;
