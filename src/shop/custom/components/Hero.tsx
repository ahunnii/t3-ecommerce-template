import { Button } from "~/components/ui/button";
import GetStarted from "./GetStarted";
import { styles } from "./styles";

const Hero = () => {
  const pink_gradiant =
    "bg-gradient-to-r from-pink-300 to-pink-600 filter blur-[900px]";
  const white_gradiant = "bg-white bg-opacity-60 filter blur-[750px]";
  const blue_gradiant =
    "bg-gradient-to-t from-transparent via-blue-800 to-transparent filter blur-[123px]";
  const bg_discount_gradient = "bg-gradient-to-tr from-gray-700 to-indigo-900";
  const text_gradient =
    " bg-gradient-to-br from-purple-100 via-purple-200 to-purple-500 text-transparent bg-clip-text";

  return (
    <section
      id="home"
      className={`flex flex-col md:flex-row ${styles.paddingY}  bg-[url('/custom/ta_hero.jpeg')] bg-cover bg-center bg-no-repeat`}
    >
      <div className={`flex-1   flex-col `}>
        {/* <div
          className={`flex flex-row items-center px-4 py-[6px] ${bg_discount_gradient} mb-2 rounded-[10px]`}
        >
          <img
            src={"https://i.imgur.com/5BZrGDw.png"}
            alt="discount"
            className="h-[32px] w-[32px]"
          />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">20%</span> Discount For{" "}
            <span className="text-white">1 Month</span> Account
          </p>
        </div> */}

        <div className="relative flex h-[25vh] w-full flex-row items-center justify-between">
          {/* <Button className="absolute bottom-0 ml-28">of the System.</Button> */}
        </div>
      </div>

      {/* <div
        className={`flex flex-1 ${styles.flexCenter} relative my-10 md:my-0`}
      >
        <img
          src={"/custom/ta_nanako.png"}
          alt="billing"
          className="relative z-[5] h-[100%] w-[100%]"
        />


        <div
          className={`absolute top-0 z-[0] h-[35%] w-[40%] ${pink_gradiant} `}
        />
        <div
          className={`absolute z-[1] h-[80%] w-[80%] rounded-full ${white_gradiant} bottom-40`}
        />
        <div
          className={`absolute bottom-20 right-20 z-[0] h-[50%] w-[50%] ${blue_gradiant}`}
        />

      </div> */}
    </section>
  );
};

export default Hero;
