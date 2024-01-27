import StorefrontLayout from "~/components/layouts/storefront-layout";
import { useConfig } from "~/providers/style-config-provider";

const metadata = {
  title: `About Trend Anomaly`,
  description: "Break out the system!",
};
export const AboutUsPage = () => {
  const config = useConfig();
  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      <div className="py-10">
        <h1 className={config.layout.h1}>About Trend Anomaly</h1>
        <p className={config.layout.p}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat,
          leo at condimentum tempus, odio sapien dictum ante, blandit lacinia
          neque ante non nunc. Mauris scelerisque dolor mi, in euismod erat
          finibus ac. Phasellus vulputate erat tortor. Nulla laoreet, libero ac
          ornare gravida, orci ligula tincidunt erat, sit amet pellentesque enim
          nisl sed augue. Proin sed augue nisl. Quisque fringilla tristique nibh
          facilisis rutrum. Sed fringilla condimentum urna non vehicula. Nam
          tincidunt luctus velit, sed laoreet neque scelerisque non. Maecenas eu
          tincidunt neque. Nunc pellentesque et elit a vehicula. Donec tincidunt
          faucibus consequat. Sed quis felis rhoncus arcu commodo sollicitudin.
          Sed tristique consequat elit id facilisis. Curabitur egestas felis vel
          justo lacinia, ac fermentum quam tempor.
        </p>

        <p className={config.layout.p}>
          Quisque mollis at nibh id lacinia. Aenean ipsum enim, iaculis non
          accumsan id, gravida id nunc. Proin eros nulla, euismod et risus
          vitae, dignissim tristique odio. Cras eget condimentum mi. Integer
          sagittis velit arcu. Quisque finibus finibus mi non iaculis. Nulla eu
          dui pulvinar, tincidunt augue at, tempus tortor. Donec in ultricies
          lectus. Sed dignissim ipsum eu volutpat ornare. Morbi mollis neque ac
          magna molestie, ut ullamcorper sem imperdiet. Nam varius, ligula vel
          scelerisque faucibus, metus neque pharetra augue, a ultricies nisi
          turpis sed diam. Donec feugiat est ipsum, sed pretium augue finibus
          et.
        </p>

        <p className={config.layout.p}>
          Sed arcu lectus, hendrerit ac mauris quis, congue facilisis massa.
          Etiam dictum lorem eleifend, eleifend ligula fringilla, faucibus urna.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Pellentesque tincidunt nulla quis congue
          scelerisque. Maecenas vestibulum, elit eget maximus mattis, ipsum
          tellus mattis lorem, sit amet eleifend enim lorem tempus velit.
          Vivamus ac diam tincidunt, elementum arcu vitae, faucibus arcu.
          Pellentesque dapibus laoreet arcu in mattis. Mauris non diam quis
          turpis pretium auctor et eget ante. Nunc ante mauris, convallis eget
          velit non, hendrerit placerat est. Etiam a risus ipsum. Fusce
          consectetur ex vel eros commodo fermentum. Ut vitae tincidunt massa,
          vel fermentum nulla. Ut iaculis sed sapien sed faucibus.
        </p>
      </div>
    </StorefrontLayout>
  );
};
