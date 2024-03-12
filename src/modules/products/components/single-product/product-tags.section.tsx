import { cn } from "~/utils/styles";

type Props = {
  tags: {
    name: string;
  }[];
};

export const ProductTagsSection = ({ tags }: Props) => {
  return (
    <div>
      <h3 className="text-lg font-bold">Tags</h3>
      <div className={cn("", "")}>
        {tags.length === 0 && <p>No tags provided.</p>}
        {tags.map((tags, idx) => {
          return (
            <span key={idx} className="bg-white text-black">
              {tags.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};
