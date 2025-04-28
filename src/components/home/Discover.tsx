import VideoCard from "./AIVideos";

const Discover = () => {
  const videos = [
    {
      poster:
        "https://d3adwkbyhxyrtq.cloudfront.net/thumbnails/261561/287158963868/thumbnail.jpg",
      src: "https://d3adwkbyhxyrtq.cloudfront.net/videos/261561/287158963868/07f9a0b9-24b6-4e31-a2c8-63a8f5076bd8.mp4",
      likes: 9,
      user: { name: "grantsearfoss@icloud.com", avatar: "/user_profile.png" },
    },
    {
      poster:
        "https://d3adwkbyhxyrtq.cloudfront.net/thumbnails/67240/810394753890/thumbnail.jpg",
      src: "https://d3adwkbyhxyrtq.cloudfront.net/videos/67240/810394753890/aa554941-0522-4bc5-a20f-d6d0fb1221c5.mp4",
      likes: 3,
      user: {
        name: "Seb Watts",
        avatar:
          "https://lh3.googleusercontent.com/a/ACg8ocJSeiM8FlhkYZ4wbCmms-TnOscNPqolOczEVN0rfNKr9zaxP4k=s96-c",
      },
    },
  ];

  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-bold">Discover</h2>
          <div className="flex flex-col items-end relative text-left w-40">
            <div className="flex items-center gap-2 w-full">
              <label
                htmlFor="menu-button"
                className="text-gray-500 text-sm font-medium whitespace-nowrap dark:text-secondary-text"
              >
                Sort By:
              </label>
              <button
                type="button"
                className="flex items-center justify-between gap-1 w-full rounded bg-white dark:bg-secondary-bg dark:text-primary-text px-2 py-1 text-sm font-medium text-gray-600 border border-gray-600 hover:bg-gray-50 whitespace-nowrap"
              >
                New
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 448 512"
                  className="transform transition duration-400"
                  height="14"
                  width="14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scroll">
          {[
            "AI Videos",
            "AI Images",
            "AI Captions",
            "AI Story",
            "Fake Text",
            "AI Podcast",
          ].map((item, index) => (
            <p
              key={index}
              className={`text-sm px-2 py-1 cursor-pointer whitespace-nowrap font-semibold ${
                item === "AI Videos"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : ""
              }`}
            >
              {item}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 w-full pb-6">
          {videos.map((video, idx) => (
            <div key={idx} className="w-1/4 space-y-3">
              <VideoCard {...video} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
