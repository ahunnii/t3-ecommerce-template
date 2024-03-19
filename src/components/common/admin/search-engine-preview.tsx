import { env } from "~/env.mjs";
import { EditSection } from "../sections/edit-section.admin";

export const SearchEnginePreview = ({
  name,
  slug,
  description,
  type,
}: {
  name: string;
  slug?: string;
  description: string;
  type: string;
}) => {
  return (
    <EditSection
      title="Search Engine Preview"
      description="This is how your collection appears in search engines."
    >
      <div className="space-y-1 leading-none">
        <h5 className=" mb-[0.125rem] break-words text-[1.125rem] leading-[1.3125rem] text-[#1a0dab]">
          {name}
        </h5>
        <p className="mb-[0.125rem] break-words text-[.8125rem] leading-4 text-[#006621]">
          {env.NEXT_PUBLIC_URL}/{type}/
          {slug ?? name.toLowerCase().split(" ").join("-")}
        </p>
        <p className="line-clamp-5  break-words text-[.8125rem] leading-[1.125rem] text-[#545454]">
          {description}
        </p>
      </div>
    </EditSection>
  );
};
