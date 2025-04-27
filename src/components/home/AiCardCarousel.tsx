import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Navigation, Pagination } from "swiper/modules";

const aiTools = [
  {
    title: "Swap Any Face in Any Photo — Instantly with AI!",
    description:
      "Ever wondered how you'd look in a movie scene or royal portrait? Swap faces in any image with jaw-dropping AI magic!",
    link: "/ai-tools/image-face-swap",
    image:
      "https://d3adwkbyhxyrtq.cloudfront.net/aivideo/images/1/612391212818/iswap.webp",
  },
  {
    title: "Transform Your Photos into Viral Ghibli Masterpieces – Instantly!",
    description:
      "Ever wondered what you’d look like in a magical Studio Ghibli world? Turn your photos into stunning Ghibli-style art!",
    link: "/ai-tools/ai-ghibli-style",
    image:
      "https://d3adwkbyhxyrtq.cloudfront.net/aivideo/images/1/898678190427/ghibli-banner.webp",
  },
  {
    title: "Turn Your Photos into Mind-Blowing 3D Art – Instantly!",
    description:
      "Transform any image into a stunning 3D object in seconds! Explore the future of visuals now!",
    link: "/ai-3d-generator",
    image:
      "https://d3adwkbyhxyrtq.cloudfront.net/aivideo/images/1/810759072345/3d.webp",
  },
];

const AiToolCarousel = () => {
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        className="w-full"
      >
        {aiTools.map((tool, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-violet-500 text-white p-6 rounded-md h-full sm:max-h-72">
              <div className="sm:w-[40%] w-full flex justify-center items-center h-full">
                <img
                  src={tool.image}
                  alt={tool.title}
                  className="rounded-md object-contain border aspect-[4/3] max-h-full"
                />
              </div>
              <div className="sm:w-[60%] w-full flex flex-col justify-center text-center sm:text-left gap-2">
                <h2 className="text-2xl font-bold">{tool.title}</h2>
                <p className="text-sm">{tool.description}</p>
                <a
                  href={tool.link}
                  className="px-4 py-2 bg-pink-500 rounded text-white font-semibold text-sm self-center sm:self-start hover:bg-pink-600 transition"
                >
                  Try for Free
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AiToolCarousel;
