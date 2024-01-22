// Component for homepage under Hero
const ExpressYourself = () => {
  return (
    <div className="mx-auto flex w-full  justify-between gap-x-11 space-y-10 bg-primary/5 py-48">
      <div className=" mx-auto flex h-96 w-full max-w-6xl flex-col justify-center">
        <h2 className=" text-pretty text-7xl font-bold text-primary">
          A Style For Every Occasion,{" "}
          <span className=" text-purple-500">Made By Hand</span>.
        </h2>
        <h3 className="text-default my-3 py-5 text-2xl font-normal">
          Every piece is made with love and care. We want you to feel confident
          and beautiful in your own skin.
        </h3>

        <div className="flex w-full gap-4 py-8">
          <div className="aspect-video w-1/3 space-y-4 ">
            <span className="flex aspect-square w-8 place-items-center justify-center rounded-full bg-muted-foreground text-2xl text-white ">
              1
            </span>
            <p className="text-2xl font-normal text-muted-foreground">
              First, we receive your order as soon as you place it.
            </p>
          </div>
          <div className="aspect-video w-1/3">
            <span className="flex aspect-square w-8 place-items-center justify-center rounded-full bg-muted-foreground text-2xl text-white ">
              2
            </span>
            <p className="text-2xl font-normal text-muted-foreground">
              From there, we begin to create your order with love and care,
              stitch by stitch. Everything is made by hand.
            </p>
          </div>
          <div className="aspect-video w-1/3">
            <span className="flex aspect-square w-8 place-items-center justify-center rounded-full bg-muted-foreground text-2xl text-white ">
              3
            </span>
            <p className="text-2xl font-normal text-muted-foreground">
              Finally, we ship your order to you as soon as it&apos;s ready.
              Typically it takes 1-2 weeks to ship your order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpressYourself;
