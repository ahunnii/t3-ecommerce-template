import type { FC } from "react";

export type TToastService = {
  Toaster: FC;
  success: (message: string) => void;
  error: <Error>(message: string, error: Error) => void;
  inform: (message: string) => void;
};
