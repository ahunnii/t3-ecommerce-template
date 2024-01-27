import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Fragment, useEffect, useMemo, useState } from "react";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDown } from "lucide-react";

import { useConfig } from "~/providers/style-config-provider";
import type { Attribute } from "~/types";
import { cn } from "~/utils/styles";

export interface FilterProps {
  data: Attribute;
  valueKey: string;

  textStyles?: string;
  buttonStyles?: string;
  selectedStyles?: string;
  dividerStyles?: string;
}
export function SelectableFilter({ data, valueKey }: FilterProps) {
  const [selectedVariantValues, setSelectedVariantValues] = useState<
    { name: string }[]
  >([]);

  const searchParams = useSearchParams();
  const config = useConfig();
  const router = useRouter();

  const onClick = (id: string | null) => {
    const current = qs.parse(searchParams.toString());

    const query = { ...current, [valueKey]: id };

    if (!id) query[valueKey] = null;
    else if (current[valueKey] === id) query[valueKey] = null;

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  const formattedVariantValues = useMemo(() => {
    return data.values.split(";").map((variantValue) => {
      return {
        name: variantValue,
      };
    });
  }, [data]);

  const handleOnListboxChange = (
    newVariantValues: typeof formattedVariantValues
  ) => {
    setSelectedVariantValues(newVariantValues);
    onClick(newVariantValues.map((value) => value?.name).join(",") ?? null);
  };

  useEffect(() => {
    const current = qs.parse(searchParams.toString());
    const selected = current[valueKey] as string;

    const selectedPeople = formattedVariantValues.filter((person) =>
      selected?.split(",").includes(person.name)
    );

    setSelectedVariantValues(selectedPeople);
  }, [formattedVariantValues, searchParams, valueKey]);

  return (
    <div className="relative z-30 w-48">
      <Listbox
        value={selectedVariantValues}
        onChange={handleOnListboxChange}
        multiple
      >
        {/* <Listbox.Label>{data?.name}:</Listbox.Label> */}

        <div className="relative ">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            {selectedVariantValues.length === 0 && (
              <span className="text-muted-foreground">
                Filter by {data?.name}
              </span>
            )}

            {selectedVariantValues.length !== 0 && (
              <span className="block truncate">
                {selectedVariantValues.map((person) => person?.name).join(", ")}{" "}
              </span>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {formattedVariantValues.map((variant, variantIdx) => (
                <Listbox.Option
                  key={variantIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? config.filter.active : "text-gray-900"
                    }`
                  }
                  value={variant}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {variant.name}
                      </span>
                      {selected ? (
                        <span
                          className={cn(
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                            config.filter.selected
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>

    // <>
    //   <MultipleSelect people={formattedVariantValues} valueKey={valueKey} data={data} />
    // </>
  );
}
