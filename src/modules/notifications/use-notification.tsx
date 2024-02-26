import toast from "react-hot-toast";
import { toastService } from "~/services/toast";

const useNotification = () => {
  const showError = (message: string) => {
    console.log(message);
  };

  const showInfo = (message: string) => {
    toastService.inform(message);
  };

  const showSuccess = (message: string) => {
    console.log(message);
  };

  return {
    showError,
    showInfo,
    showSuccess,
  };
};

export default useNotification;
