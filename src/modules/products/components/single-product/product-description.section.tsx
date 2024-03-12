import parse from "html-react-parser";
import { cn } from "~/utils/styles";

type Props = {
  description: string | undefined | null;
};

export const ProductDescriptionSection = ({ description }: Props) => {
  const isDescriptionInvalid =
    description === "" || description === null || description?.length === 0;
  return (
    <div>
      <h3 className="text-lg font-bold">Description</h3>

      {isDescriptionInvalid ? (
        <div className={cn("", "")}>
          <p>No description provided.</p>
        </div>
      ) : (
        <div className={cn("", "")}>{parse(description ?? "")}</div>
      )}
    </div>
  );
};
