import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// Google OAuth
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

function RegisterForm() {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register:', form);
  };

  // Custom Google Register
  const googleRegister = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      try {
        console.log('Google token response:', tokenResponse);
      } catch (error) {
        console.error('Google auth failed:', error);
      }
    },
    onError: () => {
      console.error('Google Sign Up Failed');
    },
  });

  return (
    <div className="flex items-center bg-gradient-to-r from-gray-200 to-gray-300 justify-center h-screen bg-cover bg-center overflow-hidden">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="bg-white/20 backdrop-blur-xl shadow-xl rounded-2xl flex w-[1000px] h-[700px] overflow-hidden border border-white/30">
        {/* Left Section */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <motion.h2 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-3xl font-bold mb-6 text-purple-700">
            Create Account
          </motion.h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name + Username grid */}
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="password" name="password" placeholder="Create Password" value={form.password} onChange={handleChange} required className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />

            {/* Register Button */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-md font-semibold shadow-md hover:shadow-lg transition">
              Register
            </motion.button>

            {/*Google Register Button */}
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} type="button" onClick={() => googleRegister()} className="flex items-center justify-center gap-2 w-full border py-3 rounded-md font-medium hover:bg-gray-50 transition">
              <FcGoogle size={22} /> Sign up with Google
            </motion.button>
          </form>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-purple-600 font-semibold">
              Log in
            </Link>
          </motion.p>
        </div>

        {/* Right Section */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-1/2 bg-purple-100 flex flex-col items-center justify-center text-center p-6">
          <h3 className="text-lg text-gray-600">Join us Today</h3>
          <h2 className="text-3xl font-bold text-purple-700 mb-6">Start your journey</h2>
          <motion.img src="/Images/Login.png" alt="Register illustration" className="w-200" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <RegisterForm />
    </GoogleOAuthProvider>
  );
}
