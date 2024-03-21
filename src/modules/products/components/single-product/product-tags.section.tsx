import { Badge } from "~/components/ui/badge";
import { cn } from "~/utils/styles";

type Props = {
  tags: string[];
};

export const ProductTagsSection = ({ tags }: Props) => {
  return (
    <div>
      <h3 className="text-lg font-bold">Tags</h3>
      <div className={cn("flex gap-2", "")}>
        {tags.length === 0 && <p>No tags provided.</p>}
        {tags.map((tags, idx) => {
          return (
            <Badge key={idx} variant={"secondary"}>
              {tags}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
