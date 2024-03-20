import type { FieldValues } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/styles";

type Props = {
  appendSpan?: string;
  prependSpan?: string;
  loading?: boolean;
  field: FieldValues;
  placeholder?: string;
  appendClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
export const AdvancedNumericInput = ({
  appendSpan,
  prependSpan,
  loading,
  field,
  placeholder,
  appendClassName,
  ...props
}: Props) => {
  return (
    <div className="relative ">
      {prependSpan && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">{prependSpan}</span>
        </div>
      )}

      <Input
        type="number"
        disabled={loading}
        className={cn(
          "block w-full rounded-md py-1.5  text-gray-900     sm:text-sm sm:leading-6",
          prependSpan && "pl-7",
          appendSpan && "pr-14"
        )}
        min={prependSpan === "$" ? "0.01" : "0"}
        step={prependSpan === "$" ? "0.01" : "1"}
        // min="0.01"
        // step="0.01"
        placeholder={placeholder ?? "0"}
        {...field}
        {...props}
      />

      {appendSpan && (
        <div className="absolute inset-y-0 right-0 flex items-center">
          <span
            className={cn(
              "py-0 pl-2 pr-7 text-gray-500 sm:text-sm",
              appendClassName
            )}
          >
            {appendSpan}
          </span>
        </div>
      )}
    </div>
  );
};
