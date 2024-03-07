export const TaHero = () => {
  return (
    <section
      id="home"
      className={`flex flex-col bg-[url('/custom/ta_hero.jpeg')]   bg-cover bg-center bg-no-repeat py-6 sm:py-16 md:flex-row`}
    >
      <div className={`flex-1   flex-col `}>
        <div className="relative flex h-[25vh] w-full flex-row items-center justify-between">
          {/* <Button className="absolute bottom-0 ml-28">of the System.</Button> */}
        </div>
      </div>
    </section>
  );
};
