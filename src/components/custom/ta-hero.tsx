import Image from "next/image";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

export const TaHero = () => {
  // const getHero = api.store.getHero.useQuery({});

  // if (!getHero.data) return null;
  return (
    <section
      id="home"
      className={cn(
        `relative flex   flex-col bg-cover bg-center bg-no-repeat py-6 sm:py-16 md:flex-row`
      )}
    >
      <Image
        src={"/custom/ta_hero.jpeg"}
        fill
        className="object-cover"
        alt="Image"
      />
      <div className={`flex-1   flex-col `}>
        <div className="relative flex h-[25vh] w-full flex-row items-center justify-between">
          {/* <Button className="absolute bottom-0 ml-28">of the System.</Button> */}
        </div>
      </div>
    </section>
  );
};
// "/custom/ta_hero.jpeg"
