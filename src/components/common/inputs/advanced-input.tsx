import type { LucideIcon } from "lucide-react";
import type { FieldValues } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/styles";

type Props = {
  PrependSpan?: LucideIcon | React.FC;
  loading?: boolean;
  field: FieldValues;
  placeholder?: string;
};
export const AdvancedInput = ({
  PrependSpan,
  loading,
  field,
  placeholder,
}: Props) => {
  return (
    <div className="relative ">
      {PrependSpan && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">
            <PrependSpan />
          </span>
        </div>
      )}

      <Input
        type="text"
        disabled={loading}
        className={cn(
          "block w-full rounded-md py-1.5  text-gray-900     sm:text-sm sm:leading-6",
          PrependSpan && "pl-12"
        )}
        placeholder={placeholder ?? "Insert text here..."}
        {...field}
      />
    </div>
  );
};
