import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface HeadingProps {
  title: string;
  description: string;
  isTooltip?: boolean;
  tooltipContent?: string;
  tooltipDelayDuration?: number;
}

export const AdminClientHeading: React.FC<HeadingProps> = ({
  title,
  description,
  tooltipContent,
  tooltipDelayDuration = 250,
  isTooltip = false,
}) => {
  return (
    <div>
      <h1 className="flex items-start gap-1 text-3xl font-bold tracking-tight">
        {title}
        {isTooltip && (
          <TooltipProvider delayDuration={tooltipDelayDuration}>
            <Tooltip>
              <TooltipTrigger className="text-left">
                <HelpCircle className="ml-1 h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-96  text-sm font-normal text-zinc-700 ">
                  {tooltipContent}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
