import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-200 to-green-200">
      <div className="bg-white shadow-lg rounded-2xl flex w-[900px] h-[500px] overflow-hidden">
        {/* Left Section */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6">Log in.</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <a href="#" className="text-sm text-purple-600 self-end">
              Forgot password?
            </a>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition"
            >
              Log in
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 w-full border py-3 rounded-md font-medium hover:bg-gray-100 transition"
            >
              <FcGoogle size={22} /> Sign in with Google
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            Don’t have an account? <a href="#" className="text-purple-600 font-semibold">Register</a>
          </p>
        </div>

        {/* Right Section */}
        <div className="w-1/2 bg-purple-50 flex flex-col items-center justify-center text-center p-6">
          <h3 className="text-lg text-gray-600">Nice to see you again</h3>
          <h2 className="text-2xl font-bold text-purple-700 mb-6">Welcome back</h2>
          <img src="/Images/login-illustration.png" alt="login illustration" className="w-72" />
        </div>
      </div>
    </div>
  );
}
