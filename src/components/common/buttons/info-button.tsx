import { Info } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export const InfoButton = ({ summary }: { summary: string }) => {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger>
          <Info size={20} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-52">{summary}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
