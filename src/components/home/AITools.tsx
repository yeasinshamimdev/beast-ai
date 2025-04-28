const AITools = () => {
  return (
    <div className="flex flex-col gap-2 w-full relative">
      <h2 className="text-2xl font-bold">AI Tools</h2>
      <div className="flex items-center gap-2 overflow-x-scroll scroll-smooth snap-x scroll-px-2 snap-mandatory w-full">
        <button className="absolute -left-4 z-10 text-white dark:text-black bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-70 p-2 rounded-full">
          {/* Left Arrow SVG */}
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

        {/* Example Tool Card */}
        <a
          href="/ai-story"
          className="flex flex-col items-center justify-center flex-shrink-0 gap-1 snap-end group relative whitespace-nowrap font-medium rounded bg-blue-500 text-white shadow-md hover:bg-blue-600 overflow-hidden border border-black dark:border-white"
        >
          <video
            className="object-contain bg-black w-52 h-full aspect-[4/3]"
            controlsList="nodownload"
            preload="auto"
            poster="https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/291857261393/3f32c743-15f5-4af7-a098-101f04e60635.jpg"
            loop
          >
            <source
              src="https://d3adwkbyhxyrtq.cloudfront.net/videos/186/949969578507/ba9216ab-bf40-4e3f-a006-7ca7644c6ed9.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="flex items-center gap-2 mb-1">
            {/* Example Icon */}
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="18"
              width="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828z" />
            </svg>
            AI Story
          </div>
        </a>

        {/* Repeat more <a> elements for other AI tools... */}

        <button className="absolute -right-4 z-10 text-white dark:text-black bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-70 p-2 rounded-full">
          {/* Right Arrow SVG */}
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

export default AITools;
