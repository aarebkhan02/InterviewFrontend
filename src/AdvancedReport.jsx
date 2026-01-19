
import { useLocation, useNavigate } from "react-router-dom";

/* ----------------- Circle Component ----------------- */
function Circle({ value, color }) {
    const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

    return (
        <div className="relative w-20 h-20">
            <svg className="w-full h-full rotate-[-90deg]">
                <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#1e293b"
                    strokeWidth="8"
                    fill="none"
                />
                <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke={color}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={(1 - safeValue / 100) * 2 * Math.PI * 34}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {safeValue}%
            </div>
        </div>
    );
}

/* ----------------- Score Card ----------------- */
function ScoreCard({ title, value, color, desc }) {
    return (
        <div className="bg-slate-900 rounded-xl p-4 flex gap-4 items-center">
            <Circle value={value} color={color} />
            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-slate-400">{desc}</p>
            </div>
        </div>
    );
}

/* ----------------- Main Component ----------------- */
export default function AdvancedReport() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        navigate("/");
        return null;
    }

    const { report, timeTaken } = state;

    if (!report) {
        navigate("/");
        return null;
    }

    const scores = report.scores || {
        overall: 0,
        completeness: 0,
        communication: 0,
        technical: 0,
        confidence: 0,
    };

    const strongSkills = report.strong_skills?.length ? report.strong_skills : [];
    const moderateSkills = report.moderate_skills?.length ? report.moderate_skills : [];
    const weakSkills = report.weak_skills?.length ? report.weak_skills : [];
    const weaknesses = report.weaknesses?.length ? report.weaknesses : [];

    const strongCount = strongSkills.length;
    const moderateCount = moderateSkills.length;
    const weakCount = Math.max(weakSkills.length, weaknesses.length);

    const maxCount = Math.max(strongCount, moderateCount, weakCount, 1);

    const strongHeight = (strongCount / maxCount) * 100;
    const moderateHeight = (moderateCount / maxCount) * 100;
    const weakHeight = (weakCount / maxCount) * 100;

    return (
        <div className="min-h-screen bg-black text-white p-6">

            {/* ---------------- HEADER ---------------- */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-teal-400">
                        Interview Analytics Report
                    </h1>
                    <p className="text-slate-400">
                        Time Taken: {timeTaken} seconds
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => window.print()}
                        className="px-5 py-2 bg-slate-700 rounded-full hover:bg-slate-600"
                    >
                        Download PDF
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="px-5 py-2 bg-teal-400 text-black rounded-full font-semibold"
                    >
                        New Interview
                    </button>
                </div>
            </div>

            {/* ---------------- GRID ---------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* ---------------- LEFT: SCORES ---------------- */}
                <div className="space-y-4">
                    <ScoreCard title="Overall Score" value={scores.overall} color="#22d3ee" desc="Overall interview performance" />
                    <ScoreCard title="Completeness" value={scores.completeness} color="#60a5fa" desc="How well answers covered topics" />
                    <ScoreCard title="Communication" value={scores.communication} color="#34d399" desc="Clarity and structure of answers" />
                    <ScoreCard title="Technical Knowledge" value={scores.technical} color="#f87171" desc="Technical correctness" />
                    <ScoreCard title="Confidence Meter" value={scores.confidence} color="#22c55e" desc="Confidence in explanations" />
                </div>

                {/* ---------------- CENTER: SKILLS + GRAPH ---------------- */}
                <div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-6">

                    {/* SKILLS */}
                    <div className="space-y-4">

                        <div className="bg-slate-800 p-4 rounded-xl">
                            <h3 className="text-red-400 font-semibold mb-2">Weak Skills</h3>
                            <p className="text-sm text-slate-300">
                                {weakSkills.length ? weakSkills.join(", ") : "None"}
                            </p>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-xl">
                            <h3 className="text-yellow-400 font-semibold mb-2">Moderate Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {moderateSkills.length
                                    ? moderateSkills.map((s, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-700 rounded">{s}</span>
                                    ))
                                    : <span className="text-slate-400">None</span>
                                }
                            </div>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-xl">
                            <h3 className="text-green-400 font-semibold mb-2">Strong Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {strongSkills.length
                                    ? strongSkills.map((s, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-700 rounded">{s}</span>
                                    ))
                                    : <span className="text-slate-400">None</span>
                                }
                            </div>
                        </div>

                    </div>

                    {/* GRAPH */}
                    <div className="bg-slate-800 rounded-xl p-4">
                        <h2 className="font-semibold mb-4">Skill Analysis</h2>

                        <div className="h-48 flex items-end gap-6 justify-center">
                            <div className="w-12 bg-red-400 rounded" style={{ height: `${weakHeight}%` }} title={`Weak: ${weakCount}`}></div>
                            <div className="w-12 bg-yellow-400 rounded" style={{ height: `${moderateHeight}%` }} title={`Moderate: ${moderateCount}`}></div>
                            <div className="w-12 bg-green-400 rounded" style={{ height: `${strongHeight}%` }} title={`Strong: ${strongCount}`}></div>
                        </div>

                        <div className="flex justify-center gap-6 mt-4 text-sm text-slate-400">
                            <span>Weak</span>
                            <span>Moderate</span>
                            <span>Strong</span>
                        </div>
                    </div>

                </div>

                {/* ---------------- RIGHT: SUMMARY ---------------- */}
                <div className="bg-slate-900 p-6 rounded-xl text-sm text-slate-300 space-y-6">

                    <div>
                        <h3 className="text-teal-400 font-semibold text-lg">Summary</h3>
                        <p>{report.summary}</p>
                    </div>

                    <div>
                        <h3 className="text-green-400 font-semibold text-lg">Strengths</h3>
                        <ul className="list-disc ml-5">
                            {report.strengths?.length ? report.strengths.map((s, i) => <li key={i}>{s}</li>) : <li>None</li>}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-red-400 font-semibold text-lg">Weaknesses</h3>
                        <ul className="list-disc ml-5">
                            {weaknesses.length ? weaknesses.map((s, i) => <li key={i}>{s}</li>) : <li>None</li>}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-yellow-400 font-semibold text-lg">Recommendation</h3>
                        <p>{report.recommendation}</p>
                    </div>

                    <div>
                        <h3 className="text-teal-400 font-semibold text-lg">Overall Rating</h3>
                        <p className="text-4xl font-bold text-teal-400">
                            {scores.overall} / 100
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}
