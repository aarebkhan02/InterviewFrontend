

import { useRef } from "react";

export function useSpeechRecognition(onResult) {
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Chrome.");
      return;
    }

    // Agar pehle se object nahi bana
    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();

      recognition.lang = "en-US";
      recognition.continuous = false;     // ek sentence sunke band
      recognition.interimResults = false; // sirf final result

      recognition.onstart = () => {
        console.log("🎤 Mic listening started...");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("🎙️ Heard:", transcript);
        onResult(transcript);   // 👈 yahin input box fill hota hai
      };

      recognition.onerror = (event) => {
        console.error("❌ Speech error:", event.error);
      };

      recognition.onend = () => {
        console.log("🛑 Mic stopped");
      };

      recognitionRef.current = recognition;
    }

    // Already running ho to crash na kare
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.log("⚠️ Already listening...");
    }
  };

  return { startListening };
}
