import toast from "react-hot-toast";

const useNotification = () => {
  const showError = (message: string) => {
    console.log(message);
  };

  const showInfo = (message: string) => {
    toast.error(message, { icon: null });
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
