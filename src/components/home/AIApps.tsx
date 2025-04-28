const AIApps = () => {
  return (
    <div className="flex flex-col gap-2 w-full relative">
      <h2 className="text-2xl font-bold">AI Apps</h2>
      <div className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x scroll-px-2 snap-mandatory w-full">
        {/* Left Scroll Button */}
        <button className="absolute -left-4 z-10 text-white dark:text-black bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-70 p-2 rounded-full">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 320 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"></path>
          </svg>
        </button>

        {/* AI App Cards */}
        {[
          {
            href: "/ai-tools/image-upscaler",
            image:
              "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/957111103504/cb320a8f-d900-46f3-9637-cb1a6adcc67b.jpg",
            title: "AI Image Upscaler",
          },
          {
            href: "/ai-tools/image-face-swap",
            image:
              "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/810757386575/bbdfbe2b-f038-49bd-ba36-970132d88c0d.jpg",
            title: "Image Face Swap",
          },
          // ... add more items here
        ].map((app, index) => (
          <a
            key={index}
            href={app.href}
            className="flex flex-col items-center justify-center flex-shrink-0 gap-1 snap-end group relative whitespace-nowrap font-medium rounded bg-blue-500 text-white text-sm shadow-md hover:bg-blue-600 overflow-hidden border border-black dark:border-white w-52"
          >
            <img
              src={app.image}
              alt={app.title}
              className="object-cover object-top bg-black w-full h-full aspect-[4/3]"
            />
            <span className="mb-1">{app.title}</span>
          </a>
        ))}

        {/* Right Scroll Button */}
        <button className="absolute -right-4 z-10 text-white dark:text-black bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-70 p-2 rounded-full">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 320 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AIApps;
