"use client";
import { useState, useRef, useMemo } from "react";
import { Sparkles, Activity, Heart, FileDown, MessageCircle, History as HistoryIcon, Mic, Upload, Send, Pill, ClipboardList, User, Thermometer, Wind, Gauge } from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

const LANG = {
  en: {
    title: "HealthAI Ultra", sub: "Premium AI-powered health companion",
    tabs: [
      { key: "profile", label: "Profile", icon: User },
      { key: "symptoms", label: "Symptoms", icon: ClipboardList },
      { key: "medicines", label: "Medicines", icon: Pill },
      { key: "lab", label: "Lab Report", icon: FileDown },
      { key: "vitals", label: "Vitals", icon: Gauge },
      { key: "analysis", label: "Analysis", icon: Sparkles },
      { key: "chat", label: "Chat", icon: MessageCircle },
      { key: "history", label: "History", icon: HistoryIcon },
    ],
    name: "Full name", age: "Age (years)", weight: "Weight (kg)", gender: "Gender",
    conditions: "Existing conditions (optional)", allergies: "Allergies (optional)",
    selectGender: "Select gender", male: "Male", female: "Female", other: "Other",
    next: "Next", back: "Back", analyze: "Run AI analysis", analyzing: "Analyzing...",
    newAnalysis: "New analysis", fillProfile: "Fill in name, age, weight and gender first.",
    symptomsLabel: "Describe your symptoms", symptomsPlaceholder: "e.g. fever, headache, chest pain for 3 days...",
    voiceBtn: "Speak symptoms", voiceListening: "Listening...",
    med: ["Medicine 1", "Medicine 2 (optional)", "Medicine 3 (optional)"],
    medPlaceholder: "e.g. Paracetamol 500mg", checkInteractions: "Check interactions", checking: "Checking...",
    labUpload: "Upload lab report", labPaste: "Or paste here:", labOptional: "Lab report is optional — you can skip it.",
    summary: "Summary", findings: "Key findings", diet: "Diet suggestions",
    lifestyle: "Lifestyle tips", doctorQ: "Ask your doctor", disclaimer: "Disclaimer",
    errorMsg: "Analysis failed. Please try again.", errorMed: "Interaction check failed. Try again.",
    voiceNotSupported: "Voice input isn't supported in this browser.",
    safeCombo: "Safe combination", cautionCombo: "Caution needed",
    interactions: "Interactions", warnings: "Warnings", possible: "Possible conditions",
    runFirst: "Run the analysis first.", exportPdf: "Export as PDF",
    vitalsTitle: "Enter your vitals", hr: "Heart rate (bpm)", spo2: "SpO2 (%)", temp: "Temperature (°C)",
    sys: "Systolic BP", dia: "Diastolic BP", healthScore: "Health Score", vitalsHint: "Fill any vitals you have — score updates live.",
    chatTitle: "Ask a follow-up", chatEmpty: "Run an analysis first, then ask questions about your results here.",
    chatPlaceholder: "Ask about your results...", send: "Send", chatThinking: "Thinking...",
    historyEmpty: "No past analyses yet in this session.", historyTitle: "Past analyses", view: "View",
  },
  ur: {
    title: "HealthAI Ultra", sub: "پریمیم AI صحت ساتھی",
    tabs: [
      { key: "profile", label: "پروفائل", icon: User },
      { key: "symptoms", label: "علامات", icon: ClipboardList },
      { key: "medicines", label: "دوائیں", icon: Pill },
      { key: "lab", label: "لیب رپورٹ", icon: FileDown },
      { key: "vitals", label: "وائٹلز", icon: Gauge },
      { key: "analysis", label: "تجزیہ", icon: Sparkles },
      { key: "chat", label: "چیٹ", icon: MessageCircle },
      { key: "history", label: "ماضی", icon: HistoryIcon },
    ],
    name: "پورا نام", age: "عمر (سال)", weight: "وزن (کلو)", gender: "جنس",
    conditions: "موجودہ بیماریاں (اختیاری)", allergies: "الرجی (اختیاری)",
    selectGender: "جنس منتخب کریں", male: "مرد", female: "عورت", other: "دیگر",
    next: "آگے", back: "واپس", analyze: "AI تجزیہ کریں", analyzing: "تجزیہ ہو رہا ہے...",
    newAnalysis: "نیا تجزیہ", fillProfile: "پہلے نام، عمر، وزن اور جنس درج کریں۔",
    symptomsLabel: "اپنی علامات بیان کریں", symptomsPlaceholder: "مثلاً بخار، سر درد، سینے میں درد 3 دن سے...",
    voiceBtn: "بول کر بتائیں", voiceListening: "سن رہا ہوں...",
    med: ["دوا 1", "دوا 2 (اختیاری)", "دوا 3 (اختیاری)"],
    medPlaceholder: "مثلاً پیراسیٹامول 500mg", checkInteractions: "تعامل چیک کریں", checking: "چیک ہو رہا ہے...",
    labUpload: "لیب رپورٹ اپلوڈ کریں", labPaste: "یا یہاں پیسٹ کریں:", labOptional: "لیب رپورٹ اختیاری ہے۔",
    summary: "خلاصہ", findings: "اہم نتائج", diet: "خوراک کی ہدایات",
    lifestyle: "طرز زندگی", doctorQ: "ڈاکٹر سے پوچھیں", disclaimer: "وضاحت",
    errorMsg: "تجزیہ ناکام ہوا۔ دوبارہ کوشش کریں۔", errorMed: "چیک ناکام ہوا۔",
    voiceNotSupported: "یہ براؤزر آواز سپورٹ نہیں کرتا۔",
    safeCombo: "محفوظ امتزاج", cautionCombo: "احتیاط درکار ہے",
    interactions: "تعاملات", warnings: "انتباہات", possible: "ممکنہ حالات",
    runFirst: "پہلے تجزیہ چلائیں۔", exportPdf: "PDF ایکسپورٹ کریں",
    vitalsTitle: "اپنے وائٹلز درج کریں", hr: "دل کی دھڑکن", spo2: "SpO2 (%)", temp: "درجہ حرارت (°C)",
    sys: "سسٹولک BP", dia: "ڈائیسٹولک BP", healthScore: "صحت اسکور", vitalsHint: "جو معلوم ہو وہ درج کریں۔",
    chatTitle: "سوال پوچھیں", chatEmpty: "پہلے تجزیہ چلائیں، پھر یہاں سوالات پوچھیں۔",
    chatPlaceholder: "اپنے نتائج کے بارے میں پوچھیں...", send: "بھیجیں", chatThinking: "سوچ رہا ہوں...",
    historyEmpty: "ابھی کوئی پرانا تجزیہ نہیں۔", historyTitle: "پرانے تجزیے", view: "دیکھیں",
  }
};

const D = {
  bg: "#070B14", bgAlt: "#0B1220",
  glass: "rgba(255,255,255,0.045)", glassStrong: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.09)", borderStrong: "rgba(255,255,255,0.18)",
  text: "#F1F5F9", textSecondary: "#94A3B8", textMuted: "#5B6B82",
  accentA: "#22D3EE", accentB: "#818CF8",
  success: "#34D399", successBg: "rgba(52,211,153,0.12)", successBorder: "rgba(52,211,153,0.35)",
  warning: "#FBBF24", warningBg: "rgba(251,191,36,0.12)", warningBorder: "rgba(251,191,36,0.35)",
  danger: "#F87171", dangerBg: "rgba(248,113,113,0.12)", dangerBorder: "rgba(248,113,113,0.35)",
  monitorBg: "#000A05", monitorGreen: "#39FF88", monitorCyan: "#22E5FF", monitorAmber: "#FFC145", monitorPurple: "#C77DFF",
};
const gradient = `linear-gradient(135deg, ${D.accentA}, ${D.accentB})`;
const BODY_PARTS = {
  head: { en: "Head", ur: "سر" }, chest: { en: "Chest", ur: "سینہ" }, abdomen: { en: "Abdomen", ur: "پیٹ" },
  leftArm: { en: "Left arm", ur: "بایاں بازو" }, rightArm: { en: "Right arm", ur: "دایاں بازو" },
  leftLeg: { en: "Left leg", ur: "بایاں ٹانگ" }, rightLeg: { en: "Right leg", ur: "دایاں ٹانگ" },
};

async function callAI(prompt) {
  const res = await fetch("/api/health-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "api_error");
  }
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

const glassCard = { background: D.glass, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: `1px solid ${D.border}`, borderRadius: 18, padding: "1.1rem 1.3rem", marginBottom: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.35)" };
const label = { display: "block", fontSize: 12.5, color: D.textSecondary, marginBottom: 6, fontWeight: 600, letterSpacing: 0.2 };
const fieldBase = { width: "100%", padding: "10px 13px", borderRadius: 12, background: "rgba(255,255,255,0.04)", color: D.text, fontSize: 14, boxSizing: "border-box", outline: "none" };
const btnPrimary = { padding: "12px 20px", borderRadius: 13, background: gradient, color: "#04121C", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(34,211,238,0.25)" };
const btnGhost = { padding: "12px 20px", borderRadius: 13, background: "rgba(255,255,255,0.05)", color: D.text, border: `1px solid ${D.borderStrong}`, fontSize: 14, fontWeight: 600, cursor: "pointer" };

function Field({ text, value, onChange, error, placeholder, type = "text", as }) {
  const style = { ...fieldBase, border: `1.5px solid ${error ? D.danger : D.border}` };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={label}>{text}</label>
      {as === "textarea" ? (
        <textarea className="hai-input" value={value} onChange={onChange} placeholder={placeholder} rows={2} style={{ ...style, resize: "vertical" }} />
      ) : (
        <input className="hai-input" type={type} value={value} onChange={onChange} placeholder={placeholder} style={style} />
      )}
      {error && <p style={{ fontSize: 12, color: D.danger, margin: "4px 0 0" }}>{error}</p>}
    </div>
  );
}

function Spinner({ dark }) {
  return <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${dark ? "#04121C" : D.text}`, borderTopColor: "transparent", borderRadius: "50%", animation: "hai-spin .7s linear infinite", verticalAlign: -2, marginRight: 8 }} />;
}

function ScoreGauge({ score }) {
  const color = score >= 75 ? D.success : score >= 50 ? D.warning : D.danger;
  const data = [{ name: "score", value: score, fill: color }];
  return (
    <div style={{ position: "relative", width: "100%", height: 180 }}>
      <ResponsiveContainer>
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={220} endAngle={-40}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: "rgba(255,255,255,0.06)" }} dataKey="value" cornerRadius={20} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 34, fontWeight: 800, color }}>{Math.round(score)}</span>
        <span style={{ fontSize: 11, color: D.textMuted, marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

function scoreFromRange(val, lo, hi, tolerance) {
  if (val === "" || val == null || isNaN(val)) return null;
  const v = Number(val);
  if (v >= lo && v <= hi) return 100;
  const dist = v < lo ? lo - v : v - hi;
  return Math.max(0, 100 - (dist / tolerance) * 100);
}

function BodyMap({ selected, onToggle, lang }) {
  const isSel = (k) => selected.includes(k);
  const partStyle = (k) => ({
    fill: isSel(k) ? "url(#hai-part-glow)" : "rgba(255,255,255,0.06)",
    stroke: isSel(k) ? D.accentA : "rgba(255,255,255,0.25)",
    strokeWidth: isSel(k) ? 2 : 1,
    cursor: "pointer",
    transition: "all .2s ease",
    filter: isSel(k) ? "drop-shadow(0 0 8px rgba(34,211,238,0.7))" : "none",
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg viewBox="0 0 200 420" width="180" height="378" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="hai-part-glow" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.55)" />
            <stop offset="100%" stopColor="rgba(129,140,248,0.35)" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="42" r="30" style={partStyle("head")} onClick={() => onToggle("head")} />
        <rect x="88" y="70" width="24" height="14" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
        <path d="M65 88 Q100 78 135 88 L140 190 Q100 205 60 190 Z" style={partStyle("chest")} onClick={() => onToggle("chest")} />
        <path d="M62 190 Q100 202 138 190 L132 250 Q100 262 68 250 Z" style={partStyle("abdomen")} onClick={() => onToggle("abdomen")} />
        <path d="M62 92 Q40 95 32 150 Q28 190 38 225 L58 220 Q50 175 55 140 Q58 110 68 95 Z" style={partStyle("leftArm")} onClick={() => onToggle("leftArm")} />
        <path d="M138 92 Q160 95 168 150 Q172 190 162 225 L142 220 Q150 175 145 140 Q142 110 132 95 Z" style={partStyle("rightArm")} onClick={() => onToggle("rightArm")} />
        <path d="M68 250 L62 380 Q62 395 78 395 L86 395 Q92 395 92 382 L94 260 Z" style={partStyle("leftLeg")} onClick={() => onToggle("leftLeg")} />
        <path d="M132 250 L138 380 Q138 395 122 395 L114 395 Q108 395 108 382 L106 260 Z" style={partStyle("rightLeg")} onClick={() => onToggle("rightLeg")} />
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 10 }}>
        {selected.map(k => (
          <span key={k} onClick={() => onToggle(k)} style={{ fontSize: 11.5, fontWeight: 700, padding: "4px 11px", borderRadius: 20, background: "rgba(34,211,238,0.14)", color: D.accentA, border: `1px solid rgba(34,211,238,0.4)`, cursor: "pointer" }}>
            {BODY_PARTS[k][lang]} ✕
          </span>
        ))}
      </div>
    </div>
  );
}

function ECGMonitor({ vitals }) {
  const hr = Number(vitals.hr) || 72;
  const spo2 = vitals.spo2 || "--";
  const temp = vitals.temp || "--";
  const bp = (vitals.sys && vitals.dia) ? `${vitals.sys}/${vitals.dia}` : "--/--";
  const duration = Math.max(0.5, 60 / hr);
  const beat = { fontFamily: "'Courier New', monospace" };
  return (
    <div style={{ background: D.monitorBg, borderRadius: 18, border: `1px solid rgba(57,255,136,0.25)`, padding: "1.1rem 1.2rem", position: "relative", overflowX: "hidden", overflowY: "visible", boxShadow: "0 0 40px rgba(57,255,136,0.08) inset" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(57,255,136,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,136,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
      <div style={{ position: "relative", overflowX: "hidden", overflowY: "visible", height: 70, marginBottom: 12, borderRadius: 8 }}>
        <svg viewBox="0 0 400 70" width="200%" height="70" style={{ animation: `hai-ecg-scroll ${duration * 2}s linear infinite` }}>
          {[0, 1].map(rep => (
            <polyline key={rep} transform={`translate(${rep * 200},0)`} points="0,35 20,35 30,35 36,15 42,55 48,10 54,35 70,35 100,35 106,25 112,45 118,35 200,35"
              fill="none" stroke={D.monitorGreen} strokeWidth="2" style={{ filter: "drop-shadow(0 0 4px rgba(57,255,136,0.8))" }} />
          ))}
        </svg>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <p style={{ ...beat, fontSize: 10, color: "rgba(57,255,136,0.6)", margin: 0, letterSpacing: 1 }}>HEART RATE</p>
          <p style={{ ...beat, fontSize: 30, fontWeight: 800, color: D.monitorGreen, margin: 0, textShadow: "0 0 10px rgba(57,255,136,0.6)" }}>
            {hr}<span style={{ fontSize: 13, opacity: 0.7 }}> bpm</span>
            <span className="hai-pulse" style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: D.monitorGreen, marginLeft: 8, animation: `hai-pulse ${duration}s ease-in-out infinite` }} />
          </p>
        </div>
        <div>
          <p style={{ ...beat, fontSize: 10, color: "rgba(34,229,255,0.6)", margin: 0, letterSpacing: 1 }}>SpO2</p>
          <p style={{ ...beat, fontSize: 30, fontWeight: 800, color: D.monitorCyan, margin: 0, textShadow: "0 0 10px rgba(34,229,255,0.6)" }}>{spo2}<span style={{ fontSize: 13, opacity: 0.7 }}>%</span></p>
        </div>
        <div>
          <p style={{ ...beat, fontSize: 10, color: "rgba(255,193,69,0.6)", margin: 0, letterSpacing: 1 }}>TEMP</p>
          <p style={{ ...beat, fontSize: 24, fontWeight: 800, color: D.monitorAmber, margin: 0, textShadow: "0 0 10px rgba(255,193,69,0.6)" }}>{temp}<span style={{ fontSize: 13, opacity: 0.7 }}>°C</span></p>
        </div>
        <div>
          <p style={{ ...beat, fontSize: 10, color: "rgba(199,125,255,0.6)", margin: 0, letterSpacing: 1 }}>BP</p>
          <p style={{ ...beat, fontSize: 24, fontWeight: 800, color: D.monitorPurple, margin: 0, textShadow: "0 0 10px rgba(199,125,255,0.6)" }}>{bp}</p>
        </div>
      </div>
    </div>
  );
}

export default function HealthAIUltra() {
  const [lang, setLang] = useState("en");
  const L = LANG[lang];
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "", age: "", weight: "", gender: "", conditions: "", allergies: "" });
  const [symptoms, setSymptoms] = useState("");
  const [affectedAreas, setAffectedAreas] = useState([]);
  const toggleArea = (k) => setAffectedAreas(a => a.includes(k) ? a.filter(x => x !== k) : [...a, k]);
  const [meds, setMeds] = useState(["", "", ""]);
  const [labText, setLabText] = useState("");
  const [fileName, setFileName] = useState("");
  const [vitals, setVitals] = useState({ hr: "", spo2: "", temp: "", sys: "", dia: "" });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [errors, setErrors] = useState({});
  const [listening, setListening] = useState(false);
  const [voiceMsg, setVoiceMsg] = useState("");
  const [medResult, setMedResult] = useState(null);
  const [medLoading, setMedLoading] = useState(false);
  const [medError, setMedError] = useState("");
  const [history, setHistory] = useState([]);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const fileRef = useRef();

  const profileReady = profile.name.trim() && profile.age && profile.weight && profile.gender;

  const healthScore = useMemo(() => {
    const scores = [
      scoreFromRange(vitals.hr, 60, 100, 40),
      scoreFromRange(vitals.spo2, 95, 100, 10),
      scoreFromRange(vitals.temp, 36.1, 37.2, 2),
      scoreFromRange(vitals.sys, 90, 120, 40),
      scoreFromRange(vitals.dia, 60, 80, 30),
    ].filter((s) => s !== null);
    if (!scores.length) return 78;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, [vitals]);

  const validate = () => {
    const e = {};
    if (!profile.name.trim()) e.name = lang === "ur" ? "نام درج کریں" : "Enter your name";
    if (!profile.age || isNaN(profile.age) || profile.age < 1 || profile.age > 120) e.age = lang === "ur" ? "درست عمر درج کریں" : "Enter a valid age";
    if (!profile.weight || isNaN(profile.weight) || profile.weight < 1) e.weight = lang === "ur" ? "درست وزن درج کریں" : "Enter a valid weight";
    if (!profile.gender) e.gender = lang === "ur" ? "جنس منتخب کریں" : "Select a gender";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goTab = (key) => { if (key !== "profile" && !profileReady) { setTab("profile"); return; } setTab(key); };

  const startVoice = () => {
    setVoiceMsg("");
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) { setVoiceMsg(L.voiceNotSupported); return; }
    try {
      const r = new SR();
      r.lang = lang === "ur" ? "ur-PK" : "en-US";
      r.continuous = false; r.interimResults = false;
      r.onstart = () => setListening(true);
      r.onresult = (e) => { setSymptoms(prev => (prev ? prev + " " : "") + (e.results?.[0]?.[0]?.transcript || "")); setListening(false); };
      r.onerror = () => { setListening(false); setVoiceMsg(L.voiceNotSupported); };
      r.onend = () => setListening(false);
      r.start();
    } catch { setListening(false); setVoiceMsg(L.voiceNotSupported); }
  };

  const checkMeds = async () => {
    const filtered = meds.filter(m => m.trim());
    if (!filtered.length) return;
    setMedLoading(true); setMedResult(null); setMedError("");
    try {
      const result = await callAI(`You are a pharmacology expert. Analyze these medicines: ${filtered.join(", ")}. Respond ONLY with raw JSON, no markdown:
{"safe": true, "interactions": ["..."], "warnings": ["..."]}`);
      setMedResult(result);
    } catch { setMedError(L.errorMed); }
    setMedLoading(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try { setLabText(await file.text()); } catch {}
  };

  const runAnalysis = async () => {
    setLoading(true); setAnalysis(null); setAnalysisError(""); setChatMsgs([]);
    try {
      const result = await callAI(`You are an AI health assistant. Respond in ${lang === "ur" ? "Urdu" : "English"}. Respond ONLY with raw JSON, no markdown:
{"summary":"2-3 sentences","diseasePrediction":["condition1","condition2"],"keyFindings":["f1","f2","f3"],"dietSuggestions":["d1","d2","d3"],"lifestyleTips":["t1","t2","t3"],"doctorQuestions":["q1","q2","q3"],"urgency":"low","disclaimer":"Not medical advice. Consult a doctor."}

Patient: ${profile.name}, ${profile.age}y, ${profile.weight}kg, ${profile.gender}
Conditions: ${profile.conditions || "None"}
Allergies: ${profile.allergies || "None"}
Symptoms: ${symptoms || "Not provided"}
Affected body areas (from body map): ${affectedAreas.map(k => BODY_PARTS[k].en).join(", ") || "None marked"}
Medicines: ${meds.filter(m => m).join(", ") || "None"}
Lab report: ${labText || "Not provided"}
Vitals: HR ${vitals.hr || "?"}, SpO2 ${vitals.spo2 || "?"}, Temp ${vitals.temp || "?"}, BP ${vitals.sys || "?"}/${vitals.dia || "?"}
Health score: ${Math.round(healthScore)}/100`);
      setAnalysis(result);
      setHistory(h => [{ id: Date.now(), date: new Date().toLocaleString(lang === "ur" ? "ur-PK" : "en-US"), name: profile.name, ...result }, ...h]);
      setTab("analysis");
    } catch { setAnalysisError(L.errorMsg); setTab("analysis"); }
    setLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || !analysis) return;
    const q = chatInput.trim();
    const nextMsgs = [...chatMsgs, { role: "user", text: q }];
    setChatMsgs(nextMsgs); setChatInput(""); setChatLoading(true);
    try {
      const convo = nextMsgs.map(m => `${m.role === "user" ? "Patient" : "AI"}: ${m.text}`).join("\n");
      const result = await callAI(`You are a helpful AI health assistant continuing a conversation. Respond in ${lang === "ur" ? "Urdu" : "English"}. Respond ONLY with raw JSON: {"answer":"your concise helpful answer, 2-5 sentences"}

Context — previous analysis summary: ${analysis.summary}
Urgency: ${analysis.urgency}
Conversation so far:
${convo}

Answer the patient's latest question. Never prescribe medicine or exact doses; suggest seeing a doctor for anything serious.`);
      setChatMsgs(m => [...m, { role: "ai", text: result.answer || "..." }]);
    } catch {
      setChatMsgs(m => [...m, { role: "ai", text: lang === "ur" ? "معذرت، جواب نہیں مل سکا۔" : "Sorry, couldn't get a response. Try again." }]);
    }
    setChatLoading(false);
  };

  const exportPdf = () => window.print();

  const resetAll = () => {
    setTab("profile");
    setProfile({ name: "", age: "", weight: "", gender: "", conditions: "", allergies: "" });
    setSymptoms(""); setAffectedAreas([]); setMeds(["", "", ""]); setLabText(""); setFileName("");
    setAnalysis(null); setAnalysisError(""); setMedResult(null); setMedError(""); setVoiceMsg("");
    setChatMsgs([]);
  };

  const urgencyStyle = { low: [D.successBg, D.success, D.successBorder], medium: [D.warningBg, D.warning, D.warningBorder], high: [D.dangerBg, D.danger, D.dangerBorder] };

  return (
    <div style={{ minHeight: "100%", background: D.bg, position: "relative", overflowX: "hidden", overflowY: "visible", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes hai-spin { to { transform: rotate(360deg); } }
        @keyframes hai-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hai-blob { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-20px) scale(1.08); } 66% { transform: translate(-20px,20px) scale(0.95); } }
        @keyframes hai-ecg-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes hai-pulse { 0%,100% { opacity: 1; } 50% { opacity: .45; } }
        .hai-fade { animation: hai-fade .3s ease; }
        .hai-btn { transition: transform .12s ease, opacity .15s ease, box-shadow .15s ease; }
        .hai-btn:hover { transform: translateY(-1px); opacity: .93; }
        .hai-btn:active { transform: scale(.97); }
        .hai-card-hover { transition: border-color .2s ease, transform .2s ease; }
        .hai-card-hover:hover { border-color: ${D.borderStrong}; transform: translateY(-2px); }
        .hai-pulse { animation: hai-pulse 1.3s ease-in-out infinite; }
        .hai-input { transition: border-color .15s ease, box-shadow .15s ease; }
        .hai-input:focus { border-color: ${D.accentA} !important; box-shadow: 0 0 0 3px rgba(34,211,238,0.15); }
        .hai-input::placeholder { color: ${D.textMuted}; }
        select.hai-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394A3B8' stroke-width='1.5' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 34px; }
        select.hai-input option { background: #0B1220; color: ${D.text}; }
        .hai-tabbar::-webkit-scrollbar { height: 4px; }
        .hai-tabbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
        @media print {
          body * { visibility: hidden; }
          #hai-printable, #hai-printable * { visibility: visible; }
          #hai-printable { position: absolute; left: 0; top: 0; width: 100%; background: #fff; color: #000; padding: 24px; }
        }
      `}</style>

      <div style={{ position: "absolute", top: -80, left: -60, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.25), transparent 70%)", filter: "blur(10px)", animation: "hai-blob 12s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: -100, right: -60, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,0.22), transparent 70%)", filter: "blur(10px)", animation: "hai-blob 14s ease-in-out infinite reverse" }} />

      <div style={{ position: "relative", maxWidth: 680, margin: "0 auto", padding: "1.6rem 1.1rem" }}>
        <h2 style={{ position: "absolute", width: 1, height: 1, overflowX: "hidden", overflowY: "visible" }}>HealthAI Ultra, an AI health assistant</h2>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={22} color={D.accentA} />
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, backgroundImage: gradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{L.title}</h1>
            </div>
            <p style={{ fontSize: 13, color: D.textSecondary, margin: "3px 0 0 30px" }}>{L.sub}</p>
          </div>
          <button className="hai-btn" onClick={() => setLang(l => l === "en" ? "ur" : "en")}
            style={{ padding: "7px 15px", borderRadius: 10, border: `1px solid ${D.borderStrong}`, background: D.glass, color: D.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {lang === "en" ? "اردو" : "English"}
          </button>
        </div>

        <div className="hai-tabbar" style={{ display: "flex", gap: 6, marginBottom: 22, overflowX: "auto", paddingBottom: 6 }}>
          {L.tabs.map(({ key, label: lbl, icon: Icon }) => (
            <button key={key} className="hai-btn" onClick={() => goTab(key)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, border: `1px solid ${tab === key ? "transparent" : D.border}`, background: tab === key ? gradient : D.glass, color: tab === key ? "#04121C" : D.textSecondary, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", fontWeight: tab === key ? 700 : 500 }}>
              <Icon size={14} />{lbl}
            </button>
          ))}
        </div>

        {tab === "profile" && (
          <div className="hai-fade">
            <Field text={L.name} value={profile.name} placeholder="Ali Ahmed" error={errors.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field text={L.age} type="number" value={profile.age} placeholder="25" error={errors.age} onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} />
              <Field text={L.weight} type="number" value={profile.weight} placeholder="70" error={errors.weight} onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={label}>{L.gender}</label>
              <select className="hai-input" value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}
                style={{ ...fieldBase, border: `1.5px solid ${errors.gender ? D.danger : D.border}` }}>
                <option value="">{L.selectGender}</option>
                <option value="Male">{L.male}</option>
                <option value="Female">{L.female}</option>
                <option value="Other">{L.other}</option>
              </select>
              {errors.gender && <p style={{ fontSize: 12, color: D.danger, margin: "4px 0 0" }}>{errors.gender}</p>}
            </div>
            <Field text={L.conditions} as="textarea" value={profile.conditions} placeholder="Diabetes, hypertension..." onChange={e => setProfile(p => ({ ...p, conditions: e.target.value }))} />
            <Field text={L.allergies} as="textarea" value={profile.allergies} placeholder="Penicillin, sulfa..." onChange={e => setProfile(p => ({ ...p, allergies: e.target.value }))} />
            <button className="hai-btn" onClick={() => { if (validate()) setTab("symptoms"); }} style={{ ...btnPrimary, width: "100%" }}>{L.next}</button>
          </div>
        )}

        {tab === "symptoms" && (
          <div className="hai-fade">
            <div className="hai-card-hover" style={{ ...glassCard, textAlign: "center" }}>
              <p style={{ ...label, textAlign: "left", marginBottom: 10 }}>{lang === "ur" ? "متاثرہ جگہ منتخب کریں" : "Tap the body map where it hurts"}</p>
              <BodyMap selected={affectedAreas} onToggle={toggleArea} lang={lang} />
            </div>
            <label style={label}>{L.symptomsLabel}</label>
            <textarea className="hai-input" value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder={L.symptomsPlaceholder} rows={5}
              style={{ ...fieldBase, border: `1.5px solid ${D.border}`, resize: "vertical", marginBottom: 10 }} />
            <button className="hai-btn" onClick={startVoice}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: `1px solid ${listening ? D.dangerBorder : D.borderStrong}`, background: listening ? D.dangerBg : D.glass, color: listening ? D.danger : D.text, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 6 }}>
              <Mic size={15} /><span className={listening ? "hai-pulse" : ""}>{listening ? L.voiceListening : L.voiceBtn}</span>
            </button>
            {voiceMsg && <p style={{ fontSize: 12, color: D.textMuted, margin: "0 0 10px" }}>{voiceMsg}</p>}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="hai-btn" onClick={() => setTab("profile")} style={btnGhost}>{L.back}</button>
              <button className="hai-btn" onClick={() => setTab("medicines")} style={{ ...btnPrimary, flex: 1 }}>{L.next}</button>
            </div>
          </div>
        )}

        {tab === "medicines" && (
          <div className="hai-fade">
            {L.med.map((m, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label style={label}>{m}</label>
                <input className="hai-input" value={meds[i]} onChange={e => { const arr = [...meds]; arr[i] = e.target.value; setMeds(arr); }} placeholder={L.medPlaceholder}
                  style={{ ...fieldBase, border: `1.5px solid ${D.border}` }} />
              </div>
            ))}
            <button className="hai-btn" onClick={checkMeds} disabled={medLoading || !meds.some(m => m.trim())}
              style={{ ...btnPrimary, width: "100%", marginBottom: 14, opacity: medLoading || !meds.some(m => m.trim()) ? 0.5 : 1, cursor: medLoading || !meds.some(m => m.trim()) ? "not-allowed" : "pointer" }}>
              {medLoading && <Spinner dark />}{medLoading ? L.checking : L.checkInteractions}
            </button>
            {medError && <p style={{ fontSize: 13, color: D.danger, marginBottom: 12 }}>{medError}</p>}
            {medResult && (
              <div className="hai-fade hai-card-hover" style={glassCard}>
                <span style={{ fontSize: 13, fontWeight: 700, padding: "4px 13px", borderRadius: 20, background: medResult.safe ? D.successBg : D.dangerBg, color: medResult.safe ? D.success : D.danger, border: `1px solid ${medResult.safe ? D.successBorder : D.dangerBorder}` }}>
                  {medResult.safe ? L.safeCombo : L.cautionCombo}
                </span>
                {medResult.interactions?.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontSize: 12, color: D.textSecondary, margin: "0 0 4px", fontWeight: 700 }}>{L.interactions}</p>
                    {medResult.interactions.map((x, i) => <p key={i} style={{ fontSize: 13, margin: "0 0 3px", color: D.text }}>• {x}</p>)}
                  </div>
                )}
                {medResult.warnings?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <p style={{ fontSize: 12, color: D.warning, margin: "0 0 4px", fontWeight: 700 }}>{L.warnings}</p>
                    {medResult.warnings.map((x, i) => <p key={i} style={{ fontSize: 13, margin: "0 0 3px", color: D.text }}>• {x}</p>)}
                  </div>
                )}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button className="hai-btn" onClick={() => setTab("symptoms")} style={btnGhost}>{L.back}</button>
              <button className="hai-btn" onClick={() => setTab("lab")} style={{ ...btnPrimary, flex: 1 }}>{L.next}</button>
            </div>
          </div>
        )}

        {tab === "lab" && (
          <div className="hai-fade">
            <div className="hai-card-hover" style={{ ...glassCard, textAlign: "center", cursor: "pointer", borderStyle: "dashed" }} onClick={() => fileRef.current?.click()}>
              <Upload size={22} color={D.accentA} style={{ marginBottom: 6 }} />
              <p style={{ fontWeight: 700, margin: "0 0 3px", fontSize: 14, color: D.text }}>{fileName || L.labUpload}</p>
              <p style={{ fontSize: 12, color: D.textSecondary, margin: 0 }}>{fileName ? "✓" : "TXT, CSV"}</p>
              <input ref={fileRef} type="file" accept=".txt,.csv" style={{ display: "none" }} onChange={handleFile} />
            </div>
            <p style={{ fontSize: 13, color: D.textSecondary, margin: "0 0 6px" }}>{L.labPaste}</p>
            <textarea className="hai-input" value={labText} onChange={e => setLabText(e.target.value)} placeholder="CBC, LFT, RFT, HbA1c..." rows={5}
              style={{ ...fieldBase, border: `1.5px solid ${D.border}`, resize: "vertical", marginBottom: 8 }} />
            <p style={{ fontSize: 12, color: D.textMuted, marginBottom: 16 }}>{L.labOptional}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="hai-btn" onClick={() => setTab("medicines")} style={btnGhost}>{L.back}</button>
              <button className="hai-btn" onClick={() => setTab("vitals")} style={{ ...btnPrimary, flex: 1 }}>{L.next}</button>
            </div>
          </div>
        )}

        {tab === "vitals" && (
          <div className="hai-fade">
            <div className="hai-card-hover" style={glassCard}>
              <p style={{ fontWeight: 700, fontSize: 14, color: D.text, margin: "0 0 10px" }}>{L.healthScore} — Live Monitor</p>
              <ECGMonitor vitals={vitals} />
            </div>
            <div className="hai-card-hover" style={{ ...glassCard, marginTop: 12 }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: D.text, margin: "0 0 4px" }}>{L.healthScore}</p>
              <p style={{ fontSize: 12, color: D.textMuted, margin: "0 0 6px" }}>{L.vitalsHint}</p>
              <ScoreGauge score={healthScore} />
            </div>
            <label style={label}>{L.vitalsTitle}</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ ...label, display: "flex", alignItems: "center", gap: 5 }}><Heart size={12} />{L.hr}</label>
                <input className="hai-input" type="number" value={vitals.hr} onChange={e => setVitals(v => ({ ...v, hr: e.target.value }))} placeholder="72" style={{ ...fieldBase, border: `1.5px solid ${D.border}` }} />
              </div>
              <div>
                <label style={{ ...label, display: "flex", alignItems: "center", gap: 5 }}><Wind size={12} />{L.spo2}</label>
                <input className="hai-input" type="number" value={vitals.spo2} onChange={e => setVitals(v => ({ ...v, spo2: e.target.value }))} placeholder="98" style={{ ...fieldBase, border: `1.5px solid ${D.border}` }} />
              </div>
              <div>
                <label style={{ ...label, display: "flex", alignItems: "center", gap: 5 }}><Thermometer size={12} />{L.temp}</label>
                <input className="hai-input" type="number" step="0.1" value={vitals.temp} onChange={e => setVitals(v => ({ ...v, temp: e.target.value }))} placeholder="36.8" style={{ ...fieldBase, border: `1.5px solid ${D.border}` }} />
              </div>
              <div>
                <label style={label}>{L.sys} / {L.dia}</label>
                <div style={{ display: "flex", gap: 6 }}>
                  <input className="hai-input" type="number" value={vitals.sys} onChange={e => setVitals(v => ({ ...v, sys: e.target.value }))} placeholder="120" style={{ ...fieldBase, border: `1.5px solid ${D.border}` }} />
                  <input className="hai-input" type="number" value={vitals.dia} onChange={e => setVitals(v => ({ ...v, dia: e.target.value }))} placeholder="80" style={{ ...fieldBase, border: `1.5px solid ${D.border}` }} />
                </div>
              </div>
            </div>
            {analysisError && <p style={{ fontSize: 13, color: D.danger, marginBottom: 10 }}>{analysisError}</p>}
            <button className="hai-btn" onClick={runAnalysis} disabled={loading}
              style={{ ...btnPrimary, width: "100%", marginBottom: 10, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading && <Spinner dark />}{loading ? L.analyzing : L.analyze}
            </button>
            <button className="hai-btn" onClick={() => setTab("lab")} style={{ ...btnGhost, width: "100%" }}>{L.back}</button>
          </div>
        )}

        {tab === "analysis" && (
          <div className="hai-fade">
            {!analysis && !analysisError && <p style={{ fontSize: 14, color: D.textSecondary }}>{L.runFirst}</p>}
            {analysisError && !analysis && (
              <div style={{ background: D.dangerBg, borderRadius: 14, padding: "1rem 1.25rem", color: D.danger, border: `1px solid ${D.dangerBorder}` }}>{analysisError}</div>
            )}
            {analysis && (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                  <button className="hai-btn" onClick={exportPdf} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: `1px solid ${D.borderStrong}`, background: D.glass, color: D.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <FileDown size={14} />{L.exportPdf}
                  </button>
                </div>
                <div id="hai-printable">
                  {analysis.urgency && (
                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, padding: "5px 15px", borderRadius: 20, background: (urgencyStyle[analysis.urgency] || urgencyStyle.low)[0], color: (urgencyStyle[analysis.urgency] || urgencyStyle.low)[1], border: `1px solid ${(urgencyStyle[analysis.urgency] || urgencyStyle.low)[2]}` }}>
                        {analysis.urgency === "high" ? (lang === "ur" ? "زیادہ فوری" : "High urgency") : analysis.urgency === "medium" ? (lang === "ur" ? "درمیانی" : "Medium urgency") : (lang === "ur" ? "کم فوری" : "Low urgency")}
                      </span>
                    </div>
                  )}
                  <div className="hai-card-hover" style={{ ...glassCard, background: "rgba(34,211,238,0.06)", border: `1px solid rgba(34,211,238,0.25)` }}>
                    <p style={{ fontWeight: 800, fontSize: 13, color: D.accentA, margin: "0 0 6px" }}>{L.summary} — {profile.name}</p>
                    <p style={{ fontSize: 14, color: D.text, margin: 0, lineHeight: 1.6 }}>{analysis.summary}</p>
                  </div>
                  {analysis.diseasePrediction?.length > 0 && (
                    <div className="hai-card-hover" style={glassCard}>
                      <p style={{ fontWeight: 800, fontSize: 13, color: D.warning, margin: "0 0 8px" }}>{L.possible}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {analysis.diseasePrediction.map((d, i) => (
                          <span key={i} style={{ fontSize: 13, padding: "4px 13px", borderRadius: 20, background: D.warningBg, color: D.warning, border: `1px solid ${D.warningBorder}` }}>{d}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {[
                    { title: L.findings, items: analysis.keyFindings, color: D.accentA },
                    { title: L.diet, items: analysis.dietSuggestions, color: D.success },
                    { title: L.lifestyle, items: analysis.lifestyleTips, color: D.accentB },
                    { title: L.doctorQ, items: analysis.doctorQuestions, color: D.warning },
                  ].map(({ title, items, color }) => items?.length > 0 && (
                    <div key={title} className="hai-card-hover" style={glassCard}>
                      <p style={{ fontWeight: 800, fontSize: 13, color, margin: "0 0 8px" }}>{title}</p>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {items.map((x, i) => <li key={i} style={{ fontSize: 14, color: D.textSecondary, marginBottom: 4, lineHeight: 1.5 }}>{x}</li>)}
                      </ul>
                    </div>
                  ))}
                  {analysis.disclaimer && (
                    <div style={{ background: D.warningBg, borderRadius: 10, padding: "10px 14px", marginBottom: 14, border: `1px solid ${D.warningBorder}` }}>
                      <p style={{ fontSize: 12, color: D.warning, margin: 0 }}>{L.disclaimer}: {analysis.disclaimer}</p>
                    </div>
                  )}
                </div>
                <button className="hai-btn" onClick={resetAll} style={{ ...btnGhost, width: "100%" }}>{L.newAnalysis}</button>
              </>
            )}
          </div>
        )}

        {tab === "chat" && (
          <div className="hai-fade">
            {!analysis ? (
              <p style={{ fontSize: 14, color: D.textSecondary }}>{L.chatEmpty}</p>
            ) : (
              <>
                <div style={{ ...glassCard, maxHeight: 360, overflowY: "auto", marginBottom: 12 }}>
                  {chatMsgs.length === 0 && <p style={{ fontSize: 13, color: D.textMuted, margin: 0 }}>{L.chatTitle} 👇</p>}
                  {chatMsgs.map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                      <div style={{ maxWidth: "80%", padding: "9px 13px", borderRadius: 14, fontSize: 13.5, lineHeight: 1.5, background: m.role === "user" ? gradient : "rgba(255,255,255,0.06)", color: m.role === "user" ? "#04121C" : D.text, fontWeight: m.role === "user" ? 600 : 400 }}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && <p style={{ fontSize: 12, color: D.textMuted }}><Spinner />{L.chatThinking}</p>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="hai-input" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder={L.chatPlaceholder}
                    style={{ ...fieldBase, border: `1.5px solid ${D.border}`, flex: 1 }} />
                  <button className="hai-btn" onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{ ...btnPrimary, padding: "10px 16px", opacity: chatLoading || !chatInput.trim() ? 0.5 : 1 }}>
                    <Send size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {tab === "history" && (
          <div className="hai-fade">
            {history.length === 0 ? (
              <p style={{ fontSize: 14, color: D.textSecondary }}>{L.historyEmpty}</p>
            ) : (
              <>
                <p style={{ fontWeight: 800, fontSize: 14, color: D.text, marginBottom: 12 }}>{L.historyTitle}</p>
                {history.map(h => (
                  <div key={h.id} className="hai-card-hover" style={glassCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 13.5, color: D.text, margin: 0 }}>{h.name}</p>
                        <p style={{ fontSize: 11.5, color: D.textMuted, margin: "2px 0 0" }}>{h.date}</p>
                      </div>
                      {h.urgency && (
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: (urgencyStyle[h.urgency] || urgencyStyle.low)[0], color: (urgencyStyle[h.urgency] || urgencyStyle.low)[1] }}>{h.urgency}</span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: D.textSecondary, margin: "0 0 8px", lineHeight: 1.5 }}>{h.summary}</p>
                    <button className="hai-btn" onClick={() => { setAnalysis(h); setTab("analysis"); }} style={{ fontSize: 12.5, fontWeight: 700, color: D.accentA, background: "none", border: "none", cursor: "pointer", padding: 0 }}>{L.view} →</button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
