import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070c] via-[#0b1220] to-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-6 md:space-y-8 animate-fadeIn">

        {/* Logo */}
        <div
          className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-teal-400/20 
          flex items-center justify-center 
          shadow-2xl ring-4 ring-teal-400/30 
          animate-float mx-auto"
        >
          <div
            className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-teal-400 
            flex items-center justify-center"
          >
            <Bot className="text-black w-7 h-7 md:w-10 md:h-10" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold tracking-wide text-teal-400">
          AIVA
        </h1>

        {/* Description */}
        <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-lg px-2">
          An AI-powered virtual interviewer that simulates real technical interviews
          with live camera analysis and detailed performance reports.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/setup")}
          className="px-6 py-3 md:px-8 md:py-3 bg-teal-400 text-black rounded-full font-semibold text-base md:text-lg hover:scale-105 transition shadow-lg"
        >
          Start Interview
        </button>

      </div>
    </div>
  );
}
