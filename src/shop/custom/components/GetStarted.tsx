import { styles } from "./styles";

const bg_blue_gradient =
  "bg-gradient-to-br from-purple-100 via-purple-200 to-purple-500";
const text_gradient =
  "bg-gradient-to-br from-purple-100 via-purple-200 to-purple-500 text-transparent bg-clip-text";
const GetStarted = () => (
  <div
    className={`${styles.flexCenter} h-[140px] w-[140px] rounded-full ${bg_blue_gradient} cursor-pointer p-[2px]`}
  >
    <div
      className={`${styles.flexCenter} h-[100%] w-[100%] flex-col rounded-full bg-primary`}
    >
      <div className={`${styles.flexStart} flex-row`}>
        <p className="font-poppins text-[18px] font-medium leading-[23.4px]">
          <span className={text_gradient}>Get</span>
        </p>
        {/* <img src={arrowUp} alt="arrow-up" className="w-[23px] h-[23px] object-contain" /> */}
      </div>
      <p className="font-poppins text-[18px] font-medium leading-[23.4px]">
        <span className={text_gradient}>Started</span>
      </p>
    </div>
  </div>
);
export default GetStarted;
