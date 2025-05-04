import "swiper/swiper-bundle.css";

import { Swiper, SwiperSlide } from "swiper/react";

import { NavLink } from "react-router";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const aiTools = [
  {
    title: "Edit Node Parameters with a Sleek Modal UI",
    description:
      "Easily configure model types, prompt templates, and API endpoints using a real-time validated Tailwind-powered modal interface.",
    link: "/ai-tools/image-face-swap",
    image:
      "https://d3adwkbyhxyrtq.cloudfront.net/aivideo/images/1/612391212818/iswap.webp",
  },
  {
    title: "Build AI Workflows Visually with Pre-Built Actions",
    description:
      "Drag, drop, and connect powerful AI tasks like 'Summarize Text' or 'Generate Email' into seamless workflows with a modern automation builder UI.",
    link: "/ai-tools/ai-ghibli-style",
    image:
      "https://d3adwkbyhxyrtq.cloudfront.net/aivideo/images/1/898678190427/ghibli-banner.webp",
  },
  {
    title: "See Data Flow in Real-Time Between AI Nodes",
    description:
      "Watch data move visually across your custom AI pipeline — every connection, every transformation, all in one clear automation graph.",
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
        autoplay={{ delay: 6000 }}
        loop
        className="w-full"
      >
        {aiTools.map((tool, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-blue-500 via-purple-500 to-violet-500 text-white p-6 rounded-md h-full sm:max-h-80">
              <div className="sm:w-[40%] w-full flex justify-center items-center h-full">
                <img
                  src={tool.image}
                  alt={tool.title}
                  className="rounded-md object-contain border aspect-[4/3] max-h-64"
                />
              </div>
              <div className="sm:w-[60%] w-full flex flex-col justify-center text-center sm:text-left gap-2">
                <h2 className="text-2xl font-bold">{tool.title}</h2>
                <p className="text-sm">{tool.description}</p>
                <NavLink
                  to={"/pipelines"}
                  className="px-4 py-2 mt-4 bg-pink-500 rounded text-white font-semibold text-sm self-center sm:self-start hover:bg-pink-600 transition"
                >
                  Get Started
                </NavLink>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AiToolCarousel;
