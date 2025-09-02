// TMSAccessUI.jsx
import { Ban, ShieldAlert, ArrowLeft, Home } from "lucide-react";

/** Full-page "Access Denied" (no routing required) */
export function AccessDenied({ title = "Access Denied", message = "You are not allowed to access this page. Please contact your administrator if you believe this is a mistake." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-red-50 flex items-center justify-center shadow">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">{title}</h1>
        <p className="mt-3 text-gray-600">{message}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow transition"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Ban className="w-4 h-4" />
          <span>TMS permission required</span>
        </div>
      </div>
    </div>
  );
}

/** Full-page branded loading splash (reusable) */
export function LoadingSplash({
  appName = "TMS Software",
  logoSrc = "/logo.png",
  loadingText = "Loading your workspace…",
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="flex items-center gap-3 mb-8">
        <img src={logoSrc} alt="TMS Logo" className="w-14 h-14 rounded-xl shadow-lg object-contain" />
        <h1 className="text-2xl font-bold text-blue-700">{appName}</h1>
      </div>

      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-5" />

      <p className="text-gray-700 font-medium mb-4">{loadingText}</p>

      {/* Indeterminate progress bar */}
      <div className="relative w-64 h-2 rounded-full overflow-hidden bg-white/70 shadow-inner">
        <div className="absolute inset-0 -translate-x-full h-full bg-blue-600 animate-[tms-progress_1.8s_ease-in-out_infinite]" />
      </div>

      <p className="text-xs text-gray-500 mt-8">© {new Date().getFullYear()} TMS. All rights reserved.</p>

      <style>
        {`
          @keyframes tms-progress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
}

export function Guard({ allowed, children }) {
  if (!allowed) return <AccessDenied />;
  return <>{children}</>;
}
