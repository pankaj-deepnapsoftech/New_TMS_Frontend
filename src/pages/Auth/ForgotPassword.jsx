import { useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot Password Email:", email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 to-purple-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-lg rounded-2xl flex w-[1000px] h-[700px] overflow-hidden"
      >
        {/* Left Section */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-1/2 p-10 flex flex-col justify-center"
        >
          <h2 className="text-2xl font-bold mb-4">Forgot Password?</h2>
          <p className="text-gray-600 mb-6">
            Enter your email address below and we’ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition"
            >
              Send Reset Link
            </motion.button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/" className="text-purple-600 font-semibold hover:underline">
              Back to Login
            </Link>
          </p>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="w-1/2 bg-purple-50 flex flex-col items-center justify-center text-center p-6"
        >
          <h3 className="text-lg text-gray-600">Reset your password</h3>
          <h2 className="text-3xl font-bold text-purple-700 mb-6">Secure & Easy</h2>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            src="/Login.png"
            alt="Forgot Password Illustration"
            className="w-200"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
