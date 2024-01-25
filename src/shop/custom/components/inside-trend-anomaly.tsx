import Image from "next/image";
import Container from "~/components/core/ui/container";

export const InsideTrendAnomaly = () => {
  return (
    <Container>
      <div className="flex w-full items-center justify-around bg-purple-300/90 p-4 pl-8">
        <div className="w-2/3 border border-purple-500 bg-zinc-800 p-8 shadow">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight text-purple-500 first:mt-0">
            Inside Trend Anomaly
          </h2>
          <p className="leading-7 text-white/90 [&:not(:first-child)]:mt-6">
            Trend Anomaly is a fashion brand that features alternative and nerd
            related clothing. This brand is about standing out in a crowd while
            also being fashionable. Representing the nerd and alt communities
            while also creating something that can be worn casual or dressed up.
            This brand will provide more options for Black, LGBTQ+, and POC to
            feel more safe with buying from a place that offers clothing that
            relates to people who love Alternative clothing and nerd culture.
          </p>
        </div>

        <div className="relative h-96  w-1/3 p-4">
          <Image
            src="/custom/ta_nanako.png"
            fill
            alt="logo"
            className="object-cover"
          />
        </div>
      </div>
    </Container>
  );
};
