const VideoCard = ({ poster, src, likes, user }: any) => (
  <div className="group relative flex flex-col w-full gap-1 border border-black dark:border-white rounded-md break-inside-avoid cursor-pointer">
    <div className="relative w-full">
      <video
        className="object-contain rounded-md bg-black w-full"
        controlsList="nodownload"
        preload="auto"
        poster={poster}
        loop
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-3 left-3 invisible group-hover:visible flex items-center gap-2">
        <button type="button" className="flex items-center gap-1">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            color="#ff1418"
            className="drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]"
            height="15"
            width="15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
          </svg>
          <span className="text-center text-white text-xs drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]">
            {likes}
          </span>
        </button>
      </div>
      <div className="absolute top-2 right-2">
        <button type="button">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 192 512"
            color="#ffffff"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path>
          </svg>
        </button>
      </div>
      <div className="absolute bottom-0 p-2 w-full invisible group-hover:visible group-hover:flex bg-gradient-to-t from-black/70 to-transparent rounded-b-md">
        <div className="flex items-center gap-2">
          <img src={user.avatar} alt="user" className="rounded-full w-5 h-5" />
          <h1 className="text-xs font-semibold text-white">{user.name}</h1>
        </div>
      </div>
    </div>
  </div>
);

export default VideoCard;
