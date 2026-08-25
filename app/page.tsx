"use client";

import { useState, useRef } from "react";

const LANG = {
  en: {
    title: "HealthAI Ultra", sub: "Your AI-powered health companion",
    tabs: ["Profile", "Symptoms", "Medicines", "Lab Report", "Analysis"],
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
    runFirst: "Run the analysis first.",
  },
  ur: {
    title: "HealthAI Ultra", sub: "آپ کا AI صحت ساتھی",
    tabs: ["پروفائل", "علامات", "دوائیں", "لیب رپورٹ", "تجزیہ"],
    name: "پورا نام", age: "عمر (سال)", weight: "وزن (کلو)", gender: "جنس",
    conditions: "موجودہ بیماریاں (اختیاری)", allergies: "الرجی (اختیاری)",
    selectGender: "جنس منتخب کریں", male: "مرد", female: "عورت", other: "دیگر",
    next: "آگے", back: "واپس", analyze: "AI تجزیہ کریں", analyzing: "تجزیہ ہو رہا ہے...",
    newAnalysis: "نیا تجزیہ", fillProfile: "پہلے نام، عمر، وزن اور جنس درج کریں۔",
    symptomsLabel: "اپنی علامات بیان کریں", symptomsPlaceholder: "مثلاً بخار، سر درد، سینے میں درد 3 دن سے...",
    voiceBtn: "بول کر بتائیں", voiceListening: "سن رہا ہوں...",
    med: ["دوا 1", "دوا 2 (اختیاری)", "دوا 3 (اختیاری)"],
    medPlaceholder: "مثلاً پیراسیٹامول 500mg", checkInteractions: "تعامل چیک کریں", checking: "چیک ہو رہا ہے...",
    labUpload: "لیب رپورٹ اپلوڈ کریں", labPaste: "یا یہاں پیسٹ کریں:", labOptional: "لیب رپورٹ اختیاری ہے — چھوڑ سکتے ہیں۔",
    summary: "خلاصہ", findings: "اہم نتائج", diet: "خوراک کی ہدایات",
    lifestyle: "طرز زندگی", doctorQ: "ڈاکٹر سے پوچھیں", disclaimer: "وضاحت",
    errorMsg: "تجزیہ ناکام ہوا۔ دوبارہ کوشش کریں۔", errorMed: "چیک ناکام ہوا۔ دوبارہ کوشش کریں۔",
    voiceNotSupported: "یہ براؤزر آواز سپورٹ نہیں کرتا۔",
    safeCombo: "محفوظ امتزاج", cautionCombo: "احتیاط درکار ہے",
    interactions: "تعاملات", warnings: "انتباہات", possible: "ممکنہ حالات",
    runFirst: "پہلے تجزیہ چلائیں۔",
  }
};

const C = {
  bg: "#F4FAF9", surface: "#FFFFFF", border: "#D3E6E2", borderStrong: "#9FC9C0",
  text: "#0B2B26", textSecondary: "#4B6B65", textMuted: "#7C9994",
  primary: "#0E7C7B", primaryBg: "#E3F4F2", primaryBorder: "#8FCFCB",
  success: "#1B8A5A", successBg: "#E4F6EC", successBorder: "#8CD9AE",
  warning: "#B8860B", warningBg: "#FDF3D8", warningBorder: "#E8C25A",
  danger: "#C23B3B", dangerBg: "#FBE7E7", dangerBorder: "#E79A9A",
  onAccent: "#FFFFFF"
};

async function callClaude(prompt) {
  const res = await fetch("/api/health-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error("api_error");
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

const card = { background: C.surface, borderRadius: 14, border: `1.5px solid ${C.border}`, padding: "1rem 1.25rem", marginBottom: 12, boxShadow: "0 1px 3px rgba(14,124,123,0.06)" };
const label = { display: "block", fontSize: 13, color: C.textSecondary, marginBottom: 5, fontWeight: 500 };
const fieldBase = { width: "100%", padding: "9px 12px", borderRadius: 10, background: C.surface, color: C.text, fontSize: 14, boxSizing: "border-box", outline: "none" };
const btnPrimary = { padding: "11px 18px", borderRadius: 10, background: C.primary, color: C.onAccent, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 6px rgba(14,124,123,0.25)" };
const btnGhost = { padding: "11px 18px", borderRadius: 10, background: C.surface, color: C.text, border: `1.5px solid ${C.borderStrong}`, fontSize: 14, cursor: "pointer" };

function Field({ text, value, onChange, error, placeholder, type = "text", as }) {
  const style = { ...fieldBase, border: `1.5px solid ${error ? C.danger : C.border}` };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={label}>{text}</label>
      {as === "textarea" ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={2} style={{ ...style, resize: "vertical" }} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={style} />
      )}
      {error && <p style={{ fontSize: 12, color: C.danger, margin: "4px 0 0" }}>{error}</p>}
    </div>
  );
}

function Spinner() {
  return <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${C.onAccent}`, borderTopColor: "transparent", borderRadius: "50%", animation: "hai-spin .7s linear infinite", verticalAlign: "-2px", marginRight: 8 }} />;
}

export default function HealthAIUltra() {
  const [lang, setLang] = useState("en");
  const L = LANG[lang];
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState({ name: "", age: "", weight: "", gender: "", conditions: "", allergies: "" });
  const [symptoms, setSymptoms] = useState("");
  const [meds, setMeds] = useState(["", "", ""]);
  const [labText, setLabText] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [errors, setErrors] = useState({});
  const [listening, setListening] = useState(false);
  const [voiceMsg, setVoiceMsg] = useState("");
  const [medResult, setMedResult] = useState(null);
  const [medLoading, setMedLoading] = useState(false);
  const [medError, setMedError] = useState("");
  const fileRef = useRef();

  const profileReady = profile.name.trim() && profile.age && profile.weight && profile.gender;

  const validate = () => {
    const e = {};
    if (!profile.name.trim()) e.name = lang === "ur" ? "نام درج کریں" : "Enter your name";
    if (!profile.age || isNaN(profile.age) || profile.age < 1 || profile.age > 120) e.age = lang === "ur" ? "درست عمر درج کریں" : "Enter a valid age";
    if (!profile.weight || isNaN(profile.weight) || profile.weight < 1) e.weight = lang === "ur" ? "درست وزن درج کریں" : "Enter a valid weight";
    if (!profile.gender) e.gender = lang === "ur" ? "جنس منتخب کریں" : "Select a gender";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goTab = (i) => { if (i > 0 && !profileReady) { setTab(0); return; } setTab(i); };

  const startVoice = () => {
    setVoiceMsg("");
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) { setVoiceMsg(L.voiceNotSupported); return; }
    try {
      const r = new SR();
      r.lang = lang === "ur" ? "ur-PK" : "en-US";
      r.continuous = false;
      r.interimResults = false;
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
      const result = await callClaude(`You are a pharmacology expert. Analyze these medicines: ${filtered.join(", ")}. Respond ONLY with raw JSON, no markdown, no backticks, matching exactly this shape:
{"safe": true, "interactions": ["..."], "warnings": ["..."]}`);
      setMedResult(result);
    } catch { setMedError(L.errorMed); }
    setMedLoading(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try { setLabText(await file.text()); } catch { /* ignore */ }
  };

  const runAnalysis = async () => {
    setLoading(true); setAnalysis(null); setAnalysisError("");
    try {
      const result = await callClaude(`You are an AI health assistant. Respond in ${lang === "ur" ? "Urdu" : "English"}. Respond ONLY with raw JSON, no markdown, no backticks, matching exactly this shape:
{"summary":"2-3 sentences","diseasePrediction":["condition1","condition2"],"keyFindings":["f1","f2","f3"],"dietSuggestions":["d1","d2","d3"],"lifestyleTips":["t1","t2","t3"],"doctorQuestions":["q1","q2","q3"],"urgency":"low","disclaimer":"Not medical advice. Consult a doctor."}

Patient: ${profile.name}, ${profile.age}y, ${profile.weight}kg, ${profile.gender}
Conditions: ${profile.conditions || "None"}
Allergies: ${profile.allergies || "None"}
Symptoms: ${symptoms || "Not provided"}
Medicines: ${meds.filter(m => m).join(", ") || "None"}
Lab report: ${labText || "Not provided"}`);
      setAnalysis(result);
      setTab(4);
    } catch { setAnalysisError(L.errorMsg); setTab(4); }
    setLoading(false);
  };

  const resetAll = () => {
    setTab(0);
    setProfile({ name: "", age: "", weight: "", gender: "", conditions: "", allergies: "" });
    setSymptoms(""); setMeds(["", "", ""]); setLabText(""); setFileName("");
    setAnalysis(null); setAnalysisError(""); setMedResult(null); setMedError(""); setVoiceMsg("");
  };

  const urgencyStyle = { low: [C.successBg, C.success], medium: [C.warningBg, C.warning], high: [C.dangerBg, C.danger] };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "1.5rem 1rem", background: C.bg, minHeight: "100%", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes hai-spin { to { transform: rotate(360deg); } }
        @keyframes hai-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .hai-fade { animation: hai-fade .25s ease; }
        .hai-btn { transition: opacity .15s ease, transform .1s ease, background .15s ease; }
        .hai-btn:hover { opacity: .88; }
        .hai-btn:active { transform: scale(.98); }
        .hai-card-hover { transition: border-color .15s ease, box-shadow .15s ease; }
        .hai-card-hover:hover { border-color: ${C.primaryBorder}; box-shadow: 0 2px 8px rgba(14,124,123,0.1); }
        .hai-pulse { animation: hai-pulse 1.2s ease-in-out infinite; }
        @keyframes hai-pulse { 0%,100% { opacity: 1; } 50% { opacity: .5; } }
        .hai-input:focus { border-color: ${C.primary} !important; box-shadow: 0 0 0 3px ${C.primaryBg}; }
        select.hai-input { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234B6B65' stroke-width='1.5' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
      `}</style>

      <h2 style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>HealthAI Ultra, an AI health assistant</h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 23, fontWeight: 700, margin: "0 0 2px", color: C.primary }}>{L.title}</h1>
          <p style={{ fontSize: 13, color: C.textSecondary, margin: 0 }}>{L.sub}</p>
        </div>
        <button className="hai-btn" onClick={() => setLang(l => l === "en" ? "ur" : "en")} style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${C.primaryBorder}`, background: C.primaryBg, color: C.primary, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {lang === "en" ? "اردو" : "English"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 22, overflowX: "auto", paddingBottom: 4 }}>
        {L.tabs.map((t, i) => (
          <button key={i} className="hai-btn" onClick={() => goTab(i)}
            style={{ padding: "7px 13px", borderRadius: 20, border: `1.5px solid ${tab === i ? C.primary : C.border}`, background: tab === i ? C.primary : C.surface, color: tab === i ? C.onAccent : C.textSecondary, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", fontWeight: tab === i ? 600 : 500 }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="hai-fade">
          <Field text={L.name} value={profile.name} placeholder="Ali Ahmed" error={errors.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field text={L.age} type="number" value={profile.age} placeholder="25" error={errors.age} onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} />
            <Field text={L.weight} type="number" value={profile.weight} placeholder="70" error={errors.weight} onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={label}>{L.gender}</label>
            <select className="hai-input" value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}
              style={{ ...fieldBase, border: `1.5px solid ${errors.gender ? C.danger : C.border}` }}>
              <option value="">{L.selectGender}</option>
              <option value="Male">{L.male}</option>
              <option value="Female">{L.female}</option>
              <option value="Other">{L.other}</option>
            </select>
            {errors.gender && <p style={{ fontSize: 12, color: C.danger, margin: "4px 0 0" }}>{errors.gender}</p>}
          </div>
          <Field text={L.conditions} as="textarea" value={profile.conditions} placeholder="Diabetes, hypertension..." onChange={e => setProfile(p => ({ ...p, conditions: e.target.value }))} />
          <Field text={L.allergies} as="textarea" value={profile.allergies} placeholder="Penicillin, sulfa..." onChange={e => setProfile(p => ({ ...p, allergies: e.target.value }))} />
          <button className="hai-btn" onClick={() => { if (validate()) setTab(1); }} style={{ ...btnPrimary, width: "100%" }}>{L.next}</button>
        </div>
      )}

      {tab === 1 && (
        <div className="hai-fade">
          <label style={label}>{L.symptomsLabel}</label>
          <textarea className="hai-input" value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder={L.symptomsPlaceholder} rows={5}
            style={{ ...fieldBase, border: `1.5px solid ${C.border}`, resize: "vertical", marginBottom: 10 }} />
          <button className="hai-btn" onClick={startVoice}
            style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${listening ? C.dangerBorder : C.primaryBorder}`, background: listening ? C.dangerBg : C.primaryBg, color: listening ? C.danger : C.primary, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 6 }}>
            <span className={listening ? "hai-pulse" : ""}>{listening ? L.voiceListening : L.voiceBtn}</span>
          </button>
          {voiceMsg && <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 10px" }}>{voiceMsg}</p>}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button className="hai-btn" onClick={() => setTab(0)} style={btnGhost}>{L.back}</button>
            <button className="hai-btn" onClick={() => setTab(2)} style={{ ...btnPrimary, flex: 1 }}>{L.next}</button>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="hai-fade">
          {L.med.map((m, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <label style={label}>{m}</label>
              <input className="hai-input" value={meds[i]} onChange={e => { const arr = [...meds]; arr[i] = e.target.value; setMeds(arr); }} placeholder={L.medPlaceholder}
                style={{ ...fieldBase, border: `1.5px solid ${C.border}` }} />
            </div>
          ))}
          <button className="hai-btn" onClick={checkMeds} disabled={medLoading || !meds.some(m => m.trim())}
            style={{ ...btnPrimary, width: "100%", marginBottom: 14, opacity: medLoading || !meds.some(m => m.trim()) ? 0.5 : 1, cursor: medLoading || !meds.some(m => m.trim()) ? "not-allowed" : "pointer" }}>
            {medLoading && <Spinner />}{medLoading ? L.checking : L.checkInteractions}
          </button>

          {medError && <p style={{ fontSize: 13, color: C.danger, marginBottom: 12 }}>{medError}</p>}

          {medResult && (
            <div className="hai-fade hai-card-hover" style={card}>
              <span style={{ fontSize: 13, fontWeight: 600, padding: "3px 12px", borderRadius: 20, background: medResult.safe ? C.successBg : C.dangerBg, color: medResult.safe ? C.success : C.danger }}>
                {medResult.safe ? L.safeCombo : L.cautionCombo}
              </span>
              {medResult.interactions?.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ fontSize: 12, color: C.textSecondary, margin: "0 0 4px", fontWeight: 600 }}>{L.interactions}</p>
                  {medResult.interactions.map((x, i) => <p key={i} style={{ fontSize: 13, margin: "0 0 3px", color: C.text }}>• {x}</p>)}
                </div>
              )}
              {medResult.warnings?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <p style={{ fontSize: 12, color: C.warning, margin: "0 0 4px", fontWeight: 600 }}>{L.warnings}</p>
                  {medResult.warnings.map((x, i) => <p key={i} style={{ fontSize: 13, margin: "0 0 3px", color: C.text }}>• {x}</p>)}
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button className="hai-btn" onClick={() => setTab(1)} style={btnGhost}>{L.back}</button>
            <button className="hai-btn" onClick={() => setTab(3)} style={{ ...btnPrimary, flex: 1 }}>{L.next}</button>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="hai-fade">
          <div className="hai-card-hover" style={{ ...card, textAlign: "center", cursor: "pointer", borderStyle: "dashed" }} onClick={() => fileRef.current?.click()}>
            <p style={{ fontWeight: 600, margin: "0 0 3px", fontSize: 14, color: C.primary }}>{fileName || L.labUpload}</p>
            <p style={{ fontSize: 12, color: C.textSecondary, margin: 0 }}>{fileName ? "✓" : "TXT, CSV"}</p>
            <input ref={fileRef} type="file" accept=".txt,.csv" style={{ display: "none" }} onChange={handleFile} />
          </div>
          <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 6px" }}>{L.labPaste}</p>
          <textarea className="hai-input" value={labText} onChange={e => setLabText(e.target.value)} placeholder="CBC, LFT, RFT, HbA1c..." rows={5}
            style={{ ...fieldBase, border: `1.5px solid ${C.border}`, resize: "vertical", marginBottom: 8 }} />
          <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>{L.labOptional}</p>

          {analysisError && <p style={{ fontSize: 13, color: C.danger, marginBottom: 10 }}>{analysisError}</p>}

          <button className="hai-btn" onClick={runAnalysis} disabled={loading}
            style={{ ...btnPrimary, width: "100%", marginBottom: 10, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading && <Spinner />}{loading ? L.analyzing : L.analyze}
          </button>
          <button className="hai-btn" onClick={() => setTab(2)} style={{ ...btnGhost, width: "100%" }}>{L.back}</button>
        </div>
      )}

      {tab === 4 && (
        <div className="hai-fade">
          {!analysis && !analysisError && <p style={{ fontSize: 14, color: C.textSecondary }}>{L.runFirst}</p>}
          {analysisError && !analysis && (
            <div style={{ background: C.dangerBg, borderRadius: 12, padding: "1rem 1.25rem", color: C.danger }}>{analysisError}</div>
          )}
          {analysis && (
            <>
              {analysis.urgency && (
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, padding: "4px 14px", borderRadius: 20, background: (urgencyStyle[analysis.urgency] || urgencyStyle.low)[0], color: (urgencyStyle[analysis.urgency] || urgencyStyle.low)[1] }}>
                    {analysis.urgency === "high" ? (lang === "ur" ? "زیادہ فوری" : "High urgency") : analysis.urgency === "medium" ? (lang === "ur" ? "درمیانی" : "Medium urgency") : (lang === "ur" ? "کم فوری" : "Low urgency")}
                  </span>
                </div>
              )}

              <div className="hai-card-hover" style={{ background: C.primaryBg, borderRadius: 14, border: `1.5px solid ${C.primaryBorder}`, padding: "1rem 1.25rem", marginBottom: 12 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: C.primary, margin: "0 0 6px" }}>{L.summary} — {profile.name}</p>
                <p style={{ fontSize: 14, color: C.text, margin: 0, lineHeight: 1.6 }}>{analysis.summary}</p>
              </div>

              {analysis.diseasePrediction?.length > 0 && (
                <div className="hai-card-hover" style={card}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: C.warning, margin: "0 0 8px" }}>{L.possible}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {analysis.diseasePrediction.map((d, i) => (
                      <span key={i} style={{ fontSize: 13, padding: "3px 12px", borderRadius: 20, background: C.warningBg, color: C.warning, border: `1px solid ${C.warningBorder}` }}>{d}</span>
                    ))}
                  </div>
                </div>
              )}

              {[
                { title: L.findings, items: analysis.keyFindings, color: C.primary },
                { title: L.diet, items: analysis.dietSuggestions, color: C.success },
                { title: L.lifestyle, items: analysis.lifestyleTips, color: C.primary },
                { title: L.doctorQ, items: analysis.doctorQuestions, color: C.warning },
              ].map(({ title, items, color }) => items?.length > 0 && (
                <div key={title} className="hai-card-hover" style={card}>
                  <p style={{ fontWeight: 700, fontSize: 13, color, margin: "0 0 8px" }}>{title}</p>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {items.map((x, i) => <li key={i} style={{ fontSize: 14, color: C.textSecondary, marginBottom: 4, lineHeight: 1.5 }}>{x}</li>)}
                  </ul>
                </div>
              ))}

              {analysis.disclaimer && (
                <div style={{ background: C.warningBg, borderRadius: 8, padding: "10px 14px", marginBottom: 14, border: `1px solid ${C.warningBorder}` }}>
                  <p style={{ fontSize: 12, color: C.warning, margin: 0 }}>{L.disclaimer}: {analysis.disclaimer}</p>
                </div>
              )}

              <button className="hai-btn" onClick={resetAll} style={{ ...btnGhost, width: "100%" }}>{L.newAnalysis}</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
