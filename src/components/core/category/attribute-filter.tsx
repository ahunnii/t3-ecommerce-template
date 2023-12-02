import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import Button from "~/components/core/ui/button";
import type { Attribute } from "~/types";
import { cn } from "~/utils/styles";

interface FilterProps {
  data: Attribute;

  valueKey: string;
}

const AttributeFilter: React.FC<FilterProps> = ({ data, valueKey }) => {
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
      <h3 className="text-lg font-semibold">{data.name}</h3>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        {data.values.split(";").map((filter) => (
          <div key={filter} className="flex items-center">
            <Button
              className={cn(
                "rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-800",
                selectedValue === filter && "bg-black text-white"
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
