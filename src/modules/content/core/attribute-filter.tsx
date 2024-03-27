import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import Button from "~/modules/categories/components/button";
import type { Attribute } from "~/types";
import { cn } from "~/utils/styles";

interface FilterProps {
  data: Attribute;
  valueKey: string;
  textStyles?: string;
  buttonStyles?: string;
  selectedStyles?: string;
  dividerStyles?: string;
}

const AttributeFilter: React.FC<FilterProps> = ({
  data,
  valueKey,
  ...props
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedValue = searchParams.get(valueKey);

  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      [valueKey]: id,
    };

    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="mb-8">
      <h3 className={cn("text-lg font-semibold text-white", props.textStyles)}>
        {data.name}
      </h3>
      <hr className={cn("my-2 border-purple-500 pb-4", props.dividerStyles)} />
      <div className="flex flex-wrap gap-2">
        {data.values.split(";").map((filter) => (
          <div key={filter} className="flex w-full items-center">
            <Button
              className={cn(
                "rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-800 max-lg:grow",
                selectedValue === filter &&
                  `bg-black text-white ${props.selectedStyles}`,
                props.buttonStyles
              )}
              onClick={() => onClick(filter)}
            >
              {filter}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributeFilter;
