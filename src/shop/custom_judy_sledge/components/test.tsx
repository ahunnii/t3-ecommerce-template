import Image from "next/image";

const TestComponent = () => {
  return (
    <main className="font-inter">
      <section className="container relative mx-auto flex h-[650px] max-h-[650px]  flex-col overflow-hidden bg-white px-8 shadow-sm lg:px-12 xl:px-20">
        <div className="z-5 space-y-8 pt-16 md:pt-32">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold md:text-5xl  xl:text-6xl">
              Summer styles <br /> are finally here
            </h1>
            <p className="max-w-sm text-lg text-gray-500 lg:text-xl xl:max-w-lg">
              This year, our new summer collection wil shelter you from the
              harsh elements of a world that doesn't care if you live or die.
            </p>
          </div>
          <button className="rounded-md bg-indigo-600 px-8 py-3 text-indigo-100 hover:bg-indigo-600/90 focus:outline-none">
            Shop Collection
          </button>
        </div>
        <div className="absolute -bottom-32 -right-24  z-0 grid max-w-sm grid-cols-3 items-center justify-center gap-4 sm:-bottom-60 sm:right-10 sm:max-w-md md:max-w-md lg:-bottom-24  lg:right-12 lg:max-w-lg lg:gap-8 xl:max-w-2xl">
          <div className="grid grid-cols-1 gap-4 md:gap-8 ">
            <Image
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80"
              alt="Picture"
              width={200}
              height={260}
              blurDataURL="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80"
              placeholder="blur"
              loading="eager"
              objectFit="cover"
            />
            <Image
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
              alt="Picture"
              width={200}
              height={260}
              blurDataURL="https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
              placeholder="blur"
              loading="eager"
              objectFit="cover"
            />
          </div>
          <div className="grid grid-cols-1 gap-8 ">
            <Image
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1602452920335-6a132309c7c8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
              alt="Picture"
              width={200}
              height={260}
              blurDataURL="https://images.unsplash.com/photo-1602452920335-6a132309c7c8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
              placeholder="blur"
              loading="eager"
              objectFit="cover"
            />
            <Image
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
              alt="Picture"
              width={200}
              height={260}
              blurDataURL="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
              placeholder="blur"
              loading="eager"
              objectFit="cover"
            />
            <Image
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1495385794356-15371f348c31?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=319&q=80"
              alt="Picture"
              width={200}
              height={260}
              blurDataURL="https://images.unsplash.com/photo-1495385794356-15371f348c31?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=319&q=80"
              placeholder="blur"
              loading="eager"
              objectFit="cover"
            />
          </div>
          <div className="grid grid-cols-1 gap-8 ">
            <Image
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1619608176024-7906d3489cc7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
              alt="Picture"
              width={200}
              height={260}
              blurDataURL="https://images.unsplash.com/photo-1619608176024-7906d3489cc7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
              placeholder="blur"
              loading="eager"
              objectFit="cover"
            />
            <Image
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1598554747436-c9293d6a588f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=334&q=100"
              alt="Picture"
              width={200}
              height={260}
              blurDataURL="https://images.unsplash.com/photo-1598554747436-c9293d6a588f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=334&q=100"
              placeholder="blur"
              loading="eager"
              objectFit="cover"
            />
          </div>
        </div>
      </section>
      <section className="container mx-auto space-y-5 bg-gray-50 px-8  py-14 lg:px-12 xl:px-20">
        <div className="flex flex-row items-center justify-between">
          <span className="text-2xl font-bold">Shop by Category</span>
          <span className="hidden text-sm text-indigo-600 md:block">
            Browse all categories {"->"}
          </span>
        </div>
        <div className="grid h-[540px] grid-cols-1 gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 z-10  rounded-lg bg-gradient-to-b from-transparent via-gray-500/50 to-gray-800/80 mix-blend-multiply"></div>
            <div className="absolute bottom-6 left-6 z-20 flex flex-col text-gray-100">
              <span className="text-lg font-semibold">New Arrivals</span>
              <span className="text-sm ">Shop now</span>
            </div>
            <Image
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1472746729193-36ad213ac4a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=100"
              alt="Picture"
              width={700}
              height={594}
              blurDataURL="https://images.unsplash.com/photo-1472746729193-36ad213ac4a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=100"
              placeholder="blur"
              loading="eager"
              objectFit="cover"
            />
          </div>
          <div className="grid grid-cols-1 gap-5">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 z-10  rounded-lg bg-gradient-to-b from-transparent via-gray-500/50 to-gray-800/80 mix-blend-multiply"></div>
              <div className="absolute bottom-6 left-6 z-20 flex flex-col text-gray-100">
                <span className="text-lg font-semibold">Women's</span>
                <span className="text-sm ">Shop now</span>
              </div>
              <Image
                className="rounded-lg"
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
                alt="Picture"
                width={700}
                height={280}
                blurDataURL="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
                placeholder="blur"
                loading="eager"
                objectFit="cover"
              />
            </div>
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 z-10  rounded-lg bg-gradient-to-b from-transparent via-gray-500/50 to-gray-800/80 mix-blend-multiply"></div>
              <div className="absolute bottom-6 left-6 z-20 flex flex-col text-gray-100">
                <span className="text-lg font-semibold">Men's</span>
                <span className="text-sm ">Shop now</span>
              </div>
              <Image
                className="rounded-lg"
                src="https://images.unsplash.com/photo-1612299065617-f883adb67bd1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=752&q=80"
                alt="Picture"
                width={700}
                height={280}
                blurDataURL="https://images.unsplash.com/photo-1612299065617-f883adb67bd1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=752&q=80"
                placeholder="blur"
                loading="eager"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto  py-16 lg:px-12 xl:px-20">
        <div className=" relative max-h-48 overflow-hidden md:max-h-[500px]">
          <div className="absolute inset-0 z-10  bg-gradient-to-br from-gray-500 via-gray-700 to-gray-400 mix-blend-multiply"></div>
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-2 text-white">
            <h3 className="text-3xl font-bold">Fashion for a cause</h3>
            <p className="hidden max-w-xl pb-4 text-center md:block">
              As a Certified B Corporation® every purchase directly supports the
              lives of our cotton farmers and their children, with your help,
              we've built 7 schools, funded 690 farms, and impacted over 30,000
              lives in rural Egypt.
            </p>
            <button className="rounded bg-white px-8 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none">
              Read our story
            </button>
          </div>
          <Image
            className="h-full bg-center"
            src="https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Picture"
            width={1920}
            height={900}
            blurDataURL="https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            placeholder="blur"
            loading="eager"
            objectFit="cover"
          />
        </div>
      </section>
      <section className="container mx-auto space-y-2 bg-gray-50 px-8  py-10 lg:px-12 xl:px-20">
        <div className="flex flex-row items-center justify-between">
          <span className="text-2xl font-bold">Our Favorites</span>
          <span className="text-sm text-indigo-600">
            Browse all favorites {"->"}
          </span>
        </div>
        <div className="grid w-full grid-cols-1 gap-8 py-6 md:grid-cols-3 lg:grid-cols-3">
          <div className="flex flex-col">
            <Image
              className="rounded"
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
              alt="Picture"
              width={400}
              height={600}
              blurDataURL="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
              placeholder="blur"
              loading="eager"
              objectFit="cover"
            />
            <div className="flex flex-col space-y-2 pt-4">
              <span className="font-semibold text-gray-800">
                Mint Layered T-Shirt
              </span>
              <span className="text-gray-600">$30</span>
            </div>
          </div>
          <div className="flex flex-col">
            <Image
              className="rounded"
              src="https://images.unsplash.com/photo-1610142991820-e02266a4a9f0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHdvbWFuJTIwdCUyMHNoaXJ0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              alt="Picture"
              width={400}
              height={600}
              blurDataURL="https://images.unsplash.com/photo-1610142991820-e02266a4a9f0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHdvbWFuJTIwdCUyMHNoaXJ0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              placeholder="blur"
              loading="eager"
              objectFit="cover"
            />
            <div className="flex flex-col space-y-2 pt-4">
              <span className="font-semibold text-gray-800">
                Mint Layered T-Shirt
              </span>
              <span className="text-gray-600">$30</span>
            </div>
          </div>
          <div className="flex flex-col">
            <Image
              className="rounded"
              src="https://images.unsplash.com/photo-1620279765075-91d8a7a1d007?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
              alt="Picture"
              width={400}
              height={600}
              blurDataURL="https://images.unsplash.com/photo-1620279765075-91d8a7a1d007?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
              placeholder="blur"
              loading="eager"
              objectFit="cover"
            />
            <div className="flex flex-col space-y-2 pt-4">
              <span className="font-semibold text-gray-800">
                Mint Layered T-Shirt
              </span>
              <span className="text-gray-600">$30</span>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-900">
        <div className="container mx-auto grid  h-[540px] grid-cols-1 overflow-hidden px-8 md:grid-cols-2 lg:px-12 xl:px-20">
          <div className="flex flex-col justify-center space-y-6 text-gray-100">
            <span className="pt-16 text-5xl font-bold">
              Final Stock. <br /> Up to 50% off.
            </span>
            <p>Shop the sale {"->"}</p>
          </div>
          <div className="relative">
            <div className="absolute -mt-8 hidden grid-cols-3 items-center justify-center gap-8  xl:grid">
              <div className="z-0 grid grid-cols-1  gap-8">
                <Image
                  className="rounded-lg"
                  src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80"
                  alt="Picture"
                  width={200}
                  height={260}
                  blurDataURL="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80"
                  placeholder="blur"
                  loading="eager"
                  objectFit="cover"
                />
                <Image
                  className="rounded-lg"
                  src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                  alt="Picture"
                  width={200}
                  height={260}
                  blurDataURL="https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                  placeholder="blur"
                  loading="eager"
                  objectFit="cover"
                />
              </div>
              <div className="grid grid-cols-1 gap-8 ">
                <Image
                  className="rounded-lg"
                  src="https://images.unsplash.com/photo-1602452920335-6a132309c7c8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                  alt="Picture"
                  width={200}
                  height={260}
                  blurDataURL="https://images.unsplash.com/photo-1602452920335-6a132309c7c8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                  placeholder="blur"
                  loading="eager"
                  objectFit="cover"
                />
                <Image
                  className="rounded-lg"
                  src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                  alt="Picture"
                  width={200}
                  height={260}
                  blurDataURL="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                  placeholder="blur"
                  loading="eager"
                  objectFit="cover"
                />
                <Image
                  className="rounded-lg"
                  src="https://images.unsplash.com/photo-1495385794356-15371f348c31?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=319&q=80"
                  alt="Picture"
                  width={200}
                  height={260}
                  blurDataURL="https://images.unsplash.com/photo-1495385794356-15371f348c31?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=319&q=80"
                  placeholder="blur"
                  loading="eager"
                  objectFit="cover"
                />
              </div>
              <div className="grid grid-cols-1 gap-8 ">
                <Image
                  className="rounded-lg"
                  src="https://images.unsplash.com/photo-1619608176024-7906d3489cc7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                  alt="Picture"
                  width={200}
                  height={260}
                  blurDataURL="https://images.unsplash.com/photo-1619608176024-7906d3489cc7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                  placeholder="blur"
                  loading="eager"
                  objectFit="cover"
                />
                <Image
                  className="rounded-lg"
                  src="https://images.unsplash.com/photo-1598554747436-c9293d6a588f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=334&q=100"
                  alt="Picture"
                  width={200}
                  height={260}
                  blurDataURL="https://images.unsplash.com/photo-1598554747436-c9293d6a588f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=334&q=100"
                  placeholder="blur"
                  loading="eager"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default TestComponent;
