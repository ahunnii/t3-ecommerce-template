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
            <span key={idx} className="text-black">
              {material}
            </span>
          );
        })}
      </div>
    </div>
  );
};
