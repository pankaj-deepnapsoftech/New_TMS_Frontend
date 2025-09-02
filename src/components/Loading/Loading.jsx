export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Logo / App Name */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-blue-700">TMS Software</h1>
      </div>

      {/* Spinner */}
      <div className="relative flex justify-center items-center mb-6">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Loading Text */}
      <p className="text-gray-700 font-medium mb-4">Loading your dashboard...</p>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 animate-[progress_2s_ease-in-out_infinite]" />
      </div>

      {/* Small Footer */}
      <p className="text-xs text-gray-500 mt-8">© {new Date().getFullYear()} TMS. All rights reserved.</p>

      {/* Tailwind custom animation */}
      <style>
        {`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
}
