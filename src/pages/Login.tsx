import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email))
      newErrors.email = "Enter a valid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 5)
      newErrors.password = "Password must be at least 5 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      login(1);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="bg-white dark:bg-black dark:border-gray-700 rounded-lg shadow-2xl border border-slate-200 p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <img src="/mr-beast-logo.svg" alt="Beast AI" className="h-12" />
          <span className="font-medium text-xl">Beast AI</span>
        </div>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md py-2 mb-4 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition cursor-pointer">
          <FaGoogle /> <span> Login with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <div className="flex-grow border-t dark:border-gray-700"></div>
          OR CONTINUE WITH
          <div className="flex-grow border-t dark:border-gray-700"></div>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={loginSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md bg-slate-50 dark:bg-slate-200 text-gray-900 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md bg-slate-50 dark:bg-slate-200 text-gray-900 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-white dark:bg-black text-black dark:text-white font-medium py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            Login
          </button>
        </form>

        {/* Additional Links */}
        <div className="flex justify-between mt-4 text-xs text-gray-600 dark:text-gray-300">
          <a href="#" className="hover:underline">
            Login with OTP
          </a>
          <a href="#" className="hover:underline">
            Forgot Password? Reset
          </a>
        </div>

        {/* Signup */}
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 text-center">
          Don't have an account?{" "}
          <Link to={"/login"} className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>

        {/* Terms */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          By clicking Submit, you agree to our{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
