import { NavLink } from "react-router";

const Navbar = () => {
  return (
    <div className="w-full flex items-center justify-center border-b border-slate-200 dark:border-slate-50 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between w-full max-w-[95%] md:max-w-[90%] py-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2 lg:gap-10">
          <div className="flex items-center">
            <NavLink
              className="flex items-center gap-2 self-start ml-8 md:ml-0 flex-shrink-0"
              to="/"
            >
              <img
                alt="Logo"
                width="44"
                height="44"
                className=""
                src="/mr-beast-logo.svg"
              />{" "}
              <span className="font-semibold text-xl">BeastAI</span>
            </NavLink>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-2">
          {/* Login Streak Button */}
          <button
            type="button"
            className="flex items-center gap-1 group relative border rounded sm:rounded-md text-sm p-1 sm:px-2 sm:py-1.5 border-gray-500"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 16 16"
              className="text-orange-500"
              height="18"
              width="18"
            >
              <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"></path>
            </svg>
            0{/* Tooltip */}
            <span className="absolute left-1/2 transform -translate-x-1/2 top-12 z-10 text-xs text-center p-2 font-medium rounded-md invisible group-hover:visible opacity-0 scale-75 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100 pointer-events-none">
              Login Streak
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full w-0 h-0 border-b-8 border-l-8 border-l-transparent border-r-8 border-r-transparent"></span>
            </span>
          </button>

          {/* Remaining Credits */}
          <div className="flex items-center gap-1 group cursor-pointer text-xs sm:text-sm relative border px-2 py-1.5 whitespace-nowrap rounded-md font-medium select-none">
            <svg
              fill="currentColor"
              viewBox="0 0 512 512"
              height="18"
              width="18"
            >
              <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c-.1 .1-.3 .1-.4 .2s0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336l0-35.4c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4l0 3.4 0 5.7 0 26.3zm32 0l0-32 0-25.9c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 44.2-86 80-192 80S0 476.2 0 432l0-35.4c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z"></path>
            </svg>
            0{/* Tooltip */}
            <span className="absolute left-1/2 transform -translate-x-1/2 top-10 md:top-12 z-10 text-xs p-2 rounded-md invisible group-hover:visible opacity-0 scale-75 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100 pointer-events-none">
              Remaining Credits
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full w-0 h-0 border-b-8 border-l-8 border-l-transparent border-r-8 border-r-transparent"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
