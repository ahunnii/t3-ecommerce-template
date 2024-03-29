import { Button } from "~/components/ui/button";

type TVideoHeroProps = {
  videoURL: string;
  title: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const VideoHero = () => {
  return (
    <div className="relative mb-12 flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute left-0 top-0  z-20 flex h-full w-full bg-black/40"></div>

      <video
        src="/videos/video-1.mp4"
        autoPlay
        loop
        muted
        className="absolute z-10 min-h-full w-auto min-w-full max-w-none"
      />

      <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center text-white">
        <div className="relative z-30 rounded-xl p-5 text-2xl text-white">
          <h1>Welcome to my site!</h1>
        </div>
      </div>
    </div>
  );
};

export default VideoHero;
