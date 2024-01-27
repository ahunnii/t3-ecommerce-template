import { HotToastService } from "./hot-toast";
import { SonarToastService } from "./sonar-toast";

export const availableToastServices = {
  hotToast: HotToastService,
  sonar: SonarToastService,
};
