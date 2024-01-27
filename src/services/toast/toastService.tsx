import type { FC } from "react";
import type { TToastService } from "./types";

export class ToastService {
  constructor(private service: TToastService) {}

  Toaster: FC = this.service.Toaster;

  success = (message: string) => {
    return this.service.success(message);
  };

  error = <Error,>(message: string, error: Error) => {
    return this.service.error(message, error);
  };

  inform = (message: string) => {
    return this.service.inform(message);
  };
}
