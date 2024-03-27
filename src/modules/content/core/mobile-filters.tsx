"use client";

import { Dialog } from "@headlessui/react";
import { Plus, X } from "lucide-react";
import { useState } from "react";

import IconButton from "~/components/common/buttons/icon-button";
import Button from "~/modules/categories/components/button";

import type { Attribute } from "@prisma/client";
import AttributeFilter from "~/modules/categories/core/attribute-filter";

interface MobileFiltersProps {
  data: Attribute[];
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <Button
        onClick={onOpen}
        className="my-4 flex items-center gap-x-2 lg:hidden"
      >
        Filters
        <Plus size={20} />
      </Button>

      <Dialog
        open={open}
        as="div"
        className="relative z-50 lg:hidden"
        onClose={onClose}
      >
        {/* Background color and opacity */}
        <div className="fixed inset-0 bg-black bg-opacity-25" />

        {/* Dialog position */}
        <div className="fixed inset-0 z-40 flex">
          <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-zinc-950 py-4 pb-6 shadow-xl">
            {/* Close button */}
            <div className="flex items-center justify-end px-4">
              <IconButton icon={<X size={15} />} onClick={onClose} />
            </div>
            <h2 className="px-4 text-3xl font-semibold text-white">Filters</h2>
            <div className="p-4">
              {data?.map((attribute, idx) => (
                <AttributeFilter
                  key={idx}
                  valueKey={`${attribute.name.toLowerCase()}Variant`}
                  data={attribute}
                />
              ))}{" "}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default MobileFilters;
