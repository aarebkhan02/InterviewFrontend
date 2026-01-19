import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Mic, Bot, User } from "lucide-react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Report from "./Report";
import Setup from "./Setup";
import Home from "./Home";
import Interview from "./Interview";






export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/report" element={<Report/>} />
    </Routes>
  );
}


