import type { ContactFormValues } from "~/modules/contact/types";
import { api } from "~/utils/api";

import { toastService } from "~/services/toast";

export const useEmail = () => {
  const { mutate: sendContactEmail, isLoading } =
    api.email.sendEmailInquiry.useMutation({
      onSuccess: () =>
        toastService.success("Email sent. We will get back to you shortly."),

      onError: (error) => toastService.error("Something went wrong", error),
    });

  const sendEmail = (data: ContactFormValues) => {
    sendContactEmail(data);
  };
  return {
    sendEmail,
    isSending: isLoading,
  };
};
