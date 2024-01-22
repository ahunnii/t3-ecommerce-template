import Image from "next/image";

//Homepage component towards the bottom, highlights the owner
const HomeGreetings = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-x-11 py-28">
      <div className="mb-10 flex flex-row items-center gap-5">
        <div className="flex w-2/5 flex-col items-center ">
          <h2 className="text-5xl font-extrabold tracking-tight text-primary sm:text-[5rem]">
            Nice to Meet You
          </h2>
        </div>
        <div className="w-3/5">
          <p className="py-5 text-lg text-primary">
            Lorem excepteur enim enim eu minim amet. Dolor consectetur proident
            occaecat id sunt ex ex eu. Amet esse ipsum irure eu mollit dolor sit
            quis. Sit cupidatat quis et anim mollit sint. Et veniam consectetur
            Lorem tempor tempor id reprehenderit irure adipisicing veniam irure
            eiusmod dolore.
          </p>
        </div>{" "}
      </div>
      <div className=" relative aspect-video w-full">
        <Image
          layout="fill"
          src="/custom/about_stock.png"
          alt="hero"
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded"
        />
      </div>
    </div>
  );
};

export default HomeGreetings;
