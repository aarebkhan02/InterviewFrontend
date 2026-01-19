import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Mic, Bot, User } from "lucide-react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useNavigate, useLocation } from "react-router-dom";
import VisionTracker from "./VisionTracker";
import BASE_URL from "../config";

function Interview() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [active, setActive] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [report, setReport] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const setupData = location.state;

  useEffect(() => {
    if (!setupData) {
      navigate("/setup");
    }
  }, [setupData]);

  const [metrics, setMetrics] = useState({
    confidence: 0,
    stress: 0,
    attention: 0,
    comfort: 0,
  });

  const bottomRef = useRef(null);

  const CHAT_API = `${BASE_URL}/chat`;
  const START_API = `${BASE_URL}/start_interview`;

  const { startListening } = useSpeechRecognition((text) => {
    setInput(text);
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (setupData && !active) {
      startInterview();
    }
  }, [setupData, active]);

  const startInterview = async () => {
    try {
      const formData = new FormData();
      formData.append("name", setupData.name || "");
      formData.append("topic", setupData.topic || "");
      formData.append("difficulty", setupData.difficulty || "Intermediate");
      formData.append("mode", setupData.mode || "Conceptual");

      if (setupData.resume) formData.append("resume", setupData.resume);
      if (setupData.notes) formData.append("notes", setupData.notes);

      const res = await axios.post(START_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages([{ role: "assistant", message: res.data.message }]);
      setActive(true);
      speak(res.data.message);
    } catch (err) {
      console.error("Start interview failed:", err);
      alert("Failed to start interview.");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || interviewEnded) return;

    const userText = input;
    setMessages((prev) => [...prev, { role: "user", message: userText }]);
    setInput("");

    try {
      const res = await axios.post(CHAT_API, { message: userText });

      if (res.data.ended) {
        navigate("/report", {
          state: {
            report: res.data.report,
            timeTaken: res.data.time_taken_seconds,
            metrics: metrics,
          },
        });
        return;
      }

      const botReply = res.data.message;
      setMessages((prev) => [...prev, { role: "assistant", message: botReply }]);

      if (voiceEnabled) speak(botReply);
    } catch (err) {
      const errorMsg = "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", message: errorMsg }]);
      speak(errorMsg);
    }
  };

  function speak(text, shouldListen = true) {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.3;

    utterance.onend = () => {
      if (shouldListen) startListening();
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070c] via-[#0b1220] to-black text-white flex flex-col lg:flex-row">
      
      {/* CHAT */}
      <div className="flex-1 flex justify-center px-2 sm:px-4">
        {active && (
          <div className="w-full max-w-4xl flex flex-col h-[92vh] lg:h-[95vh]">

            {/* Header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-400 rounded-full flex items-center justify-center">
                  <Bot className="text-black w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">AIVA Interviewer</p>
                  <p className="text-xs text-teal-400">Interview in progress</p>
                </div>
              </div>

              <button
                onClick={async () => {
                  const res = await axios.post(CHAT_API, { message: "end session" });
                  speak("Interview Completed Generating Your Report");
                  navigate("/report", {
                    state: {
                      report: res.data.report,
                      timeTaken: res.data.time_taken_seconds,
                      metrics: metrics,
                    },
                  });
                }}
                className="text-xs bg-red-500 text-white px-3 py-2 rounded-full"
              >
                End Session
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-3 sm:p-5">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "assistant" ? "items-start" : "justify-end"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 bg-teal-400 rounded-full flex items-center justify-center">
                      <Bot className="text-black w-3 h-3" />
                    </div>
                  )}

                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[80%] sm:max-w-xl text-sm ${
                      msg.role === "assistant"
                        ? "bg-slate-800 text-slate-200"
                        : "bg-teal-500 text-black"
                    }`}
                  >
                    {msg.message}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900 flex gap-2">
              <button
                onClick={startListening}
                className="p-2 sm:p-3 rounded-full bg-slate-800"
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
              </button>

              <input
                placeholder="Type your response..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border border-slate-700 rounded-full px-3 py-2 text-sm outline-none"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <button
                onClick={sendMessage}
                className="bg-teal-400 text-black px-4 rounded-full"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}
      </div>

      {/* SIDEBAR */}
      {active && (
        <div className="w-full lg:w-80 bg-[#0b1220] border-t lg:border-l border-slate-800 p-4 space-y-4">
          <div className="rounded-2xl bg-slate-800 h-48 overflow-hidden flex items-center justify-center">
            <VisionTracker onMetrics={setMetrics} />
          </div>

          <ProgressMetric title="Confidence" value={metrics.confidence} />
          <ProgressMetric title="Comfort" value={metrics.comfort} />
          <ProgressMetric title="Stress" value={metrics.stress} />
          <ProgressMetric title="Attention" value={metrics.attention} />
        </div>
      )}
    </div>
  );
}

function ProgressMetric({ title, value }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <div className="flex justify-between mb-2">
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-sm text-teal-400 font-semibold">{value}%</p>
      </div>
      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-400 to-cyan-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default Interview;
