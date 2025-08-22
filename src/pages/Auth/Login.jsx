import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useLoginMutation } from '../../services/Auth.service';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function LoginForm() {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  // Google login
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google token response:', tokenResponse);
      // send tokenResponse.access_token to your backend
    },
    onError: () => {
      console.error('Google Sign In Failed');
    },
  });

  return (
    <div className="flex items-center bg-gradient-to-r from-gray-200 to-gray-300 justify-center h-screen bg-cover bg-center overflow-hidden">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="bg-white/20 backdrop-blur-xl shadow-xl rounded-2xl flex w-[1000px] h-[700px] overflow-hidden border border-white/30">
        {/* Left Section */}
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-purple-700">Log in</h2>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const res = await login({
                  username: values.email,
                  password: values.password,
                }).unwrap();

                console.log('Login success:', res);

                // Redirect after login
                navigate('/');
                // window.location.reload(); // if you want a full page reload
              } catch (error) {
                console.error('Login failed:', error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                <div className="relative">
                  <Field type="email" name="email" placeholder="Email Address" className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div className="relative">
                  <Field type="password" name="password" placeholder="Password" className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <Link to="/forgot-password" className="text-purple-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <motion.button disabled={isSubmitting || isLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition">
                  {isSubmitting || isLoading ? 'Logging in...' : 'Log in'}
                </motion.button>

                {/* Google Button */}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={() => googleLogin()} className="w-full border border-gray-300 py-3 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                  <FcGoogle className="text-xl" />
                  <span>Continue with Google</span>
                </motion.button>
              </Form>
            )}
          </Formik>

          <p className="mt-4 text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register" className="text-purple-600 font-semibold">
              Register
            </Link>
          </p>
        </motion.div>

        {/* Right Section */}
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="w-1/2 bg-purple-100 flex flex-col items-center justify-center text-center p-6">
          <h3 className="text-lg text-gray-600">Nice to see you again</h3>
          <h2 className="text-3xl font-bold text-purple-700 mb-6">Welcome back</h2>
          <motion.img src="/Images/Login.png" alt="Login illustration" className="w-200" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: 'easeOut' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <LoginForm />
    </GoogleOAuthProvider>
  );
}
