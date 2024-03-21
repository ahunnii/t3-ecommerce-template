import { File, PlusCircle } from "lucide-react";

import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { cn } from "~/utils/styles";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: string[];
  listRef: React.RefObject<HTMLElement>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export default function SearchSelectOptions({
  className,
  items = [],
  listRef,
  inputRef,
}: StoreSwitcherProps) {
  // const params = useParams();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === "k" && e.metaKey) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  React.useEffect(() => {
    const el = listRef.current;

    if (!el) return;

    if (open) {
      el.style.overflow = "hidden";
    } else {
      el.style.overflow = "";
    }
  }, [open, listRef]);

  const openSelectedProducts = () => {
    items.forEach((item) => {
      console.log(`/products/${item}`, "_blank");
    });
  };

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={open}
          className={cn(" justify-between", className)}
        >
          <p className="text-sm text-muted-foreground">
            Press{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-[999] w-[200px] p-0"
        side="top"
        align="end"
        sideOffset={16}
        alignOffset={0}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          inputRef?.current?.focus();
        }}
      >
        <Command>
          {" "}
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandGroup heading="Options">
              <CommandItem className="text-sm" onSelect={openSelectedProducts}>
                <File className="mr-2 h-4 w-4" />
                Open in new tab
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem>
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
