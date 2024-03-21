import { Badge } from "~/components/ui/badge";
import { cn } from "~/utils/styles";

type Props = {
  materials: string[];
};

export const ProductMaterialsSection = ({ materials }: Props) => {
  return (
    <div>
      <h3 className="text-lg font-bold">Materials</h3>
      <div className={cn("", "")}>
        {materials.length === 0 && <p>No materials provided.</p>}
        {materials.map((material, idx) => {
          return (
            <Badge key={idx} variant={"secondary"}>
              {material}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
