import { useEffect, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Session {
  date: string;
  done: boolean;
  scenes: number;
  time: number;
  reps: number;
  arm: number;
  face: number;
  ex: string[];
}

interface ReplayControlsProps {
  visible: boolean;
  onReplay: () => void;
  onGoToScene: (scene: number) => void;
}

// ── Data ───────────────────────────────────────────────────────────────────
const SESSIONS: Session[] = [
  { date: "2025-04-21", done: true,  scenes: 7, time: 420, reps: 12, arm: 68, face: 72, ex: ["smile","purse","open"] },
  { date: "2025-04-22", done: true,  scenes: 7, time: 380, reps: 15, arm: 74, face: 78, ex: ["smile","purse","open","eyebrow"] },
  { date: "2025-04-23", done: false, scenes: 4, time: 180, reps: 10, arm: 70, face: 75, ex: ["smile","open"] },
  { date: "2025-04-24", done: true,  scenes: 7, time: 410, reps: 18, arm: 80, face: 82, ex: ["smile","purse","open","eyebrow","eyes"] },
  { date: "2025-04-25", done: true,  scenes: 7, time: 395, reps: 20, arm: 85, face: 86, ex: ["smile","purse","open","eyebrow","eyes"] },
  { date: "2025-04-26", done: false, scenes: 2, time: 90,  reps: 8,  arm: 77, face: 80, ex: ["smile"] },
  { date: "2025-04-27", done: true,  scenes: 7, time: 430, reps: 22, arm: 88, face: 90, ex: ["smile","purse","open","eyebrow","eyes"] },
];

const ACCENT_COLORS = ["#00D4AA", "#4F8EF7", "#FF6B00", "#C084FC", "#F472B6"];

// ── Helpers ────────────────────────────────────────────────────────────────
function scoreClass(v: number) {
  return v >= 80 ? "score-hi" : v >= 70 ? "score-mid" : "score-lo";
}
function rptScoreClass(v: number) {
  return v >= 80 ? "rpt-s-hi" : v >= 70 ? "rpt-s-mid" : "rpt-s-lo";
}
function fmtTime(secs: number) {
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

// ── Chart helper ────────────────────────────────────────────────────────────
function drawChart(canvas: HTMLCanvasElement, accent: string, dark: boolean) {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const labels = SESSIONS.map((s) => s.date.slice(5));
  const armData = SESSIONS.map((s) => s.arm);
  const faceData = SESSIONS.map((s) => s.face);

  const pad = { top: 12, right: 12, bottom: 28, left: 32 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const minY = 60, maxY = 100;

  function xPos(i: number) { return pad.left + (i / (SESSIONS.length - 1)) * chartW; }
  function yPos(v: number) { return pad.top + (1 - (v - minY) / (maxY - minY)) * chartH; }

  const gridColor = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const tickColor = dark ? "rgba(180,190,200,0.4)" : "#aaa";
  ctx.font = `9px 'Space Mono', monospace`;

  for (let v = 60; v <= 100; v += 10) {
    const y = yPos(v);
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
    ctx.fillStyle = tickColor;
    ctx.fillText(String(v), 0, y + 3);
  }

  labels.forEach((lbl, i) => {
    ctx.fillStyle = tickColor;
    ctx.fillText(lbl, xPos(i) - 14, H - 6);
  });

  function drawLine(data: number[], color: string, dashed: boolean) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash(dashed ? [5, 3] : []);
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = xPos(i), y = yPos(v);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    if (!dashed) {
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = color;
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = xPos(i), y = yPos(v);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.lineTo(xPos(data.length - 1), pad.top + chartH);
      ctx.lineTo(xPos(0), pad.top + chartH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = color;
    data.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(xPos(i), yPos(v), 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawLine(armData, dark ? accent : "#0A0A0F", false);
  drawLine(faceData, "#FF6B00", true);
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ReplayControls({ visible, onReplay, onGoToScene }: ReplayControlsProps) {
  const [accent, setAccent] = useState("#00D4AA");
  const [brightness, setBrightness] = useState(100);
  const [reportOpen, setReportOpen] = useState(false);

  const dashCanvasRef = useRef<HTMLCanvasElement>(null);
  const rptCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = dashCanvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || 400;
    canvas.height = 150;
    drawChart(canvas, accent, true);
  }, [accent]);

  useEffect(() => {
    if (!reportOpen) return;
    setTimeout(() => {
      const canvas = rptCanvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth || 400;
      canvas.height = 160;
      drawChart(canvas, accent, false);
    }, 100);
  }, [reportOpen, accent]);

  function exportCSV() {
    const rows = [
      ["Date","Done","Scenes","Time(s)","Reps","ArmScore","FaceScore","Exercises"],
      ...SESSIONS.map((s) => [
        s.date, s.done ? "Yes" : "No", s.scenes, s.time, s.reps, s.arm, s.face,
        s.ex.join("|"),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "patient_PT-2025-001.csv";
    a.click();
  }

  const rptDate = new Date().toLocaleDateString("th-TH", {
    year: "numeric", month: "long", day: "numeric",
  });

  const accentDim = accent + "20";
  const accentBorder = accent + "3F";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');
        :root {
          --teal: ${accent};
          --teal-dim: ${accentDim};
          --teal-border: ${accentBorder};
          --red: #FF2020;
          --orange: #FF6B00;
          --bg: #0A0A0F;
          --bg2: rgba(255,255,255,0.03);
          --text: #E0E8F0;
          --muted: rgba(180,190,200,0.5);
          --mono: 'Space Mono', monospace;
          --display: 'Syne', sans-serif;
        }
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--bg);color:var(--text);font-family:var(--display);min-height:100vh;}

        .dash{padding:24px 28px;max-width:960px;margin:0 auto;}
        .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:18px;border-bottom:1px solid var(--teal-border);}
        .scene-label{font-family:var(--mono);font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--teal);opacity:0.7;margin-bottom:5px;}
        .patient-name{font-size:24px;font-weight:800;color:var(--text);}
        .patient-meta{font-family:var(--mono);font-size:11px;color:var(--muted);margin-top:4px;display:flex;gap:10px;}

        .header-right{display:flex;flex-direction:column;gap:10px;align-items:flex-end;}
        .controls{display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:flex-end;}
        .ctrl-group{display:flex;flex-direction:column;gap:4px;}
        .ctrl-label{font-family:var(--mono);font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--muted);}
        .ctrl-row{display:flex;gap:5px;align-items:center;}
        .color-btn{width:20px;height:20px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:border-color 0.2s;}
        .color-btn.active,.color-btn:hover{border-color:white;}
        input[type=range]{width:72px;height:4px;accent-color:var(--teal);cursor:pointer;}
        .val-out{font-family:var(--mono);font-size:10px;color:var(--teal);min-width:28px;}

        .action-btns{display:flex;gap:8px;}
        .btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:1px solid var(--teal-border);background:rgba(10,10,15,0.8);cursor:pointer;font-family:var(--mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--teal);transition:all 0.3s;}
        .btn:hover{background:var(--teal-dim);border-color:var(--teal);}
        .btn-report{border-color:rgba(255,107,0,0.4);color:var(--orange);}
        .btn-report:hover{background:rgba(255,107,0,0.1);border-color:var(--orange);}

        .summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
        .card{background:var(--bg2);border:1px solid var(--teal-border);border-radius:10px;padding:14px 16px;transition:all 0.3s;}
        .card:hover{border-color:rgba(0,212,170,0.5);background:var(--teal-dim);}
        .card-label{font-family:var(--mono);font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);margin-bottom:7px;}
        .card-value{font-size:28px;font-weight:800;line-height:1;}
        .card-sub{font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:4px;}
        .teal{color:var(--teal);}
        .orange{color:var(--orange);}

        .row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
        .panel{background:var(--bg2);border:1px solid var(--teal-border);border-radius:10px;padding:16px;}
        .panel-title{font-family:var(--mono);font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:var(--muted);margin-bottom:12px;}

        .calendar{display:flex;flex-wrap:wrap;gap:5px;}
        .cal-day{width:34px;height:34px;border-radius:7px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;cursor:default;transition:transform 0.15s;}
        .cal-day:hover{transform:scale(1.1);}
        .cal-done{background:rgba(0,212,170,0.12);border:1px solid rgba(0,212,170,0.35);}
        .cal-skip{background:rgba(255,32,32,0.08);border:1px solid rgba(255,32,32,0.2);}
        .cal-num{font-family:var(--mono);font-size:12px;font-weight:700;}
        .cal-done .cal-num{color:var(--teal);}
        .cal-skip .cal-num{color:var(--red);}
        .cal-tick{font-size:8px;}
        .cal-done .cal-tick{color:var(--teal);}
        .cal-skip .cal-tick{color:var(--red);opacity:0.7;}

        .chart-wrap{position:relative;width:100%;height:150px;}

        .row3{background:var(--bg2);border:1px solid var(--teal-border);border-radius:10px;overflow:hidden;}
        table{width:100%;border-collapse:collapse;font-size:11px;}
        thead tr{background:rgba(0,212,170,0.04);border-bottom:1px solid var(--teal-border);}
        th{font-family:var(--mono);font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted);padding:9px 12px;text-align:left;font-weight:400;}
        td{padding:8px 12px;font-family:var(--mono);color:rgba(180,190,200,0.65);border-bottom:1px solid rgba(255,255,255,0.03);}
        tr:last-child td{border-bottom:none;}
        tr:hover td{background:rgba(0,212,170,0.025);}
        .score-hi{color:var(--teal);}
        .score-mid{color:var(--orange);}
        .score-lo{color:var(--red);}
        .badge{border-radius:4px;padding:2px 6px;font-size:9px;}
        .badge-done{background:rgba(0,212,170,0.1);color:var(--teal);border:1px solid rgba(0,212,170,0.3);}
        .badge-skip{background:rgba(255,32,32,0.08);color:var(--red);border:1px solid rgba(255,32,32,0.2);}

        .modal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;}
        .modal-bg.open{display:flex;}
        .report{background:#fff;color:#111;border-radius:12px;width:100%;max-width:760px;padding:40px 44px;font-family:'Syne',sans-serif;position:relative;}
        .rpt-close{position:absolute;top:16px;right:18px;background:none;border:none;font-size:22px;cursor:pointer;color:#666;line-height:1;}
        .rpt-close:hover{color:#111;}
        .rpt-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:2px solid #0A0A0F;}
        .rpt-logo{display:flex;align-items:center;gap:10px;}
        .rpt-logo-box{width:36px;height:36px;background:#0A0A0F;border-radius:8px;display:flex;align-items:center;justify-content:center;}
        .rpt-logo-text{font-weight:800;font-size:16px;color:#111;letter-spacing:-0.02em;}
        .rpt-logo-sub{font-family:'Space Mono',monospace;font-size:9px;color:#888;letter-spacing:0.15em;text-transform:uppercase;}
        .rpt-date{font-family:'Space Mono',monospace;font-size:10px;color:#888;text-align:right;}
        .rpt-patient{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-bottom:24px;border:1px solid #e5e5e5;border-radius:10px;overflow:hidden;}
        .rpt-prow{display:flex;flex-direction:column;padding:12px 16px;border-bottom:1px solid #f0f0f0;}
        .rpt-prow:nth-child(odd){border-right:1px solid #f0f0f0;}
        .rpt-prow:last-child,.rpt-prow:nth-last-child(2){border-bottom:none;}
        .rpt-plabel{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#999;margin-bottom:4px;}
        .rpt-pval{font-size:14px;font-weight:700;color:#111;}
        .rpt-section{margin-bottom:22px;}
        .rpt-section-title{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#888;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid #f0f0f0;}
        .rpt-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px;}
        .rpt-kpi{background:#f8f8f8;border-radius:8px;padding:12px 14px;border-left:3px solid #0A0A0F;}
        .rpt-kpi.hi{border-left-color:#00B894;}
        .rpt-kpi.md{border-left-color:#FF6B00;}
        .rpt-kpi-label{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin-bottom:5px;}
        .rpt-kpi-val{font-size:22px;font-weight:800;color:#111;}
        .rpt-kpi-sub{font-family:'Space Mono',monospace;font-size:9px;color:#aaa;margin-top:3px;}
        .rpt-chart-wrap{position:relative;width:100%;height:160px;margin-bottom:6px;}
        .rpt-table{width:100%;border-collapse:collapse;font-size:11px;}
        .rpt-table thead tr{background:#f5f5f5;}
        .rpt-table th{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#888;padding:8px 10px;text-align:left;font-weight:400;}
        .rpt-table td{padding:7px 10px;color:#444;border-bottom:1px solid #f5f5f5;font-family:'Space Mono',monospace;}
        .rpt-table tr:last-child td{border-bottom:none;}
        .rpt-s-hi{color:#00A878;font-weight:700;}
        .rpt-s-mid{color:#FF6B00;font-weight:700;}
        .rpt-s-lo{color:#E53E3E;font-weight:700;}
        .rpt-note{background:#f9f9f9;border-radius:8px;padding:14px 16px;margin-top:20px;border:1px solid #e5e5e5;}
        .rpt-note-title{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#888;margin-bottom:6px;}
        .rpt-note-body{font-size:13px;color:#555;line-height:1.7;}
        .rpt-footer{margin-top:28px;padding-top:16px;border-top:1px solid #e5e5e5;display:flex;justify-content:space-between;align-items:center;}
        .rpt-footer-left{font-family:'Space Mono',monospace;font-size:9px;color:#bbb;line-height:1.7;}
        .rpt-print-btn{display:flex;align-items:center;gap:6px;padding:8px 16px;background:#0A0A0F;color:#00D4AA;border:none;border-radius:7px;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:opacity 0.2s;}
        .rpt-print-btn:hover{opacity:0.85;}
      `}</style>

      {/* ── Dashboard ── */}
      <div className="dash" style={{ filter: `brightness(${brightness / 100})`, display: visible ? "block" : "none" }}>
        <div className="header">
          <div>
            <div className="scene-label">• Scene 7 / 7 — Patient Dashboard</div>
            <div className="patient-name">สมชาย ใจดี</div>
            <div className="patient-meta">
              <span>PT-2025-001</span><span>·</span>
              <span>Ischemic Stroke</span><span>·</span>
              <span>เริ่ม 1 เม.ย. 2568</span>
            </div>
          </div>
          <div className="header-right">
            <div className="action-btns">
              <button className="btn" onClick={exportCSV}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                Export CSV
              </button>
              <button className="btn btn-report" onClick={() => setReportOpen(true)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="2" y="1" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M4 4h4M4 6h4M4 8h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Doctor Report
              </button>
            </div>
            <div className="controls">
              <div className="ctrl-group">
                <div className="ctrl-label">Accent</div>
                <div className="ctrl-row">
                  {ACCENT_COLORS.map((c) => (
                    <div
                      key={c}
                      className={`color-btn${accent === c ? " active" : ""}`}
                      style={{ background: c }}
                      onClick={() => setAccent(c)}
                    />
                  ))}
                </div>
              </div>
              <div className="ctrl-group">
                <div className="ctrl-label">Brightness</div>
                <div className="ctrl-row">
                  <input
                    type="range" min={60} max={100} value={brightness} step={1}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                  />
                  <span className="val-out">{brightness}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="summary-grid">
          <div className="card"><div className="card-label">Consistency</div><div className="card-value teal">71%</div><div className="card-sub">5/7 sessions</div></div>
          <div className="card"><div className="card-label">Avg Arm Score</div><div className="card-value teal">77</div><div className="card-sub">out of 100</div></div>
          <div className="card"><div className="card-label">Avg Face Score</div><div className="card-value teal">80</div><div className="card-sub">out of 100</div></div>
          <div className="card"><div className="card-label">Total Reps</div><div className="card-value orange">105</div><div className="card-sub">arm exercises</div></div>
        </div>

        {/* Calendar + Chart */}
        <div className="row2">
          <div className="panel">
            <div className="panel-title">Daily Consistency</div>
            <div className="calendar">
              {SESSIONS.map((s) => (
                <div key={s.date} className={`cal-day ${s.done ? "cal-done" : "cal-skip"}`}>
                  <span className="cal-num">{s.date.slice(8)}</span>
                  <span className="cal-tick">{s.done ? "✓" : "✗"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">Score Progress</div>
            <div className="chart-wrap">
              <canvas ref={dashCanvasRef} style={{ width: "100%", height: "150px" }} />
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 8, justifyContent: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>
                <span style={{ display: "inline-block", width: 16, height: 2, background: accent }} />Arm Score
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>
                <span style={{ display: "inline-block", width: 16, height: 2, background: "#FF6B00" }} />Face Score
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="row3">
          <table>
            <thead>
              <tr><th>Date</th><th>Game</th><th>Scenes</th><th>Time</th><th>Reps</th><th>Arm</th><th>Face</th><th>Exercises</th></tr>
            </thead>
            <tbody>
              {SESSIONS.map((s) => (
                <tr key={s.date}>
                  <td style={{ color: "var(--text)" }}>{s.date}</td>
                  <td><span className={`badge ${s.done ? "badge-done" : "badge-skip"}`}>{s.done ? "✓ Done" : "✗ Skip"}</span></td>
                  <td>{s.scenes}/7</td>
                  <td>{fmtTime(s.time)}</td>
                  <td>{s.reps}</td>
                  <td className={scoreClass(s.arm)}>{s.arm}</td>
                  <td className={scoreClass(s.face)}>{s.face}</td>
                  <td style={{ fontSize: 10 }}>{s.ex.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Report Modal ── */}
      <div className={`modal-bg${reportOpen ? " open" : ""}`}>
        <div className="report">
          <button className="rpt-close" onClick={() => setReportOpen(false)}>✕</button>

          <div className="rpt-header">
            <div className="rpt-logo">
              <div className="rpt-logo-box">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="#00D4AA" strokeWidth="1.5"/>
                  <path d="M10 5v5l3 2" stroke="#00D4AA" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="rpt-logo-text">STROKE 3D</div>
                <div className="rpt-logo-sub">Rehabilitation Report</div>
              </div>
            </div>
            <div className="rpt-date">
              <div style={{ fontWeight: 700, fontSize: 12, color: "#111" }}>รายงานความก้าวหน้า</div>
              <div>ออกเมื่อ: {rptDate}</div>
              <div>ช่วงข้อมูล: 21–27 เม.ย. 2568</div>
            </div>
          </div>

          <div className="rpt-patient">
            <div className="rpt-prow"><div className="rpt-plabel">ชื่อผู้ป่วย</div><div className="rpt-pval">สมชาย ใจดี</div></div>
            <div className="rpt-prow"><div className="rpt-plabel">รหัสผู้ป่วย</div><div className="rpt-pval">PT-2025-001</div></div>
            <div className="rpt-prow"><div className="rpt-plabel">การวินิจฉัย</div><div className="rpt-pval">Ischemic Stroke</div></div>
            <div className="rpt-prow"><div className="rpt-plabel">วันเริ่มโปรแกรม</div><div className="rpt-pval">1 เมษายน 2568</div></div>
          </div>

          <div className="rpt-kpis">
            <div className="rpt-kpi hi"><div className="rpt-kpi-label">Consistency</div><div className="rpt-kpi-val">71%</div><div className="rpt-kpi-sub">5/7 sessions</div></div>
            <div className="rpt-kpi hi"><div className="rpt-kpi-label">Avg Arm Score</div><div className="rpt-kpi-val">77</div><div className="rpt-kpi-sub">out of 100</div></div>
            <div className="rpt-kpi hi"><div className="rpt-kpi-label">Avg Face Score</div><div className="rpt-kpi-val">80</div><div className="rpt-kpi-sub">out of 100</div></div>
            <div className="rpt-kpi md"><div className="rpt-kpi-label">Total Reps</div><div className="rpt-kpi-val">105</div><div className="rpt-kpi-sub">arm exercises</div></div>
          </div>

          <div className="rpt-section">
            <div className="rpt-section-title">Score Progress Chart</div>
            <div className="rpt-chart-wrap">
              <canvas ref={rptCanvasRef} style={{ width: "100%", height: "160px" }} />
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 6, fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#999" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ display: "inline-block", width: 16, height: 2, background: "#0A0A0F" }} />Arm Score
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ display: "inline-block", width: 16, height: 2, background: "#FF6B00", borderTop: "2px dashed #FF6B00" }} />Face Score
              </span>
            </div>
          </div>

          <div className="rpt-section">
            <div className="rpt-section-title">Session Details</div>
            <table className="rpt-table">
              <thead>
                <tr><th>วันที่</th><th>เกม</th><th>Scenes</th><th>เวลา</th><th>Reps</th><th>Arm</th><th>Face</th><th>Exercises</th></tr>
              </thead>
              <tbody>
                {SESSIONS.map((s) => (
                  <tr key={s.date}>
                    <td>{s.date}</td>
                    <td>{s.done ? "✓ ครบ" : "✗ ขาด"}</td>
                    <td>{s.scenes}/7</td>
                    <td>{fmtTime(s.time)}</td>
                    <td>{s.reps}</td>
                    <td className={rptScoreClass(s.arm)}>{s.arm}</td>
                    <td className={rptScoreClass(s.face)}>{s.face}</td>
                    <td>{s.ex.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rpt-note">
            <div className="rpt-note-title">หมายเหตุสำหรับแพทย์</div>
            <div className="rpt-note-body">
              ผู้ป่วยแสดงพัฒนาการต่อเนื่องในช่วง 7 วัน คะแนน Arm Score เพิ่มขึ้นจาก 68 → 88 (+29%)
              และ Face Score จาก 72 → 90 (+25%) มีวันที่ขาด 2 วัน (23, 26 เม.ย.)
              แนะนำติดตามความสม่ำเสมอในสัปดาห์ถัดไป
            </div>
          </div>

          <div className="rpt-footer">
            <div className="rpt-footer-left">
              <div>STROKE 3D Rehabilitation Platform</div>
              <div>รายงานนี้ผลิตโดยระบบอัตโนมัติ — ใช้ประกอบการวินิจฉัยเท่านั้น</div>
            </div>
            <button className="rpt-print-btn" onClick={() => window.print()}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="2" y="4" width="8" height="5" rx="1" stroke="#00D4AA" strokeWidth="1.2"/>
                <path d="M4 4V2h4v2M4 9v1h4V9" stroke="#00D4AA" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
}