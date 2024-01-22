import Image from "next/image";

//Homepage component towards the bottom of the page, mix of what the site is about and any misc info
const SiteBlurb = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-row items-center  justify-between  gap-12 px-4 pb-16">
      <div className=" relative aspect-video w-2/6">
        <Image
          layout="fill"
          src="/custom/sledge_logo.png"
          alt="hero"
          objectFit="contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded"
        />
      </div>{" "}
      <div className="w-4/6">
        <p>
          Duis duis do nulla sunt dolore non aute esse pariatur commodo id. Amet
          duis aute cillum id eiusmod reprehenderit. Sunt voluptate proident
          cillum voluptate nisi sunt velit veniam mollit. In officia eiusmod
          laborum ea labore aute deserunt aliqua commodo deserunt laboris
          aliqua. Nostrud qui voluptate velit labore nostrud est esse Lorem
          velit magna. Sint nulla consequat enim excepteur excepteur aliquip
          culpa sit tempor fugiat aute cupidatat.
        </p>
      </div>
    </div>
  );
};

export default SiteBlurb;
