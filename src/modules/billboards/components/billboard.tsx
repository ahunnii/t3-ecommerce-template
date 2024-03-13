import type { Billboard as BillboardType } from "@prisma/client";
import type { FC } from "react";
import { cn } from "~/utils/styles";

type TBillboardProps = {
  data: BillboardType;
  textStyle?: string;
  bgStyle?: string;
  disableImage?: boolean;
};

const Billboard: FC<TBillboardProps> = ({
  data,
  textStyle = "text-black",
  bgStyle = "",
  ...props
}) => {
  const imageStyle = props?.disableImage
    ? {}
    : { backgroundImage: `url(${data?.imageUrl})` };
  return (
    <div className="overflow-hidden rounded-xl p-4 sm:p-6 lg:p-8">
      <div
        style={imageStyle}
        className={cn(
          "relative aspect-square overflow-hidden rounded-xl bg-cover saturate-50 md:aspect-[3.4/1]",
          bgStyle
        )}
      >
        <div className=" flex h-full w-full flex-col justify-center gap-y-8 text-center  backdrop-brightness-[.45]">
          <div
            className={cn(
              "mx-auto max-w-xs text-3xl font-bold sm:max-w-xl sm:text-5xl lg:text-6xl",
              textStyle
            )}
          >
            {data?.label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billboard;
