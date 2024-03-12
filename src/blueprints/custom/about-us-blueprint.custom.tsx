import parse from "html-react-parser";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import StorefrontLayout from "~/components/layouts/storefront-layout";
import { useConfig } from "~/providers/style-config-provider";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

const metadata = {
  title: `About Trend Anomaly`,
  description: "Break out the system!",
};
export const AboutUsPage = () => {
  const config = useConfig();
  const { data: aboutContent, isLoading } = api.store.getAboutPage.useQuery({});

  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      <div className="py-10">
        <h1 className={config.layout.h1}>About Trend Anomaly</h1>

        {isLoading && <AbsolutePageLoader />}

        {!isLoading && (
          <>
            {aboutContent?.content?.aboutPage === "" ||
            aboutContent?.content?.aboutPage === null ||
            aboutContent?.content?.aboutPage?.length === 0 ? (
              <div className={cn("", "")}>
                <p>No description provided.</p>
              </div>
            ) : (
              <div className={cn("py-4", config.layout.p)}>
                {parse(aboutContent?.content?.aboutPage ?? "")}
              </div>
            )}
          </>
        )}
      </div>
    </StorefrontLayout>
  );
};
