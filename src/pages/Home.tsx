import AIApps from "@/components/home/AIApps";
import AiToolCarousel from "@/components/home/AiCardCarousel";
import AITools from "@/components/home/AITools";
import Discover from "@/components/home/Discover";

const Home = () => {
  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-y-auto py-2 px-4 lg:px-8">
      <div className="flex w-full transition-all duration-300 ease-in-out">
        <div className="flex flex-col items-center h-full w-full scroll">
          <div className="flex flex-col gap-4 w-full">
            <AiToolCarousel />

            <AITools />
            <AIApps />
            <Discover />
          </div>
        </div>
      </div>
      <hr className="w-full dark:border-divider"></hr>
    </div>
  );
};

export default Home;
