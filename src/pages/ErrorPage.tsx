import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center -mt-10 min-h-screen">
      <h1 className="text-center text-4xl text-blue-400">404</h1>
      <p className="text-center text-lg">
        The page you are looking for is not available
      </p>
      <Link
        to={"/"}
        className="dark:bg-black px-4 py-2 dark:text-white mt-4 rounded-xl"
      >
        Back to home page
      </Link>
    </div>
  );
};

export default ErrorPage;
