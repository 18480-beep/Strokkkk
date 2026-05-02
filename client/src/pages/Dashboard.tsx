/*
 * Dashboard.tsx
 * Patient Progress Dashboard — Surgical Theater aesthetic
 */

import { useLocation } from "wouter";
import { PATIENT, SESSIONS } from "@/lib/mockPatientData";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function Dashboard() {
  const [, navigate] = useLocation();

  // ── คำนวณสถิติ ──
  const totalSessions = SESSIONS.length;
  const completedSessions = SESSIONS.filter((s) => s.strokeGameDone).length;
  const consistency = Math.round((completedSessions / totalSessions) * 100);
  const avgArm = Math.round(SESSIONS.reduce((a, s) => a + s.armScore, 0) / totalSessions);
  const avgFace = Math.round(SESSIONS.reduce((a, s) => a + s.faceScore, 0) / totalSessions);
  const totalReps = SESSIONS.reduce((a, s) => a + s.armReps, 0);

  // ── ข้อมูลสำหรับกราฟ ──
  const chartData = SESSIONS.map((s) => ({
    date: s.date.slice(5),       // "04-21"
    arm: s.armScore,
    face: s.faceScore,
    reps: s.armReps,
  }));

  return (
    <div
      className="min-h-screen w-full overflow-y-auto"
      style={{ backgroundColor: "#0A0A0F", color: "#E0E8F0" }}
    >
      {/* scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)",
          opacity: 0.4,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-10" style={{ zIndex: 2 }}>

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p
              className="text-xs tracking-[0.25em] uppercase mb-1"
              style={{ fontFamily: "var(--font-mono)", color: "#00D4AA", opacity: 0.7 }}
            >
              Patient Dashboard
            </p>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "#E0E8F0" }}
            >
              {PATIENT.name}
            </h1>
            <div
              className="flex gap-4 mt-1 text-xs"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(180,190,200,0.5)" }}
            >
              <span>{PATIENT.id}</span>
              <span>·</span>
              <span>{PATIENT.diagnosis}</span>
              <span>·</span>
              <span>เริ่ม {PATIENT.startDate}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg border text-xs tracking-wider uppercase transition-all duration-300 hover:bg-[#00D4AA]/10"
            style={{
              fontFamily: "var(--font-mono)",
              borderColor: "rgba(0,212,170,0.3)",
              color: "#00D4AA",
              backgroundColor: "rgba(10,10,15,0.8)",
            }}
          >
            ← Back
          </button>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Consistency", value: `${consistency}%`, sub: `${completedSessions}/${totalSessions} sessions`, color: "#00D4AA" },
            { label: "Avg Arm Score", value: avgArm, sub: "out of 100", color: "#00D4AA" },
            { label: "Avg Face Score", value: avgFace, sub: "out of 100", color: "#00D4AA" },
            { label: "Total Reps", value: totalReps, sub: "arm exercises", color: "#FF6B00" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl p-5 border"
              style={{
                backgroundColor: "rgba(0,212,170,0.03)",
                borderColor: "rgba(0,212,170,0.1)",
              }}
            >
              <p
                className="text-xs tracking-widest uppercase mb-2"
                style={{ fontFamily: "var(--font-mono)", color: "rgba(180,190,200,0.5)" }}
              >
                {card.label}
              </p>
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: card.color }}
              >
                {card.value}
              </p>
              <p
                className="text-xs mt-1"
                style={{ fontFamily: "var(--font-mono)", color: "rgba(180,190,200,0.4)" }}
              >
                {card.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── Consistency Calendar ── */}
        <div
          className="rounded-xl p-6 border mb-8"
          style={{ backgroundColor: "rgba(0,212,170,0.03)", borderColor: "rgba(0,212,170,0.1)" }}
        >
          <h2
            className="text-xs tracking-widest uppercase mb-4"
            style={{ fontFamily: "var(--font-mono)", color: "rgba(180,190,200,0.5)" }}
          >
            Daily Consistency
          </h2>
          <div className="flex flex-wrap gap-2">
            {SESSIONS.map((s) => (
              <div key={s.date} className="flex flex-col items-center gap-1">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    fontFamily: "var(--font-mono)",
                    backgroundColor: s.strokeGameDone
                      ? "rgba(0,212,170,0.2)"
                      : "rgba(255,32,32,0.15)",
                    border: `1px solid ${s.strokeGameDone ? "rgba(0,212,170,0.4)" : "rgba(255,32,32,0.3)"}`,
                    color: s.strokeGameDone ? "#00D4AA" : "#FF2020",
                  }}
                >
                  {s.date.slice(8)}
                </div>
                <span
                  className="text-[9px]"
                  style={{ fontFamily: "var(--font-mono)", color: "rgba(180,190,200,0.3)" }}
                >
                  {s.strokeGameDone ? "✓" : "✗"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Progress Chart ── */}
        <div
          className="rounded-xl p-6 border mb-8"
          style={{ backgroundColor: "rgba(0,212,170,0.03)", borderColor: "rgba(0,212,170,0.1)" }}
        >
          <h2
            className="text-xs tracking-widest uppercase mb-6"
            style={{ fontFamily: "var(--font-mono)", color: "rgba(180,190,200,0.5)" }}
          >
            Score Progress
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(180,190,200,0.3)" tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }} />
              <YAxis domain={[0, 100]} stroke="rgba(180,190,200,0.3)" tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0A0A0F",
                  border: "1px solid rgba(0,212,170,0.2)",
                  borderRadius: "8px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="arm" stroke="#00D4AA" strokeWidth={2} dot={{ fill: "#00D4AA", r: 3 }} name="Arm Score" />
              <Line type="monotone" dataKey="face" stroke="#FF6B00" strokeWidth={2} dot={{ fill: "#FF6B00", r: 3 }} name="Face Score" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4 justify-center">
            {[{ color: "#00D4AA", label: "Arm Score" }, { color: "#FF6B00", label: "Face Score" }].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-4 h-0.5" style={{ backgroundColor: l.color }} />
                <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "rgba(180,190,200,0.5)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Session Table ── */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "rgba(0,212,170,0.1)" }}
        >
          <table className="w-full text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(0,212,170,0.05)", borderBottom: "1px solid rgba(0,212,170,0.1)" }}>
                {["Date", "Game", "Scenes", "Time", "Arm Reps", "Arm Score", "Face Score", "Exercises"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 tracking-widest uppercase"
                    style={{ color: "rgba(180,190,200,0.4)", fontWeight: 500 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SESSIONS.map((s, i) => (
                <tr
                  key={s.date}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                  }}
                >
                  <td className="px-4 py-3" style={{ color: "#E0E8F0" }}>{s.date}</td>
                  <td className="px-4 py-3">
                    <span style={{ color: s.strokeGameDone ? "#00D4AA" : "#FF2020" }}>
                      {s.strokeGameDone ? "✓ Done" : "✗ Skip"}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "rgba(180,190,200,0.6)" }}>{s.scenesViewed}/7</td>
                  <td className="px-4 py-3" style={{ color: "rgba(180,190,200,0.6)" }}>{Math.floor(s.timeSpent / 60)}m {s.timeSpent % 60}s</td>
                  <td className="px-4 py-3" style={{ color: "rgba(180,190,200,0.6)" }}>{s.armReps}</td>
                  <td className="px-4 py-3">
                    <span style={{ color: s.armScore >= 80 ? "#00D4AA" : s.armScore >= 70 ? "#FF6B00" : "#FF2020" }}>
                      {s.armScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: s.faceScore >= 80 ? "#00D4AA" : s.faceScore >= 70 ? "#FF6B00" : "#FF2020" }}>
                      {s.faceScore}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "rgba(180,190,200,0.5)" }}>
                    {s.exercisesDone.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}