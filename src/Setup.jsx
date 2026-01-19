import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Setup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    difficulty: "Beginner",
    mode: "Conceptual",
    topic: "",
    resume: null,
    notes: null,
  });

  const btnBase =
    "px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border";
  const btnActive =
    "bg-gradient-to-r from-cyan-400 to-teal-400 text-black border-cyan-300 shadow-lg shadow-cyan-400/40";
  const btnIdle =
    "bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-700/70";

  const canStart = () => {
    if (!form.name.trim()) return false;
    if (form.topic.trim()) return true;
    if (form.resume) return true;
    if (form.notes) return true;
    return false;
  };

  const getSourceLabel = () => {
    const sources = [];
    if (form.topic.trim()) sources.push("Topic");
    if (form.resume) sources.push("Resume");
    if (form.notes) sources.push("Notes");
    if (sources.length === 0) return "No source selected";
    return "Using: " + sources.join(" + ");
  };

  const startInterview = () => {
    if (!canStart()) {
      alert("Enter your name and choose Topic OR Resume OR Notes");
      return;
    }
    navigate("/interview", { state: form });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050b18] px-4 py-6">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/10 to-teal-900/20"></div>

      <div className="relative z-10 w-full max-w-md sm:max-w-lg bg-[#081326]/90 backdrop-blur-xl border border-cyan-400/20 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-500/20">

        <h1 className="text-xl sm:text-2xl font-bold text-cyan-400 text-center mb-3">
          Interview Setup
        </h1>

        {/* Name */}
        <div className="mb-4">
          <label className="text-xs text-slate-300">Your Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mt-1 bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none"
            placeholder="Enter your name"
          />
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <label className="text-xs text-slate-300">Difficulty Level</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {["Beginner", "Intermediate", "Advanced"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setForm({ ...form, difficulty: d })}
                className={`${btnBase} ${
                  form.difficulty === d ? btnActive : btnIdle
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Mode */}
        <div className="mb-4">
          <label className="text-xs text-slate-300">Interview Mode</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {["Conceptual", "Theory", "Mixed"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setForm({ ...form, mode: m })}
                className={`${btnBase} ${
                  form.mode === m ? btnActive : btnIdle
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Source Indicator */}
        <div className="mb-3 text-center">
          <span
            className={`text-[11px] sm:text-xs px-3 py-1 rounded-full border ${
              canStart()
                ? "border-cyan-400/40 text-cyan-300 bg-cyan-400/10"
                : "border-slate-600 text-slate-400 bg-slate-800/40"
            }`}
          >
            {getSourceLabel()}
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">

          {/* Topic */}
          <div>
            <label className="text-xs text-slate-300">Topic</label>
            <input
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="w-full mt-1 bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white outline-none"
              placeholder="Enter Topic"
            />
          </div>

          {/* Resume */}
          <div>
            <label className="text-xs text-slate-300">Resume</label>
            <label className="block mt-1 cursor-pointer">
              <div className="px-3 py-2 rounded-xl border border-dashed border-cyan-400/40 text-xs sm:text-sm text-cyan-300 bg-slate-900/60 text-center hover:bg-slate-800/60 transition truncate">
                {form.resume ? form.resume.name : "📄 Upload"}
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setForm({ ...form, resume: e.target.files?.[0] || null })
                }
              />
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-slate-300">Notes</label>
            <label className="block mt-1 cursor-pointer">
              <div className="px-3 py-2 rounded-xl border border-dashed border-cyan-400/40 text-xs sm:text-sm text-cyan-300 bg-slate-900/60 text-center hover:bg-slate-800/60 transition truncate">
                {form.notes ? form.notes.name : "📘 Upload"}
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.files?.[0] || null })
                }
              />
            </label>
          </div>

        </div>

        <p className="text-[11px] sm:text-xs text-center text-slate-400 mb-4">
          You can use any of them. The interview will be generated from what you provided.
        </p>

        {/* Start */}
        <button
          type="button"
          onClick={startInterview}
          className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-bold text-sm sm:text-base hover:scale-105 transition shadow-xl shadow-cyan-400/40"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}
