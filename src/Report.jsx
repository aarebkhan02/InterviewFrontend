import { useLocation, useNavigate } from "react-router-dom";

export default function Report() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white px-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-teal-400 text-black rounded-full"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { report, timeTaken } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b1220] to-black text-white px-4 py-6 sm:px-6 sm:py-8">
      <div className="max-w-5xl mx-auto bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-slate-800">

        <h1 className="text-2xl sm:text-4xl font-bold text-teal-400 mb-3 sm:mb-4">
          Interview Analytics Report
        </h1>

        <p className="text-slate-400 text-sm sm:text-base mb-5 sm:mb-8">
          Time Taken: <span className="text-white">{timeTaken} seconds</span>
        </p>

        <div className="bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 whitespace-pre-wrap text-slate-200 text-sm sm:text-base leading-relaxed">
          {report}
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-3 bg-teal-400 text-black rounded-full font-semibold text-sm sm:text-base"
          >
            Start New Interview
          </button>
        </div>

      </div>
    </div>
  );
}
