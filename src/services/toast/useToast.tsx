import { toastService } from ".";

export const useToast = () => {
  const { success, error, inform } = toastService;

  const notifySuccess = (message: string) => {
    success(message);
  };

  const notifyError = <Error,>(message: string, errorMessage: Error) => {
    error<Error>(message, errorMessage);
  };

  const notifyInform = (message: string) => {
    inform(message);
  };
  return {
    notifySuccess,
    notifyError,
    notifyInform,
  };
};
