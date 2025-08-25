import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useRegisterMutation } from '../../services/Auth.service';

// Formik + Yup
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function RegisterForm() {
  // RTK Query mutation
  const [register, { isLoading }] = useRegisterMutation();

  // Validation Schema
  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required('Full name is required'),
    username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
      .required('Phone number is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  // Form Submit
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await register(values).unwrap();
      console.log('Register success:', res);
      resetForm();
    } catch (error) {
      console.error('Register failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Google Register
  const googleRegister = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google token response:', tokenResponse);
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

          {/* Formik Form */}
          <Formik
            initialValues={{
              full_name: '',
              username: '',
              email: '',
              phone: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                {/* Full Name + Username */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Field type="text" name="full_name" placeholder="Full Name" className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full" />
                    <ErrorMessage name="full_name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <Field type="text" name="username" placeholder="Username" className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full" />
                    <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <Field type="email" name="email" placeholder="Email Address" className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <Field type="tel" name="phone" placeholder="Phone Number" className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <Field type="password" name="password" placeholder="Create Password" className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Register Button */}
                <motion.button
                  disabled={isSubmitting || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-md font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50"
                >
                  {isLoading || isSubmitting ? 'Registering...' : 'Register'}
                </motion.button>

                {/* Google Register */}
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} type="button" onClick={() => googleRegister()} className="flex items-center justify-center gap-2 w-full border py-3 rounded-md font-medium hover:bg-gray-50 transition">
                  <FcGoogle size={22} /> Sign up with Google
                </motion.button>
              </Form>
            )}
          </Formik>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-semibold">
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

// Page Wrapper with GoogleOAuthProvider
export default function RegisterPage() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <RegisterForm />
    </GoogleOAuthProvider>
  );
}
