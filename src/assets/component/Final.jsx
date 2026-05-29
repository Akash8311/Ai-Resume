import { useState, useRef, useCallback } from "react";

/* ─── COLOUR PALETTE ─────────────────────────────────────────────────── */
const G = {
  50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",
  400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",
  800:"#166534",900:"#14532d",
};
const C = {
  pageBg:"#f8fffe", sidebarBg:"#ffffff", white:"#ffffff",
  text:"#0f2718", textMid:"#2d5a3d", textLight:"#5a8a6a",
  border:"#d1fae5", borderMid:"#a7f3d0",
  shadow:"rgba(22,163,74,0.10)", shadowMd:"rgba(22,163,74,0.18)",
};

/* ─── GLOBAL CSS ──────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:${C.pageBg};color:${C.text};}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:${G[100]};}
::-webkit-scrollbar-thumb{background:${G[300]};border-radius:99px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px);}to{opacity:1;transform:translateX(0);}}
@keyframes scoreReveal{from{stroke-dasharray:0 314;}to{}}
@keyframes bounceIn{0%{transform:scale(0.7);opacity:0;}70%{transform:scale(1.05);}100%{transform:scale(1);opacity:1;}}
@keyframes typewriter{from{width:0;}to{width:100%;}}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
.fade-up{animation:fadeUp 0.5s ease both;}
.fade-in{animation:fadeIn 0.4s ease both;}
.slide-in{animation:slideIn 0.4s ease both;}
.bounce-in{animation:bounceIn 0.5s cubic-bezier(.36,.07,.19,.97) both;}
input,textarea,select{
  font-family:'Plus Jakarta Sans',sans-serif;font-size:13.5px;
  background:${C.white};border:1.5px solid ${C.border};border-radius:10px;
  padding:10px 14px;color:${C.text};width:100%;
  transition:border 0.2s,box-shadow 0.2s;resize:vertical;outline:none;
}
input:focus,textarea:focus,select:focus{border-color:${G[500]};box-shadow:0 0 0 3px ${G[100]};}
input::placeholder,textarea::placeholder{color:${C.textLight};opacity:0.7;}
label{display:block;font-size:11.5px;font-weight:700;color:${C.textMid};
  letter-spacing:0.6px;text-transform:uppercase;margin-bottom:5px;}
button{font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;}
.tab-btn{transition:all 0.2s ease;}
.tab-btn:hover{background:${G[100]} !important;}
.tab-btn.active{background:${G[500]} !important;color:#fff !important;box-shadow:0 4px 14px ${C.shadowMd};}
.tpl-card{transition:all 0.25s ease;cursor:pointer;}
.tpl-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px ${C.shadowMd} !important;}
.tpl-card.selected{border-color:${G[500]} !important;box-shadow:0 0 0 3px ${G[200]},0 8px 24px ${C.shadowMd} !important;}
.section-card{animation:fadeUp 0.4s ease both;}
.btn-primary{background:linear-gradient(135deg,${G[500]},${G[600]});color:#fff;
  border:none;border-radius:10px;font-weight:700;font-size:14px;
  padding:11px 24px;transition:all 0.2s;box-shadow:0 4px 14px ${C.shadowMd};letter-spacing:0.2px;}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 24px ${C.shadowMd};}
.btn-primary:disabled{opacity:0.65;cursor:not-allowed;transform:none;}
.btn-outline{background:${C.white};color:${G[700]};border:1.5px solid ${G[400]};
  border-radius:10px;font-weight:600;font-size:13.5px;padding:10px 22px;transition:all 0.2s;}
.btn-outline:hover{background:${G[50]};border-color:${G[500]};}
.btn-ghost{background:transparent;color:${C.textLight};border:none;
  border-radius:8px;font-size:13px;font-weight:500;padding:7px 14px;transition:all 0.2s;}
.btn-ghost:hover{background:${G[50]};color:${G[700]};}
.progress-bar{height:6px;border-radius:99px;background:${G[100]};overflow:hidden;}
.progress-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,${G[400]},${G[600]});transition:width 0.5s ease;}
.ai-score-ring{animation:scoreReveal 1.4s cubic-bezier(0.4,0,0.2,1) both;}
.issue-card{transition:all 0.2s ease;}
.issue-card:hover{transform:translateX(3px);box-shadow:0 4px 16px ${C.shadow};}
@media print{
  body *{visibility:hidden;}
  #pdf-target,#pdf-target *{visibility:visible;}
  #pdf-target{position:fixed !important;inset:0 !important;width:210mm !important;
    min-height:297mm !important;margin:0 !important;padding:0 !important;
    box-shadow:none !important;border-radius:0 !important;overflow:visible !important;
    background:white !important;z-index:99999 !important;}
  @page{size:A4;margin:0;}
}
`;

/* ─── TEMPLATES ───────────────────────────────────────────────────────── */
const TEMPLATES = [
  {id:"modern",   name:"Modern Green",  tag:"Most Popular", icon:"◈", accent:G[600],   headerBg:G[600],     headerText:"#fff",    bodyBg:"#fff", borderColor:G[200]},
  {id:"clean",    name:"Clean White",   tag:"ATS Best",     icon:"▣", accent:"#1e3a5f",headerBg:"#1e3a5f",  headerText:"#fff",    bodyBg:"#fff", borderColor:"#dbeafe"},
  {id:"minimal",  name:"Minimal Leaf",  tag:"Minimalist",   icon:"◻", accent:G[700],   headerBg:"#fff",     headerText:G[800],    bodyBg:"#fff", borderColor:G[200]},
  {id:"executive",name:"Executive",     tag:"Corporate",    icon:"◆", accent:"#1a1a2e",headerBg:"#1a1a2e",  headerText:"#fff",    bodyBg:"#fafafa",borderColor:"#e2e8f0"},
  {id:"creative", name:"Creative Split",tag:"Design Roles", icon:"◉", accent:G[600],   headerBg:G[50],      headerText:G[900],    bodyBg:"#fff", borderColor:G[200]},
  {id:"gradient", name:"Gradient Pro",  tag:"Premium",      icon:"◑", accent:G[700],   headerBg:`linear-gradient(135deg,${G[700]},${G[500]})`,headerText:"#fff",bodyBg:"#fff",borderColor:G[200]},
];

/* ─── HELPERS ─────────────────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2,8);
const NAV_ITEMS = [
  {id:"basics",    label:"Personal Info",  icon:"👤"},
  {id:"summary",   label:"Summary",        icon:"✍️"},
  {id:"experience",label:"Experience",     icon:"💼"},
  {id:"education", label:"Education",      icon:"🎓"},
  {id:"skills",    label:"Skills",         icon:"⚡"},
  {id:"projects",  label:"Projects",       icon:"🚀"},
  {id:"certs",     label:"Certifications", icon:"🏆"},
  {id:"languages", label:"Languages",      icon:"🌍"},
  {id:"awards",    label:"Awards",         icon:"🏅"},
  {id:"interests", label:"Interests",      icon:"💡"},
];

const EMPTY = {
  name:"",title:"",email:"",phone:"",location:"",website:"",linkedin:"",github:"",
  summary:"",photo:null,
  experience:[{id:uid(),company:"",position:"",duration:"",description:""}],
  education:[{id:uid(),institution:"",degree:"",year:"",grade:""}],
  skills:[{id:uid(),category:"Technical Skills",items:""}],
  projects:[{id:uid(),name:"",tech:"",description:"",link:""}],
  certifications:[{id:uid(),name:"",issuer:"",year:""}],
  languages:[{id:uid(),language:"",proficiency:"Fluent"}],
  awards:[{id:uid(),title:"",org:"",year:""}],
  interests:"",
};

function calcCompletion(f) {
  let filled=0,total=0;
  ["name","title","email","phone","location","summary"].forEach(k=>{total++;if(f[k]?.trim())filled++;});
  ["experience","education","skills","projects"].forEach(sec=>{
    f[sec]?.forEach(item=>{Object.values(item).forEach(v=>{if(typeof v==="string"&&v!==item.id){total++;if(v.trim())filled++;}});});
  });
  return Math.min(100,Math.round((filled/total)*100));
}

/* ══════════════════════════════════════════════════════════════════════
   AI ANALYZER MODAL
══════════════════════════════════════════════════════════════════════ */
function AIAnalyzerModal({ data, onClose }) {
  const [stage, setStage] = useState("idle"); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const buildPrompt = () => {
    const r = data;
    return `You are an expert resume coach and ATS specialist. Analyze the following resume data and return a detailed JSON report.

RESUME DATA:
Name: ${r.name||"Not provided"}
Title: ${r.title||"Not provided"}
Email: ${r.email||"Not provided"}
Phone: ${r.phone||"Not provided"}
Location: ${r.location||"Not provided"}
LinkedIn: ${r.linkedin||"Not provided"}
GitHub: ${r.github||"Not provided"}
Website: ${r.website||"Not provided"}

SUMMARY:
${r.summary||"Not provided"}

EXPERIENCE:
${r.experience?.map(e=>`• ${e.position} at ${e.company} (${e.duration})\n  ${e.description}`).join("\n")||"Not provided"}

EDUCATION:
${r.education?.map(e=>`• ${e.degree} from ${e.institution} (${e.year}) - ${e.grade}`).join("\n")||"Not provided"}

SKILLS:
${r.skills?.map(s=>`${s.category}: ${s.items}`).join("\n")||"Not provided"}

PROJECTS:
${r.projects?.map(p=>`• ${p.name} (${p.tech}): ${p.description}`).join("\n")||"Not provided"}

CERTIFICATIONS:
${r.certifications?.map(c=>`• ${c.name} by ${c.issuer} (${c.year})`).join("\n")||"Not provided"}

LANGUAGES: ${r.languages?.map(l=>`${l.language} (${l.proficiency})`).join(", ")||"Not provided"}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "formatScore": <number 0-100>,
  "impactScore": <number 0-100>,
  "grade": "<A+|A|B+|B|C+|C|D>",
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength1>","<strength2>","<strength3>"],
  "criticalIssues": [
    {"title":"<issue title>","description":"<detailed description>","priority":"high|medium|low","fix":"<specific fix suggestion>"}
  ],
  "sectionFeedback": {
    "contact": {"score":<0-100>,"feedback":"<feedback>"},
    "summary": {"score":<0-100>,"feedback":"<feedback>"},
    "experience": {"score":<0-100>,"feedback":"<feedback>"},
    "education": {"score":<0-100>,"feedback":"<feedback>"},
    "skills": {"score":<0-100>,"feedback":"<feedback>"},
    "projects": {"score":<0-100>,"feedback":"<feedback>"}
  },
  "keywordSuggestions": ["<keyword1>","<keyword2>","<keyword3>","<keyword4>","<keyword5>"],
  "quickWins": ["<quick improvement 1>","<quick improvement 2>","<quick improvement 3>"],
  "industryBenchmark": "<sentence comparing to industry standard>"
}`;
  };

  const runAnalysis = async () => {
    setStage("loading");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1500,
          messages:[{role:"user",content:buildPrompt()}]
        })
      });
      const json = await res.json();
      const text = json.content?.[0]?.text || "";
      const cleaned = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
      setStage("done");
    } catch(e) {
      setStage("error");
    }
  };

  const scoreColor = (s) => s>=80?G[600]:s>=60?"#d97706":s>=40?"#f97316":"#dc2626";
  const scoreLabel = (s) => s>=85?"Excellent":s>=70?"Good":s>=55?"Fair":"Needs Work";
  const priorityColor = {high:"#dc2626",medium:"#d97706",low:G[600]};
  const priorityBg = {high:"#fef2f2",medium:"#fffbeb",low:G[50]};
  const priorityBorder = {high:"#fecaca",medium:"#fde68a",low:G[200]};

  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      {/* Backdrop */}
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(15,39,24,0.55)",backdropFilter:"blur(6px)"}}/>
      {/* Modal */}
      <div className="bounce-in" style={{position:"relative",width:"100%",maxWidth:820,maxHeight:"90vh",background:C.white,borderRadius:20,overflow:"hidden",boxShadow:`0 32px 80px rgba(0,0,0,0.2), 0 0 0 1px ${C.border}`,display:"flex",flexDirection:"column"}}>
        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${G[700]},${G[500]})`,padding:"22px 28px",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:42,height:42,borderRadius:12,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>✦</div>
              <div>
                <div style={{fontSize:18,fontWeight:800,color:"#fff",letterSpacing:-0.3}}>AI Resume Analyzer</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.75)"}}>Powered by Claude AI · Deep resume intelligence</div>
              </div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,width:32,height:32,color:"#fff",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
        </div>

        <div style={{overflowY:"auto",flex:1,padding:"24px 28px"}}>
          {/* IDLE */}
          {stage==="idle" && (
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              <div style={{fontSize:64,marginBottom:16}}>🤖</div>
              <h3 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:10,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Ready to Analyze Your Resume</h3>
              <p style={{color:C.textLight,fontSize:15,lineHeight:1.7,maxWidth:480,margin:"0 auto 32px"}}>
                Our AI will scan every section of your resume for ATS compatibility, content quality, formatting issues, missing keywords, and give you a detailed score with actionable fixes.
              </p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,maxWidth:500,margin:"0 auto 32px"}}>
                {[["🎯","ATS Score","Check keyword optimization"],["📝","Content Quality","Evaluate impact & clarity"],["⚡","Quick Fixes","Get actionable suggestions"]].map(([ic,t,d])=>(
                  <div key={t} style={{background:G[50],border:`1px solid ${G[200]}`,borderRadius:12,padding:"14px 12px",textAlign:"center"}}>
                    <div style={{fontSize:24,marginBottom:6}}>{ic}</div>
                    <div style={{fontSize:12,fontWeight:700,color:C.textMid,marginBottom:3}}>{t}</div>
                    <div style={{fontSize:11,color:C.textLight,lineHeight:1.4}}>{d}</div>
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={runAnalysis} style={{padding:"14px 48px",fontSize:15,borderRadius:12}}>
                ✦ Analyze My Resume with AI
              </button>
              <div style={{marginTop:14,fontSize:12,color:C.textLight}}>Analysis takes ~10–15 seconds</div>
            </div>
          )}

          {/* LOADING */}
          {stage==="loading" && (
            <div style={{textAlign:"center",padding:"50px 20px"}}>
              <div style={{position:"relative",width:80,height:80,margin:"0 auto 24px"}}>
                <svg viewBox="0 0 80 80" style={{animation:"spin 1.2s linear infinite"}}>
                  <circle cx="40" cy="40" r="32" fill="none" stroke={G[200]} strokeWidth="6"/>
                  <circle cx="40" cy="40" r="32" fill="none" stroke={G[500]} strokeWidth="6" strokeDasharray="60 140" strokeLinecap="round"/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>✦</div>
              </div>
              <div style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:8}}>Analyzing Your Resume…</div>
              <div style={{color:C.textLight,fontSize:14,marginBottom:24}}>Claude AI is reviewing every section in detail</div>
              <div style={{maxWidth:400,margin:"0 auto"}}>
                {["Scanning ATS compatibility…","Evaluating content quality…","Checking keyword density…","Identifying improvement areas…","Generating personalized tips…"].map((step,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:G[50],borderRadius:8,marginBottom:8,animation:`fadeIn 0.4s ease both`,animationDelay:`${i*0.4}s`,opacity:0}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:`linear-gradient(135deg,${G[400]},${G[600]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0}}>✓</div>
                    <span style={{fontSize:13,color:C.textMid}}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ERROR */}
          {stage==="error" && (
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              <div style={{fontSize:56,marginBottom:16}}>⚠️</div>
              <h3 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:8}}>Analysis Failed</h3>
              <p style={{color:C.textLight,fontSize:14,marginBottom:24}}>Could not connect to AI. Please check your connection and try again.</p>
              <button className="btn-primary" onClick={()=>setStage("idle")}>Try Again</button>
            </div>
          )}

          {/* RESULTS */}
          {stage==="done" && result && (
            <div className="fade-in">
              {/* Score Overview */}
              <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:24,alignItems:"center",background:G[50],border:`1.5px solid ${G[200]}`,borderRadius:16,padding:"22px 24px",marginBottom:22}}>
                <div style={{textAlign:"center"}}>
                  <div style={{position:"relative",width:110,height:110}}>
                    <svg viewBox="0 0 110 110">
                      <circle cx="55" cy="55" r="46" fill="none" stroke={G[100]} strokeWidth="10"/>
                      <circle cx="55" cy="55" r="46" fill="none" stroke={scoreColor(result.overallScore)} strokeWidth="10"
                        strokeDasharray={`${289*(result.overallScore/100)} 289`}
                        strokeLinecap="round" transform="rotate(-90 55 55)"
                        className="ai-score-ring" style={{transition:"stroke-dasharray 1.5s ease"}}/>
                    </svg>
                    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                      <div style={{fontSize:26,fontWeight:900,color:scoreColor(result.overallScore),fontFamily:"'Plus Jakarta Sans',sans-serif",lineHeight:1}}>{result.overallScore}</div>
                      <div style={{fontSize:10,fontWeight:700,color:C.textLight,letterSpacing:0.5,marginTop:2}}>/ 100</div>
                    </div>
                  </div>
                  <div style={{marginTop:8}}>
                    <div style={{fontSize:18,fontWeight:800,color:scoreColor(result.overallScore)}}>{result.grade}</div>
                    <div style={{fontSize:12,color:C.textLight}}>{scoreLabel(result.overallScore)}</div>
                  </div>
                </div>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:8}}>Overall Resume Score</div>
                  <p style={{fontSize:13.5,color:C.textMid,lineHeight:1.7,marginBottom:14}}>{result.summary}</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {[["ATS Score",result.atsScore],["Content",result.contentScore],["Format",result.formatScore],["Impact",result.impactScore]].map(([label,score])=>(
                      <div key={label} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                          <span style={{fontSize:12,fontWeight:600,color:C.textMid}}>{label}</span>
                          <span style={{fontSize:13,fontWeight:800,color:scoreColor(score)}}>{score}</span>
                        </div>
                        <div style={{height:5,borderRadius:99,background:G[100]}}>
                          <div style={{height:"100%",width:`${score}%`,borderRadius:99,background:scoreColor(score),transition:"width 1s ease"}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sub-tabs */}
              <div style={{display:"flex",gap:4,marginBottom:18,background:G[50],border:`1.5px solid ${C.border}`,borderRadius:12,padding:4}}>
                {[["overview","📊 Overview"],["issues","🚨 Issues"],["sections","📋 Sections"],["keywords","🔑 Keywords"]].map(([id,label])=>(
                  <button key={id} className={`tab-btn${activeTab===id?" active":""}`} onClick={()=>setActiveTab(id)}
                    style={{flex:1,padding:"8px 6px",borderRadius:9,border:"none",background:"transparent",fontSize:12,fontWeight:600,color:activeTab===id?"#fff":C.textMid}}>
                    {label}
                  </button>
                ))}
              </div>

              {/* TAB: OVERVIEW */}
              {activeTab==="overview" && (
                <div className="fade-in">
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.textMid,marginBottom:10,textTransform:"uppercase",letterSpacing:0.7}}>✅ Key Strengths</div>
                    {(result.strengths||[]).map((s,i)=>(
                      <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 14px",background:G[50],border:`1px solid ${G[200]}`,borderRadius:10,marginBottom:8}}>
                        <div style={{width:20,height:20,borderRadius:"50%",background:G[500],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0,marginTop:1}}>✓</div>
                        <span style={{fontSize:13.5,color:C.text,lineHeight:1.6}}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.textMid,marginBottom:10,textTransform:"uppercase",letterSpacing:0.7}}>⚡ Quick Wins</div>
                    {(result.quickWins||[]).map((w,i)=>(
                      <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 14px",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,marginBottom:8}}>
                        <div style={{width:20,height:20,borderRadius:"50%",background:"#f59e0b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0,marginTop:1}}>⚡</div>
                        <span style={{fontSize:13.5,color:"#92400e",lineHeight:1.6}}>{w}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{padding:"14px 18px",background:G[50],border:`1.5px solid ${G[300]}`,borderRadius:12,fontSize:13.5,color:C.textMid,lineHeight:1.7}}>
                    <strong style={{color:C.text}}>Industry Benchmark:</strong> {result.industryBenchmark}
                  </div>
                </div>
              )}

              {/* TAB: ISSUES */}
              {activeTab==="issues" && (
                <div className="fade-in">
                  {(result.criticalIssues||[]).length===0 && (
                    <div style={{textAlign:"center",padding:"32px",color:G[600]}}>
                      <div style={{fontSize:48,marginBottom:8}}>🎉</div>
                      <div style={{fontWeight:700,fontSize:16}}>No critical issues found!</div>
                    </div>
                  )}
                  {(result.criticalIssues||[]).map((issue,i)=>(
                    <div key={i} className="issue-card" style={{background:priorityBg[issue.priority]||G[50],border:`1.5px solid ${priorityBorder[issue.priority]||G[200]}`,borderRadius:12,padding:"16px 18px",marginBottom:12}}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
                        <div style={{fontWeight:700,fontSize:14,color:C.text}}>{issue.title}</div>
                        <span style={{background:priorityColor[issue.priority],color:"#fff",borderRadius:99,padding:"3px 10px",fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:0.5,flexShrink:0,marginLeft:8}}>{issue.priority}</span>
                      </div>
                      <p style={{fontSize:13,color:C.textMid,lineHeight:1.65,marginBottom:10}}>{issue.description}</p>
                      <div style={{display:"flex",gap:8,alignItems:"flex-start",background:"rgba(255,255,255,0.7)",borderRadius:8,padding:"10px 12px"}}>
                        <span style={{fontSize:14,flexShrink:0,marginTop:1}}>💡</span>
                        <span style={{fontSize:12.5,color:C.textMid,fontWeight:500,lineHeight:1.6}}><strong style={{color:C.text}}>Fix: </strong>{issue.fix}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: SECTIONS */}
              {activeTab==="sections" && (
                <div className="fade-in">
                  {Object.entries(result.sectionFeedback||{}).map(([sec,data])=>(
                    <div key={sec} style={{marginBottom:14,padding:"16px 18px",background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                        <div style={{fontWeight:700,fontSize:14,color:C.text,textTransform:"capitalize"}}>{sec}</div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:80,height:6,borderRadius:99,background:G[100],overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${data.score}%`,borderRadius:99,background:scoreColor(data.score),transition:"width 1s ease"}}/>
                          </div>
                          <span style={{fontSize:14,fontWeight:800,color:scoreColor(data.score),minWidth:28}}>{data.score}</span>
                        </div>
                      </div>
                      <p style={{fontSize:13,color:C.textMid,lineHeight:1.65}}>{data.feedback}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: KEYWORDS */}
              {activeTab==="keywords" && (
                <div className="fade-in">
                  <p style={{fontSize:14,color:C.textMid,marginBottom:16,lineHeight:1.7}}>Add these high-impact keywords to your resume to improve ATS matching and recruiter visibility:</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:20}}>
                    {(result.keywordSuggestions||[]).map((kw,i)=>(
                      <div key={i} style={{background:G[50],border:`1.5px solid ${G[300]}`,borderRadius:10,padding:"10px 16px",display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:G[500]}}/>
                        <span style={{fontSize:13.5,fontWeight:600,color:C.text}}>{kw}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{background:"#eff6ff",border:"1.5px solid #bfdbfe",borderRadius:12,padding:"14px 18px"}}>
                    <div style={{fontWeight:700,color:"#1e40af",fontSize:13,marginBottom:6}}>💡 How to use keywords effectively</div>
                    <ul style={{fontSize:13,color:"#1e3a8a",lineHeight:1.8,paddingLeft:18}}>
                      <li>Naturally incorporate them in your experience descriptions</li>
                      <li>Add relevant ones to your skills section</li>
                      <li>Use exact phrases from job descriptions you're targeting</li>
                      <li>Don't keyword-stuff — context matters to human reviewers</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {stage==="done" && (
          <div style={{borderTop:`1.5px solid ${C.border}`,padding:"14px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",background:G[50],flexShrink:0}}>
            <span style={{fontSize:12,color:C.textLight}}>Analysis by Claude AI · {new Date().toLocaleDateString()}</span>
            <div style={{display:"flex",gap:8}}>
              <button className="btn-ghost" onClick={()=>{setStage("idle");setResult(null);}}>Re-analyze</button>
              <button className="btn-primary" onClick={onClose} style={{padding:"8px 20px",fontSize:13}}>Apply Feedback →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PROFILE IMAGE UPLOAD
══════════════════════════════════════════════════════════════════════ */
function PhotoUpload({ photo, onChange }) {
  const inputRef = useRef();
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{marginBottom:24}}>
      <label style={{marginBottom:10}}>Profile Photo (Optional)</label>
      <div style={{display:"flex",alignItems:"center",gap:20}}>
        {/* Avatar Preview */}
        <div style={{width:88,height:88,borderRadius:"50%",background:photo?"transparent":G[100],border:`2.5px dashed ${G[300]}`,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer"}}
          onClick={()=>inputRef.current?.click()}
          onDrop={handleDrop} onDragOver={e=>e.preventDefault()}>
          {photo
            ? <img src={photo} alt="profile" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            : <div style={{textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:4}}>👤</div>
                <div style={{fontSize:9,color:C.textLight,fontWeight:600,letterSpacing:0.3}}>PHOTO</div>
              </div>
          }
          <div style={{position:"absolute",inset:0,background:"rgba(22,163,74,0)",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",transition:"background 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(22,163,74,0.15)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(22,163,74,0)"}>
          </div>
        </div>
        {/* Upload area */}
        <div style={{flex:1,border:`1.5px dashed ${G[300]}`,borderRadius:12,padding:"16px 20px",background:G[50],cursor:"pointer",transition:"all 0.2s"}}
          onClick={()=>inputRef.current?.click()}
          onDrop={handleDrop} onDragOver={e=>e.preventDefault()}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=G[500];e.currentTarget.style.background=G[100];}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=G[300];e.currentTarget.style.background=G[50];}}>
          <div style={{fontSize:13,fontWeight:600,color:C.textMid,marginBottom:4}}>📷 Click to upload or drag & drop</div>
          <div style={{fontSize:12,color:C.textLight}}>JPG, PNG, WebP · Max 5MB · Recommended: 400×400px</div>
        </div>
        {photo && (
          <button onClick={()=>onChange(null)} style={{background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:8,padding:"8px 12px",fontSize:12,fontWeight:700,flexShrink:0}}>✕ Remove</button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   RESUME TEMPLATE RENDERER  (with photo support)
══════════════════════════════════════════════════════════════════════ */
function ResumeRender({ data, tpl }) {
  const t = TEMPLATES.find(x=>x.id===tpl)||TEMPLATES[0];
  const Tag = ({label}) => (
    <span style={{display:"inline-block",background:t.accent+"18",color:t.accent,
      border:`1px solid ${t.accent}33`,borderRadius:99,padding:"2px 10px",
      fontSize:11,fontWeight:600,marginRight:5,marginBottom:4}}>{label}</span>
  );
  const SectionTitle = ({children}) => (
    <div style={{marginBottom:10,paddingBottom:5,borderBottom:`2px solid ${t.borderColor}`,display:"flex",alignItems:"center",gap:7}}>
      <div style={{width:4,height:16,borderRadius:2,background:t.accent}}/>
      <span style={{fontSize:11,fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",color:t.accent}}>{children}</span>
    </div>
  );

  const PhotoCircle = ({size=64,border="3px solid rgba(255,255,255,0.4)"}) => data.photo ? (
    <img src={data.photo} alt="profile" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border,flexShrink:0}}/>
  ) : null;

  /* MODERN GREEN */
  if (tpl==="modern") return (
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:t.bodyBg,width:"100%"}}>
      <div style={{background:t.headerBg,color:t.headerText,padding:"28px 36px 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <PhotoCircle size={70}/>
            <div>
              <div style={{fontSize:26,fontWeight:800,letterSpacing:-0.5,lineHeight:1.1}}>{data.name||"Your Name"}</div>
              <div style={{fontSize:13,fontWeight:500,opacity:0.85,marginTop:4}}>{data.title||"Professional Title"}</div>
            </div>
          </div>
          <div style={{textAlign:"right",fontSize:11,opacity:0.85,lineHeight:1.9}}>
            {data.email&&<div>✉ {data.email}</div>}
            {data.phone&&<div>☏ {data.phone}</div>}
            {data.location&&<div>📍 {data.location}</div>}
            {data.linkedin&&<div>in {data.linkedin}</div>}
            {data.github&&<div>⌥ {data.github}</div>}
          </div>
        </div>
      </div>
      <div style={{padding:"22px 36px"}}>
        {data.summary&&<div style={{marginBottom:20}}><SectionTitle>Professional Summary</SectionTitle><p style={{fontSize:12.5,color:"#374151",lineHeight:1.7}}>{data.summary}</p></div>}
        {data.experience?.some(e=>e.company||e.position)&&<div style={{marginBottom:20}}>
          <SectionTitle>Work Experience</SectionTitle>
          {data.experience.filter(e=>e.company||e.position).map((e,i)=>(
            <div key={i} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div><div style={{fontWeight:700,fontSize:13,color:C.text}}>{e.position||"Position"}</div><div style={{fontSize:12,color:t.accent,fontWeight:600}}>{e.company}</div></div>
                {e.duration&&<div style={{fontSize:11,background:t.accent+"18",color:t.accent,border:`1px solid ${t.accent}33`,borderRadius:99,padding:"2px 10px",fontWeight:600,whiteSpace:"nowrap"}}>{e.duration}</div>}
              </div>
              {e.description&&<p style={{fontSize:12,color:"#4b5563",lineHeight:1.65,marginTop:5,borderLeft:`3px solid ${t.borderColor}`,paddingLeft:10}}>{e.description}</p>}
            </div>
          ))}
        </div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          {data.skills?.some(s=>s.items)&&<div><SectionTitle>Skills</SectionTitle>{data.skills.filter(s=>s.items).map((s,i)=>(<div key={i} style={{marginBottom:10}}>{s.category&&<div style={{fontSize:11,fontWeight:700,color:C.textMid,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>{s.category}</div>}<div style={{display:"flex",flexWrap:"wrap"}}>{s.items.split(",").map(sk=>sk.trim()).filter(Boolean).map((sk,j)=>(<Tag key={j} label={sk}/>))}</div></div>))}</div>}
          {data.education?.some(e=>e.institution)&&<div><SectionTitle>Education</SectionTitle>{data.education.filter(e=>e.institution).map((e,i)=>(<div key={i} style={{marginBottom:12}}><div style={{fontWeight:700,fontSize:12.5,color:C.text}}>{e.degree||"Degree"}</div><div style={{fontSize:12,color:t.accent,fontWeight:600}}>{e.institution}</div><div style={{fontSize:11,color:C.textLight}}>{e.year}{e.grade&&` · ${e.grade}`}</div></div>))}</div>}
        </div>
        {data.projects?.some(p=>p.name)&&<div style={{marginTop:16}}><SectionTitle>Projects</SectionTitle>{data.projects.filter(p=>p.name).map((p,i)=>(<div key={i} style={{marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{fontWeight:700,fontSize:12.5,color:C.text}}>{p.name}</div>{p.link&&<a href={p.link} style={{fontSize:10.5,color:t.accent}}>↗ {p.link}</a>}</div>{p.tech&&<div style={{display:"flex",flexWrap:"wrap",margin:"4px 0"}}>{p.tech.split(",").map(t2=>t2.trim()).filter(Boolean).map((t2,j)=>(<Tag key={j} label={t2}/>))}</div>}{p.description&&<p style={{fontSize:12,color:"#4b5563",lineHeight:1.65}}>{p.description}</p>}</div>))}</div>}
        {(data.certifications?.some(c=>c.name)||data.languages?.some(l=>l.language)||data.awards?.some(a=>a.title))&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginTop:16}}>
            {data.certifications?.some(c=>c.name)&&<div><SectionTitle>Certifications</SectionTitle>{data.certifications.filter(c=>c.name).map((c,i)=>(<div key={i} style={{marginBottom:8}}><div style={{fontWeight:600,fontSize:12,color:C.text}}>{c.name}</div><div style={{fontSize:11,color:C.textLight}}>{c.issuer}{c.year&&` · ${c.year}`}</div></div>))}</div>}
            {data.languages?.some(l=>l.language)&&<div><SectionTitle>Languages</SectionTitle>{data.languages.filter(l=>l.language).map((l,i)=>(<div key={i} style={{fontSize:12,marginBottom:5}}><span style={{fontWeight:600,color:C.text}}>{l.language}</span><span style={{color:C.textLight,fontSize:11}}> · {l.proficiency}</span></div>))}</div>}
            {data.awards?.some(a=>a.title)&&<div><SectionTitle>Awards</SectionTitle>{data.awards.filter(a=>a.title).map((a,i)=>(<div key={i} style={{marginBottom:8}}><div style={{fontWeight:600,fontSize:12,color:C.text}}>{a.title}</div><div style={{fontSize:11,color:C.textLight}}>{a.org}{a.year&&` · ${a.year}`}</div></div>))}</div>}
          </div>
        )}
        {data.interests?.trim()&&<div style={{marginTop:16}}><SectionTitle>Interests</SectionTitle><p style={{fontSize:12,color:"#4b5563"}}>{data.interests}</p></div>}
      </div>
    </div>
  );

  /* CLEAN WHITE */
  if (tpl==="clean") return (
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:"#fff",width:"100%"}}>
      <div style={{background:"#1e3a5f",color:"#fff",padding:"32px 40px"}}>
        <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:12}}>
          <PhotoCircle size={72} border="3px solid rgba(147,197,253,0.5)"/>
          <div>
            <div style={{fontSize:28,fontWeight:800,letterSpacing:-0.5}}>{data.name||"Your Name"}</div>
            <div style={{fontSize:14,color:"#93c5fd",marginTop:4,fontWeight:500}}>{data.title}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap",fontSize:11.5,color:"#bfdbfe"}}>
          {data.email&&<span>✉ {data.email}</span>}
          {data.phone&&<span>☏ {data.phone}</span>}
          {data.location&&<span>📍 {data.location}</span>}
          {data.website&&<span>🌐 {data.website}</span>}
          {data.linkedin&&<span>in {data.linkedin}</span>}
          {data.github&&<span>⌥ {data.github}</span>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",minHeight:0}}>
        <div style={{padding:"24px 28px",borderRight:"1.5px solid #e2e8f0"}}>
          {data.summary&&<div style={{marginBottom:20}}><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1e3a5f",textTransform:"uppercase",borderBottom:"2px solid #1e3a5f",paddingBottom:4,marginBottom:10}}>Summary</div><p style={{fontSize:12.5,color:"#374151",lineHeight:1.7}}>{data.summary}</p></div>}
          {data.experience?.some(e=>e.company||e.position)&&<div style={{marginBottom:20}}><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1e3a5f",textTransform:"uppercase",borderBottom:"2px solid #1e3a5f",paddingBottom:4,marginBottom:10}}>Experience</div>{data.experience.filter(e=>e.company||e.position).map((e,i)=>(<div key={i} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontWeight:700,fontSize:13}}>{e.position}</div><div style={{fontSize:11,color:"#6b7280"}}>{e.duration}</div></div><div style={{fontSize:12,color:"#2563eb",fontWeight:600,marginBottom:4}}>{e.company}</div>{e.description&&<p style={{fontSize:12,color:"#4b5563",lineHeight:1.65}}>{e.description}</p>}</div>))}</div>}
          {data.projects?.some(p=>p.name)&&<div><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1e3a5f",textTransform:"uppercase",borderBottom:"2px solid #1e3a5f",paddingBottom:4,marginBottom:10}}>Projects</div>{data.projects.filter(p=>p.name).map((p,i)=>(<div key={i} style={{marginBottom:12}}><div style={{fontWeight:700,fontSize:12.5}}>{p.name}</div>{p.tech&&<div style={{fontSize:11,color:"#2563eb"}}>{p.tech}</div>}{p.description&&<p style={{fontSize:12,color:"#4b5563",lineHeight:1.65,marginTop:3}}>{p.description}</p>}</div>))}</div>}
        </div>
        <div style={{padding:"24px 22px",background:"#f8faff"}}>
          {data.skills?.some(s=>s.items)&&<div style={{marginBottom:18}}><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1e3a5f",textTransform:"uppercase",borderBottom:"2px solid #1e3a5f",paddingBottom:4,marginBottom:10}}>Skills</div>{data.skills.filter(s=>s.items).map((s,i)=>(<div key={i} style={{marginBottom:9}}>{s.category&&<div style={{fontSize:10.5,fontWeight:700,color:"#374151",marginBottom:4}}>{s.category}</div>}<div style={{display:"flex",flexWrap:"wrap",gap:3}}>{s.items.split(",").map(sk=>sk.trim()).filter(Boolean).map((sk,j)=>(<span key={j} style={{background:"#dbeafe",color:"#1e40af",borderRadius:4,padding:"2px 7px",fontSize:10.5,fontWeight:500}}>{sk}</span>))}</div></div>))}</div>}
          {data.education?.some(e=>e.institution)&&<div style={{marginBottom:18}}><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1e3a5f",textTransform:"uppercase",borderBottom:"2px solid #1e3a5f",paddingBottom:4,marginBottom:10}}>Education</div>{data.education.filter(e=>e.institution).map((e,i)=>(<div key={i} style={{marginBottom:10}}><div style={{fontWeight:700,fontSize:12}}>{e.degree}</div><div style={{fontSize:11.5,color:"#2563eb"}}>{e.institution}</div><div style={{fontSize:11,color:"#6b7280"}}>{e.year}{e.grade&&` · ${e.grade}`}</div></div>))}</div>}
          {data.certifications?.some(c=>c.name)&&<div style={{marginBottom:18}}><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1e3a5f",textTransform:"uppercase",borderBottom:"2px solid #1e3a5f",paddingBottom:4,marginBottom:10}}>Certifications</div>{data.certifications.filter(c=>c.name).map((c,i)=>(<div key={i} style={{marginBottom:8}}><div style={{fontWeight:600,fontSize:11.5}}>{c.name}</div><div style={{fontSize:11,color:"#6b7280"}}>{c.issuer}{c.year&&` · ${c.year}`}</div></div>))}</div>}
          {data.languages?.some(l=>l.language)&&<div><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1e3a5f",textTransform:"uppercase",borderBottom:"2px solid #1e3a5f",paddingBottom:4,marginBottom:10}}>Languages</div>{data.languages.filter(l=>l.language).map((l,i)=>(<div key={i} style={{fontSize:12,marginBottom:5}}><span style={{fontWeight:600}}>{l.language}</span><span style={{color:"#6b7280",fontSize:11}}> — {l.proficiency}</span></div>))}</div>}
        </div>
      </div>
    </div>
  );

  /* MINIMAL LEAF */
  if (tpl==="minimal") return (
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:"#fff",width:"100%"}}>
      <div style={{padding:"36px 44px 20px",borderBottom:`3px solid ${G[400]}`}}>
        <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:12}}>
          <PhotoCircle size={68} border={`3px solid ${G[300]}`}/>
          <div>
            <div style={{fontSize:30,fontWeight:800,color:G[900],letterSpacing:-1}}>{data.name||"Your Name"}</div>
            <div style={{fontSize:14,fontWeight:500,color:G[600],marginTop:4}}>{data.title}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:18,flexWrap:"wrap",fontSize:11.5,color:C.textLight}}>
          {data.email&&<span>{data.email}</span>}
          {data.phone&&<span>{data.phone}</span>}
          {data.location&&<span>{data.location}</span>}
          {data.linkedin&&<span>{data.linkedin}</span>}
          {data.github&&<span>{data.github}</span>}
        </div>
      </div>
      <div style={{padding:"20px 44px"}}>
        {data.summary&&<div style={{marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${G[100]}`}}><p style={{fontSize:12.5,color:"#374151",lineHeight:1.75,fontStyle:"italic"}}>{data.summary}</p></div>}
        {data.experience?.some(e=>e.company||e.position)&&<div style={{marginBottom:18}}><div style={{fontSize:10.5,fontWeight:800,color:G[700],letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Experience</div>{data.experience.filter(e=>e.company||e.position).map((e,i)=>(<div key={i} style={{display:"grid",gridTemplateColumns:"1fr 3fr",gap:16,marginBottom:14}}><div><div style={{fontSize:11,color:G[600],fontWeight:600}}>{e.duration}</div><div style={{fontSize:12,fontWeight:700,color:C.textMid}}>{e.company}</div></div><div><div style={{fontWeight:700,fontSize:13,color:C.text}}>{e.position}</div>{e.description&&<p style={{fontSize:12,color:"#4b5563",lineHeight:1.65,marginTop:4}}>{e.description}</p>}</div></div>))}</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:18}}>
          {data.skills?.some(s=>s.items)&&<div><div style={{fontSize:10.5,fontWeight:800,color:G[700],letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Skills</div>{data.skills.filter(s=>s.items).map((s,i)=>(<div key={i} style={{marginBottom:8}}>{s.category&&<div style={{fontSize:10.5,fontWeight:700,color:C.textMid,marginBottom:4}}>{s.category}</div>}<div style={{display:"flex",flexWrap:"wrap",gap:3}}>{s.items.split(",").map(sk=>sk.trim()).filter(Boolean).map((sk,j)=>(<span key={j} style={{background:G[50],border:`1px solid ${G[200]}`,color:G[700],borderRadius:5,padding:"2px 9px",fontSize:11,fontWeight:500}}>{sk}</span>))}</div></div>))}</div>}
          {data.education?.some(e=>e.institution)&&<div><div style={{fontSize:10.5,fontWeight:800,color:G[700],letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Education</div>{data.education.filter(e=>e.institution).map((e,i)=>(<div key={i} style={{marginBottom:10}}><div style={{fontWeight:700,fontSize:12.5}}>{e.degree}</div><div style={{fontSize:12,color:G[600]}}>{e.institution}</div><div style={{fontSize:11,color:C.textLight}}>{e.year}{e.grade&&` · ${e.grade}`}</div></div>))}</div>}
        </div>
        {data.projects?.some(p=>p.name)&&<div style={{marginBottom:18}}><div style={{fontSize:10.5,fontWeight:800,color:G[700],letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Projects</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{data.projects.filter(p=>p.name).map((p,i)=>(<div key={i} style={{background:G[50],border:`1px solid ${G[200]}`,borderRadius:8,padding:"12px 14px"}}><div style={{fontWeight:700,fontSize:12.5}}>{p.name}</div>{p.tech&&<div style={{fontSize:11,color:G[600],marginBottom:4}}>{p.tech}</div>}{p.description&&<p style={{fontSize:11.5,color:"#4b5563",lineHeight:1.6}}>{p.description}</p>}</div>))}</div></div>}
      </div>
    </div>
  );

  /* EXECUTIVE */
  if (tpl==="executive") return (
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:"#fafafa",width:"100%"}}>
      <div style={{background:"#1a1a2e",color:"#fff",padding:"34px 42px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:18,alignItems:"center"}}>
            {data.photo
              ? <img src={data.photo} alt="profile" style={{width:64,height:64,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(167,139,250,0.5)"}}/>
              : <div style={{width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#a78bfa,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"#fff",flexShrink:0}}>{(data.name||"?").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}</div>
            }
            <div>
              <div style={{fontSize:28,fontWeight:800,letterSpacing:-0.5}}>{data.name||"Your Name"}</div>
              <div style={{fontSize:13.5,color:"#a78bfa",marginTop:5,fontWeight:500,letterSpacing:1}}>{data.title}</div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:20,marginTop:14,flexWrap:"wrap",fontSize:11.5,color:"#c4b5fd"}}>
          {data.email&&<span>✉ {data.email}</span>}
          {data.phone&&<span>☏ {data.phone}</span>}
          {data.location&&<span>📍 {data.location}</span>}
          {data.linkedin&&<span>in {data.linkedin}</span>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr"}}>
        <div style={{padding:"24px 28px",borderRight:"2px solid #e5e7eb"}}>
          {data.summary&&<div style={{marginBottom:20}}><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1a1a2e",textTransform:"uppercase",borderBottom:"2px solid #1a1a2e",paddingBottom:4,marginBottom:10}}>Summary</div><p style={{fontSize:12.5,color:"#374151",lineHeight:1.75}}>{data.summary}</p></div>}
          {data.experience?.some(e=>e.company||e.position)&&<div style={{marginBottom:20}}><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1a1a2e",textTransform:"uppercase",borderBottom:"2px solid #1a1a2e",paddingBottom:4,marginBottom:10}}>Experience</div>{data.experience.filter(e=>e.company||e.position).map((e,i)=>(<div key={i} style={{marginBottom:14,paddingBottom:12,borderBottom:"1px solid #f3f4f6"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{fontWeight:700,fontSize:13}}>{e.position}</div><div style={{fontSize:11,color:"#6b7280",background:"#f3f4f6",borderRadius:5,padding:"2px 8px"}}>{e.duration}</div></div><div style={{fontSize:12,color:"#7c3aed",fontWeight:600,marginBottom:5}}>{e.company}</div>{e.description&&<p style={{fontSize:12,color:"#4b5563",lineHeight:1.65}}>{e.description}</p>}</div>))}</div>}
          {data.projects?.some(p=>p.name)&&<div><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1a1a2e",textTransform:"uppercase",borderBottom:"2px solid #1a1a2e",paddingBottom:4,marginBottom:10}}>Projects</div>{data.projects.filter(p=>p.name).map((p,i)=>(<div key={i} style={{marginBottom:10}}><div style={{fontWeight:700,fontSize:12.5}}>{p.name}</div>{p.tech&&<div style={{fontSize:11,color:"#7c3aed"}}>{p.tech}</div>}{p.description&&<p style={{fontSize:12,color:"#4b5563",lineHeight:1.65}}>{p.description}</p>}</div>))}</div>}
        </div>
        <div style={{padding:"24px 22px",background:"#f5f3ff"}}>
          {data.skills?.some(s=>s.items)&&<div style={{marginBottom:18}}><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1a1a2e",textTransform:"uppercase",borderBottom:"2px solid #1a1a2e",paddingBottom:4,marginBottom:10}}>Skills</div>{data.skills.filter(s=>s.items).map((s,i)=>(<div key={i} style={{marginBottom:10}}>{s.category&&<div style={{fontSize:10.5,fontWeight:700,color:"#374151",marginBottom:5}}>{s.category}</div>}{s.items.split(",").map(sk=>sk.trim()).filter(Boolean).map((sk,j)=>(<div key={j} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}><div style={{width:6,height:6,borderRadius:"50%",background:"#7c3aed",flexShrink:0}}/><span style={{fontSize:12,color:"#374151"}}>{sk}</span></div>))}</div>))}</div>}
          {data.education?.some(e=>e.institution)&&<div style={{marginBottom:18}}><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1a1a2e",textTransform:"uppercase",borderBottom:"2px solid #1a1a2e",paddingBottom:4,marginBottom:10}}>Education</div>{data.education.filter(e=>e.institution).map((e,i)=>(<div key={i} style={{marginBottom:10}}><div style={{fontWeight:700,fontSize:12}}>{e.degree}</div><div style={{fontSize:11.5,color:"#7c3aed"}}>{e.institution}</div><div style={{fontSize:11,color:"#6b7280"}}>{e.year}{e.grade&&` · ${e.grade}`}</div></div>))}</div>}
          {data.certifications?.some(c=>c.name)&&<div style={{marginBottom:18}}><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1a1a2e",textTransform:"uppercase",borderBottom:"2px solid #1a1a2e",paddingBottom:4,marginBottom:10}}>Certifications</div>{data.certifications.filter(c=>c.name).map((c,i)=>(<div key={i} style={{marginBottom:8}}><div style={{fontWeight:600,fontSize:11.5}}>{c.name}</div><div style={{fontSize:11,color:"#6b7280"}}>{c.issuer}{c.year&&` · ${c.year}`}</div></div>))}</div>}
          {data.languages?.some(l=>l.language)&&<div><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:"#1a1a2e",textTransform:"uppercase",borderBottom:"2px solid #1a1a2e",paddingBottom:4,marginBottom:10}}>Languages</div>{data.languages.filter(l=>l.language).map((l,i)=>(<div key={i} style={{fontSize:12,marginBottom:6}}><span style={{fontWeight:600}}>{l.language}</span><span style={{color:"#6b7280",fontSize:11}}> — {l.proficiency}</span></div>))}</div>}
        </div>
      </div>
    </div>
  );

  /* CREATIVE SPLIT */
  if (tpl==="creative") return (
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:"#fff",width:"100%",display:"grid",gridTemplateColumns:"148px 1fr"}}>
      <div style={{background:G[800],color:"#fff",padding:"28px 18px"}}>
        <div style={{marginBottom:16,textAlign:"center"}}>
          {data.photo
            ? <img src={data.photo} alt="profile" style={{width:70,height:70,borderRadius:"50%",objectFit:"cover",border:`3px solid ${G[400]}`,margin:"0 auto 8px",display:"block"}}/>
            : <div style={{width:60,height:60,borderRadius:"50%",background:G[400],display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:G[900],margin:"0 auto 8px"}}>{(data.name||"?").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}</div>
          }
        </div>
        <div style={{fontSize:9.5,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:G[300],marginBottom:8,borderBottom:`1px solid ${G[600]}`,paddingBottom:6}}>Contact</div>
        {data.email&&<div style={{fontSize:10,marginBottom:5,wordBreak:"break-all",color:G[100]}}>✉ {data.email}</div>}
        {data.phone&&<div style={{fontSize:10,marginBottom:5,color:G[100]}}>☏ {data.phone}</div>}
        {data.location&&<div style={{fontSize:10,marginBottom:5,color:G[100]}}>📍 {data.location}</div>}
        {data.linkedin&&<div style={{fontSize:10,marginBottom:5,wordBreak:"break-all",color:G[100]}}>in {data.linkedin}</div>}
        {data.github&&<div style={{fontSize:10,marginBottom:12,wordBreak:"break-all",color:G[100]}}>⌥ {data.github}</div>}
        {data.skills?.some(s=>s.items)&&<><div style={{fontSize:9.5,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:G[300],marginTop:16,marginBottom:8,borderBottom:`1px solid ${G[600]}`,paddingBottom:6}}>Skills</div>{data.skills.filter(s=>s.items).map((s,i)=>(<div key={i} style={{marginBottom:8}}>{s.category&&<div style={{fontSize:9,color:G[300],fontWeight:700,marginBottom:4}}>{s.category}</div>}{s.items.split(",").map(sk=>sk.trim()).filter(Boolean).map((sk,j)=>(<div key={j} style={{fontSize:10,color:"#fff",marginBottom:3,paddingLeft:6,borderLeft:`2px solid ${G[400]}`}}>{sk}</div>))}</div>))}</>}
        {data.languages?.some(l=>l.language)&&<><div style={{fontSize:9.5,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:G[300],marginTop:16,marginBottom:8,borderBottom:`1px solid ${G[600]}`,paddingBottom:6}}>Languages</div>{data.languages.filter(l=>l.language).map((l,i)=>(<div key={i} style={{fontSize:10,color:"#fff",marginBottom:4}}>{l.language}<br/><span style={{fontSize:9,color:G[300]}}>{l.proficiency}</span></div>))}</>}
      </div>
      <div style={{padding:"26px 28px"}}>
        <div style={{borderBottom:`3px solid ${G[400]}`,paddingBottom:14,marginBottom:18}}>
          <div style={{fontSize:26,fontWeight:800,color:G[900],letterSpacing:-0.5}}>{data.name||"Your Name"}</div>
          <div style={{fontSize:13.5,color:G[600],fontWeight:600,marginTop:4}}>{data.title}</div>
        </div>
        {data.summary&&<div style={{marginBottom:16}}><div style={{fontSize:10,fontWeight:800,color:G[700],letterSpacing:1.5,textTransform:"uppercase",marginBottom:7}}>About Me</div><p style={{fontSize:12,color:"#374151",lineHeight:1.75}}>{data.summary}</p></div>}
        {data.experience?.some(e=>e.company||e.position)&&<div style={{marginBottom:16}}><div style={{fontSize:10,fontWeight:800,color:G[700],letterSpacing:1.5,textTransform:"uppercase",marginBottom:9,display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:2,background:G[200]}}/> Experience <div style={{flex:1,height:2,background:G[200]}}/></div>{data.experience.filter(e=>e.company||e.position).map((e,i)=>(<div key={i} style={{marginBottom:12,paddingLeft:10,borderLeft:`3px solid ${G[300]}`}}><div style={{fontWeight:700,fontSize:12.5}}>{e.position}</div><div style={{fontSize:11.5,color:G[600],fontWeight:600}}>{e.company} {e.duration&&`· ${e.duration}`}</div>{e.description&&<p style={{fontSize:11.5,color:"#4b5563",lineHeight:1.65,marginTop:3}}>{e.description}</p>}</div>))}</div>}
        {data.education?.some(e=>e.institution)&&<div style={{marginBottom:16}}><div style={{fontSize:10,fontWeight:800,color:G[700],letterSpacing:1.5,textTransform:"uppercase",marginBottom:9,display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:2,background:G[200]}}/> Education <div style={{flex:1,height:2,background:G[200]}}/></div>{data.education.filter(e=>e.institution).map((e,i)=>(<div key={i} style={{marginBottom:10}}><div style={{fontWeight:700,fontSize:12.5}}>{e.degree}</div><div style={{fontSize:11.5,color:G[600]}}>{e.institution}</div><div style={{fontSize:11,color:C.textLight}}>{e.year}{e.grade&&` · ${e.grade}`}</div></div>))}</div>}
        {data.projects?.some(p=>p.name)&&<div><div style={{fontSize:10,fontWeight:800,color:G[700],letterSpacing:1.5,textTransform:"uppercase",marginBottom:9,display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:2,background:G[200]}}/> Projects <div style={{flex:1,height:2,background:G[200]}}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{data.projects.filter(p=>p.name).map((p,i)=>(<div key={i} style={{background:G[50],border:`1px solid ${G[200]}`,borderRadius:8,padding:"10px 12px"}}><div style={{fontWeight:700,fontSize:12}}>{p.name}</div>{p.tech&&<div style={{fontSize:10.5,color:G[600],marginBottom:3}}>{p.tech}</div>}{p.description&&<p style={{fontSize:11,color:"#4b5563",lineHeight:1.6}}>{p.description}</p>}</div>))}</div></div>}
      </div>
    </div>
  );

  /* GRADIENT PRO */
  return (
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:"#fff",width:"100%"}}>
      <div style={{background:`linear-gradient(135deg,${G[700]},${G[500]})`,color:"#fff",padding:"32px 42px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
          <div style={{display:"flex",gap:18,alignItems:"center"}}>
            <PhotoCircle size={72} border="3px solid rgba(255,255,255,0.4)"/>
            <div>
              <div style={{fontSize:28,fontWeight:800,letterSpacing:-0.5}}>{data.name||"Your Name"}</div>
              <div style={{fontSize:13.5,fontWeight:500,color:"#d1fae5",marginTop:5}}>{data.title}</div>
              <div style={{display:"flex",gap:16,marginTop:10,flexWrap:"wrap",fontSize:11.5,color:"#a7f3d0"}}>
                {data.email&&<span>✉ {data.email}</span>}
                {data.phone&&<span>☏ {data.phone}</span>}
                {data.location&&<span>📍 {data.location}</span>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,opacity:0.85,fontSize:11.5,flexDirection:"column",alignItems:"flex-end"}}>
            {data.website&&<span>🌐 {data.website}</span>}
            {data.linkedin&&<span>in {data.linkedin}</span>}
            {data.github&&<span>⌥ {data.github}</span>}
          </div>
        </div>
      </div>
      <div style={{padding:"22px 42px"}}>
        {data.summary&&<div style={{marginBottom:18,background:G[50],borderLeft:`4px solid ${G[500]}`,padding:"10px 14px",borderRadius:"0 8px 8px 0"}}><p style={{fontSize:12.5,color:"#374151",lineHeight:1.75,fontStyle:"italic"}}>{data.summary}</p></div>}
        {data.experience?.some(e=>e.company||e.position)&&<div style={{marginBottom:18}}><div style={{fontSize:11,fontWeight:800,color:G[700],letterSpacing:1.5,textTransform:"uppercase",display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{height:2,width:20,background:G[400]}}/> Work Experience</div>{data.experience.filter(e=>e.company||e.position).map((e,i)=>(<div key={i} style={{marginBottom:14,display:"flex",gap:14}}><div style={{width:2,background:`linear-gradient(${G[400]},${G[200]})`,borderRadius:2,flexShrink:0}}/><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontWeight:700,fontSize:13}}>{e.position}</div><span style={{fontSize:11,background:G[100],color:G[700],border:`1px solid ${G[300]}`,borderRadius:99,padding:"2px 9px",fontWeight:600}}>{e.duration}</span></div><div style={{fontSize:12,color:G[600],fontWeight:600,marginBottom:4}}>{e.company}</div>{e.description&&<p style={{fontSize:12,color:"#4b5563",lineHeight:1.65}}>{e.description}</p>}</div></div>))}</div>}
        <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:24}}>
          <div>
            {data.projects?.some(p=>p.name)&&<div style={{marginBottom:16}}><div style={{fontSize:11,fontWeight:800,color:G[700],letterSpacing:1.5,textTransform:"uppercase",display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{height:2,width:20,background:G[400]}}/> Projects</div>{data.projects.filter(p=>p.name).map((p,i)=>(<div key={i} style={{marginBottom:10,background:G[50],border:`1px solid ${G[200]}`,borderRadius:8,padding:"10px 14px"}}><div style={{fontWeight:700,fontSize:12.5}}>{p.name}{p.link&&<a href={p.link} style={{fontSize:10.5,color:G[600],marginLeft:8}}>↗</a>}</div>{p.tech&&<div style={{fontSize:11,color:G[600],margin:"3px 0"}}>{p.tech}</div>}{p.description&&<p style={{fontSize:11.5,color:"#4b5563",lineHeight:1.6}}>{p.description}</p>}</div>))}</div>}
            {data.certifications?.some(c=>c.name)&&<div><div style={{fontSize:11,fontWeight:800,color:G[700],letterSpacing:1.5,textTransform:"uppercase",display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{height:2,width:20,background:G[400]}}/> Certifications</div>{data.certifications.filter(c=>c.name).map((c,i)=>(<div key={i} style={{marginBottom:6}}><span style={{fontWeight:600,fontSize:12}}>{c.name}</span><span style={{fontSize:11,color:C.textLight}}> — {c.issuer}{c.year&&` (${c.year})`}</span></div>))}</div>}
          </div>
          <div>
            {data.skills?.some(s=>s.items)&&<div style={{marginBottom:16}}><div style={{fontSize:11,fontWeight:800,color:G[700],letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Skills</div>{data.skills.filter(s=>s.items).map((s,i)=>(<div key={i} style={{marginBottom:10}}>{s.category&&<div style={{fontSize:10.5,fontWeight:700,color:C.textMid,marginBottom:5}}>{s.category}</div>}<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{s.items.split(",").map(sk=>sk.trim()).filter(Boolean).map((sk,j)=>(<span key={j} style={{background:G[100],color:G[800],border:`1px solid ${G[300]}`,borderRadius:99,padding:"2px 9px",fontSize:11,fontWeight:500}}>{sk}</span>))}</div></div>))}</div>}
            {data.education?.some(e=>e.institution)&&<div style={{marginBottom:16}}><div style={{fontSize:11,fontWeight:800,color:G[700],letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Education</div>{data.education.filter(e=>e.institution).map((e,i)=>(<div key={i} style={{marginBottom:10}}><div style={{fontWeight:700,fontSize:12}}>{e.degree}</div><div style={{fontSize:11.5,color:G[600]}}>{e.institution}</div><div style={{fontSize:11,color:C.textLight}}>{e.year}{e.grade&&` · ${e.grade}`}</div></div>))}</div>}
            {data.languages?.some(l=>l.language)&&<div><div style={{fontSize:11,fontWeight:800,color:G[700],letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Languages</div>{data.languages.filter(l=>l.language).map((l,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><span style={{fontSize:12,fontWeight:600}}>{l.language}</span><span style={{fontSize:11,color:G[600],background:G[50],border:`1px solid ${G[200]}`,borderRadius:99,padding:"1px 8px"}}>{l.proficiency}</span></div>))}</div>}
          </div>
        </div>
        {data.awards?.some(a=>a.title)&&<div style={{marginTop:14}}><div style={{fontSize:11,fontWeight:800,color:G[700],letterSpacing:1.5,textTransform:"uppercase",display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{height:2,width:20,background:G[400]}}/> Awards</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{data.awards.filter(a=>a.title).map((a,i)=>(<div key={i} style={{background:G[50],border:`1px solid ${G[200]}`,borderRadius:8,padding:"8px 14px"}}><div style={{fontWeight:600,fontSize:12}}>{a.title}</div><div style={{fontSize:11,color:C.textLight}}>{a.org}{a.year&&` · ${a.year}`}</div></div>))}</div></div>}
        {data.interests?.trim()&&<div style={{marginTop:14}}><div style={{fontSize:11,fontWeight:800,color:G[700],letterSpacing:1.5,textTransform:"uppercase",display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{height:2,width:20,background:G[400]}}/> Interests</div><p style={{fontSize:12,color:"#4b5563"}}>{data.interests}</p></div>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   REPEAT SECTION EDITOR
══════════════════════════════════════════════════════════════════════ */
function RepeatSection({ label, items, onChange, fields }) {
  const add = () => { const b={id:uid()}; fields.forEach(f=>{b[f.key]="";}); onChange([...items,b]); };
  const remove = (id) => onChange(items.filter(i=>i.id!==id));
  const update = (id,key,val) => onChange(items.map(i=>i.id===id?{...i,[key]:val}:i));
  return (
    <div>
      {items.map((item,idx)=>(
        <div key={item.id} className="section-card" style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"18px 18px 14px",marginBottom:12,animationDelay:`${idx*0.05}s`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{fontSize:12,fontWeight:700,color:G[700],background:G[100],border:`1px solid ${G[300]}`,borderRadius:99,padding:"3px 12px"}}>{label} {idx+1}</span>
            {items.length>1&&<button onClick={()=>remove(item.id)} style={{background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:7,padding:"4px 10px",fontSize:12,fontWeight:700}}>✕ Remove</button>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:fields.length>2?"1fr 1fr":"1fr",gap:"10px 14px"}}>
            {fields.map(f=>(
              <div key={f.key} style={{gridColumn:f.full?"1/-1":"auto"}}>
                <label>{f.label}</label>
                {f.type==="textarea"
                  ? <textarea rows={3} value={item[f.key]||""} onChange={e=>update(item.id,f.key,e.target.value)} placeholder={f.placeholder||""}/>
                  : f.type==="select"
                  ? <select value={item[f.key]||""} onChange={e=>update(item.id,f.key,e.target.value)} style={{height:42}}>{(f.options||[]).map(o=><option key={o}>{o}</option>)}</select>
                  : <input type="text" value={item[f.key]||""} onChange={e=>update(item.id,f.key,e.target.value)} placeholder={f.placeholder||""}/>
                }
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={add} style={{width:"100%",padding:"10px",borderRadius:10,border:`1.5px dashed ${G[300]}`,background:G[50],color:G[700],fontWeight:700,fontSize:13,cursor:"pointer",transition:"all 0.2s"}}
        onMouseEnter={e=>{e.currentTarget.style.background=G[100];e.currentTarget.style.borderColor=G[500];}}
        onMouseLeave={e=>{e.currentTarget.style.background=G[50];e.currentTarget.style.borderColor=G[300];}}>
        + Add {label}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════════════ */
export default function ResumeBuilderV2() {
  const [data, setData] = useState({
    ...EMPTY,
    experience:[{id:uid(),company:"",position:"",duration:"",description:""}],
    education:[{id:uid(),institution:"",degree:"",year:"",grade:""}],
    skills:[{id:uid(),category:"Technical Skills",items:""}],
    projects:[{id:uid(),name:"",tech:"",description:"",link:""}],
    certifications:[{id:uid(),name:"",issuer:"",year:""}],
    languages:[{id:uid(),language:"",proficiency:"Fluent"}],
    awards:[{id:uid(),title:"",org:"",year:""}],
  });
  const [activeSection, setActiveSection] = useState("basics");
  const [activeTpl, setActiveTpl] = useState("modern");
  const [view, setView] = useState("split");
  const [showTplPanel, setShowTplPanel] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const pdfRef = useRef(null);

  const set = useCallback((k,v) => setData(p=>({...p,[k]:v})), []);
  const setArr = useCallback((k,v) => setData(p=>({...p,[k]:v})), []);
  const completion = calcCompletion(data);
  const atsScore = Math.min(98, Math.round(30 + completion * 0.68));
  const atsColor = atsScore>=80?G[600]:atsScore>=60?"#d97706":"#dc2626";

  const handleDownload = useCallback(() => {
    setDownloading(true);
    const el = pdfRef.current;
    if (!el) { setDownloading(false); return; }
    const win = window.open("","_blank");
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"><title>${data.name||"Resume"}</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
      <style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Plus Jakarta Sans',sans-serif;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;}@page{size:A4;margin:0;}</style>
    </head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.onload = () => { setTimeout(()=>{ win.print(); setDownloading(false); },600); };
  }, [data.name]);

  const renderSection = () => {
    if (activeSection==="basics") return (
      <div className="fade-in">
        <PhotoUpload photo={data.photo} onChange={v=>set("photo",v)}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 14px"}}>
          {[{k:"name",l:"Full Name",p:"John Doe"},{k:"title",l:"Professional Title",p:"Senior Software Engineer"},{k:"email",l:"Email Address",p:"john@example.com"},{k:"phone",l:"Phone Number",p:"+1 (555) 000-0000"},{k:"location",l:"Location",p:"New York, NY"},{k:"website",l:"Website / Portfolio",p:"https://johndoe.dev"},{k:"linkedin",l:"LinkedIn",p:"linkedin.com/in/johndoe"},{k:"github",l:"GitHub",p:"github.com/johndoe"}].map(f=>(
            <div key={f.k}><label>{f.l}</label><input value={data[f.k]} onChange={e=>set(f.k,e.target.value)} placeholder={f.p}/></div>
          ))}
        </div>
      </div>
    );
    if (activeSection==="summary") return (
      <div className="fade-in">
        <label>Professional Summary</label>
        <textarea rows={6} value={data.summary} onChange={e=>set("summary",e.target.value)} placeholder="Write a compelling 3-4 sentence summary highlighting your experience, key skills, and what makes you unique as a candidate..."/>
        <div style={{fontSize:12,color:C.textLight,marginTop:6,display:"flex",justifyContent:"space-between"}}>
          <span>💡 Use action-oriented language and include measurable achievements.</span>
          <span style={{color:data.summary.length>40?G[600]:C.textLight}}>{data.summary.length} chars</span>
        </div>
      </div>
    );
    if (activeSection==="experience") return <div className="fade-in"><RepeatSection label="Experience" items={data.experience} onChange={v=>setArr("experience",v)} fields={[{key:"position",label:"Job Title",placeholder:"Senior Developer"},{key:"company",label:"Company Name",placeholder:"Google Inc."},{key:"duration",label:"Duration",placeholder:"Jan 2022 – Present"},{key:"description",label:"Responsibilities & Achievements",placeholder:"Describe key responsibilities and measurable achievements...",type:"textarea",full:true}]}/></div>;
    if (activeSection==="education") return <div className="fade-in"><RepeatSection label="Education" items={data.education} onChange={v=>setArr("education",v)} fields={[{key:"degree",label:"Degree / Course",placeholder:"B.Tech Computer Science"},{key:"institution",label:"Institution Name",placeholder:"MIT"},{key:"year",label:"Year / Duration",placeholder:"2016 – 2020"},{key:"grade",label:"GPA / Grade",placeholder:"3.9/4.0 or First Class"}]}/></div>;
    if (activeSection==="skills") return (
      <div className="fade-in">
        <RepeatSection label="Skill Group" items={data.skills} onChange={v=>setArr("skills",v)} fields={[{key:"category",label:"Category Name",placeholder:"e.g. Frontend, Backend, Tools"},{key:"items",label:"Skills (comma separated)",placeholder:"React, TypeScript, Node.js, GraphQL",full:true}]}/>
        <div style={{marginTop:10,padding:"10px 14px",background:G[50],border:`1px solid ${G[200]}`,borderRadius:8,fontSize:12,color:C.textMid}}>💡 Group skills by category for better ATS parsing.</div>
      </div>
    );
    if (activeSection==="projects") return <div className="fade-in"><RepeatSection label="Project" items={data.projects} onChange={v=>setArr("projects",v)} fields={[{key:"name",label:"Project Name",placeholder:"E-Commerce Platform"},{key:"tech",label:"Technologies Used",placeholder:"React, Node.js, MongoDB"},{key:"link",label:"GitHub / Live Link",placeholder:"github.com/you/project"},{key:"description",label:"Project Description",placeholder:"Describe the project, your role, and impact...",type:"textarea",full:true}]}/></div>;
    if (activeSection==="certs") return <div className="fade-in"><RepeatSection label="Certification" items={data.certifications} onChange={v=>setArr("certifications",v)} fields={[{key:"name",label:"Certification Name",placeholder:"AWS Solutions Architect"},{key:"issuer",label:"Issuing Organization",placeholder:"Amazon Web Services"},{key:"year",label:"Year Issued",placeholder:"2023"}]}/></div>;
    if (activeSection==="languages") return <div className="fade-in"><RepeatSection label="Language" items={data.languages} onChange={v=>setArr("languages",v)} fields={[{key:"language",label:"Language",placeholder:"English"},{key:"proficiency",label:"Proficiency",type:"select",options:["Native","Fluent","Advanced","Intermediate","Beginner"]}]}/></div>;
    if (activeSection==="awards") return <div className="fade-in"><RepeatSection label="Award" items={data.awards} onChange={v=>setArr("awards",v)} fields={[{key:"title",label:"Award Title",placeholder:"Employee of the Year"},{key:"org",label:"Organization",placeholder:"Company / Institution"},{key:"year",label:"Year",placeholder:"2023"}]}/></div>;
    if (activeSection==="interests") return (
      <div className="fade-in">
        <label>Interests & Hobbies</label>
        <textarea rows={4} value={data.interests} onChange={e=>set("interests",e.target.value)} placeholder="Photography, Open Source, Rock Climbing, Chess, Travel..."/>
      </div>
    );
  };

  const currentNav = NAV_ITEMS.find(n=>n.id===activeSection);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {showAI && <AIAnalyzerModal data={data} onClose={()=>setShowAI(false)}/>}
      <div style={{minHeight:"100vh",background:C.pageBg,display:"flex",flexDirection:"column"}}>

        {/* ── TOP BAR ── */}
        <div style={{background:C.white,borderBottom:`1.5px solid ${C.border}`,padding:"0 20px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:`0 2px 12px ${C.shadow}`}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${G[500]},${G[700]})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#fff",fontSize:18}}>R</div>
            <div>
              <div style={{fontWeight:800,fontSize:15,color:C.text,lineHeight:1.1}}>ResumeAI Builder</div>
              <div style={{fontSize:11,color:C.textLight}}>Professional Resume Studio</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            {/* View toggle */}
            <div style={{display:"flex",gap:2,background:G[50],border:`1.5px solid ${C.border}`,borderRadius:10,padding:3}}>
              {[["split","⊞ Split"],["editor","✏ Edit"],["preview","👁 Preview"]].map(([v,l])=>(
                <button key={v} className={`tab-btn${view===v?" active":""}`} onClick={()=>setView(v)}
                  style={{padding:"6px 14px",borderRadius:7,border:"none",fontSize:12,fontWeight:600,color:view===v?"#fff":C.textMid,background:"transparent"}}>{l}</button>
              ))}
            </div>
            <button className="btn-outline" onClick={()=>setShowTplPanel(p=>!p)} style={{fontSize:13,padding:"8px 14px"}}>🎨 Templates</button>
            {/* AI ANALYZE BUTTON */}
            <button onClick={()=>setShowAI(true)} style={{
              background:`linear-gradient(135deg,${G[600]},${G[800]})`,color:"#fff",
              border:"none",borderRadius:10,fontWeight:700,fontSize:13,
              padding:"9px 18px",cursor:"pointer",
              boxShadow:`0 4px 16px ${C.shadowMd}`,
              display:"flex",alignItems:"center",gap:7,
              transition:"all 0.2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 8px 24px ${C.shadowMd}`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 4px 16px ${C.shadowMd}`;}}
            >
              <span style={{fontSize:15}}>✦</span> AI Analyze
            </button>
            <button className="btn-primary" onClick={handleDownload} disabled={downloading} style={{padding:"9px 18px",fontSize:13,display:"flex",alignItems:"center",gap:7}}>
              {downloading?<><span style={{animation:"spin 0.8s linear infinite",display:"inline-block"}}>⟳</span> Preparing…</>:<>⬇ Download PDF</>}
            </button>
          </div>
        </div>

        {/* ── TEMPLATE PANEL ── */}
        {showTplPanel&&(
          <div style={{background:C.white,borderBottom:`1.5px solid ${C.border}`,padding:"16px 24px",boxShadow:`0 4px 16px ${C.shadow}`}}>
            <div style={{maxWidth:1400,margin:"0 auto"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{fontWeight:800,fontSize:14,color:C.text}}>Choose Resume Template</div>
                <button className="btn-ghost" onClick={()=>setShowTplPanel(false)}>✕ Close</button>
              </div>
              <div style={{display:"flex",gap:14,overflowX:"auto",paddingBottom:4}}>
                {TEMPLATES.map(t=>(
                  <div key={t.id} className={`tpl-card${activeTpl===t.id?" selected":""}`} onClick={()=>{setActiveTpl(t.id);setShowTplPanel(false);}}
                    style={{flexShrink:0,width:150,background:activeTpl===t.id?G[50]:C.white,border:`1.5px solid ${activeTpl===t.id?G[500]:C.border}`,borderRadius:12,overflow:"hidden"}}>
                    <div style={{height:80,background:t.headerBg.startsWith?.("linear")||t.headerBg===G[50]||t.headerBg==="#fff"?t.headerBg:t.headerBg,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:26,color:(t.headerBg==="#fff"||t.headerBg===G[50])?t.accent:"#fff"}}>{t.icon}</div>
                        <div style={{fontSize:9,fontWeight:700,color:(t.headerBg==="#fff"||t.headerBg===G[50])?t.accent:"rgba(255,255,255,0.8)",marginTop:2}}>{t.name}</div>
                      </div>
                    </div>
                    <div style={{padding:"8px 10px"}}>
                      <div style={{fontWeight:700,fontSize:12,color:C.text}}>{t.name}</div>
                      <div style={{fontSize:10,color:C.textLight,marginTop:2}}>{t.tag}</div>
                      {activeTpl===t.id&&<div style={{marginTop:5,fontSize:10,fontWeight:700,color:G[600]}}>✓ Selected</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MAIN 3-COLUMN LAYOUT ── */}
        <div style={{display:"flex",flex:1,overflow:"hidden"}}>

          {/* SIDEBAR NAV */}
          {view!=="preview"&&(
            <div style={{width:214,background:C.sidebarBg,borderRight:`1.5px solid ${C.border}`,display:"flex",flexDirection:"column",overflowY:"auto",flexShrink:0}}>
              {/* Progress */}
              <div style={{padding:"16px 14px 12px",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                  <span style={{fontSize:11,fontWeight:700,color:C.textMid,textTransform:"uppercase",letterSpacing:0.5}}>Completion</span>
                  <span style={{fontSize:12,fontWeight:800,color:G[600]}}>{completion}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{width:`${completion}%`}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
                  <span style={{fontSize:11,fontWeight:700,color:C.textMid,textTransform:"uppercase",letterSpacing:0.5}}>ATS Score</span>
                  <span style={{fontSize:13,fontWeight:800,color:atsColor}}>{atsScore}%</span>
                </div>
                <div style={{height:5,borderRadius:99,background:"#f0fdf4",marginTop:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${atsScore}%`,borderRadius:99,background:atsScore>=80?`linear-gradient(90deg,${G[400]},${G[600]})`:"#fbbf24",transition:"width 0.5s ease"}}/>
                </div>
                <div style={{fontSize:10,color:atsColor,fontWeight:600,marginTop:4}}>
                  {atsScore>=85?"✓ Excellent — ATS Ready":atsScore>=65?"⚠ Good — Add more detail":"✕ Needs improvement"}
                </div>
                {/* AI Analyze CTA */}
                <button onClick={()=>setShowAI(true)} style={{
                  width:"100%",marginTop:12,padding:"9px",borderRadius:9,
                  background:`linear-gradient(135deg,${G[50]},${G[100]})`,
                  border:`1.5px solid ${G[300]}`,color:G[700],
                  fontWeight:700,fontSize:12,cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                  transition:"all 0.2s",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${G[100]},${G[200]})`;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${G[50]},${G[100]})`;}}
                >✦ AI Score & Feedback</button>
              </div>
              {/* Nav items */}
              <div style={{padding:"8px 8px",flex:1}}>
                {NAV_ITEMS.map(n=>(
                  <button key={n.id} onClick={()=>setActiveSection(n.id)}
                    style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,border:"none",background:activeSection===n.id?G[100]:"transparent",color:activeSection===n.id?G[700]:C.textMid,fontWeight:activeSection===n.id?700:500,fontSize:13,cursor:"pointer",transition:"all 0.15s",marginBottom:2}}
                    onMouseEnter={e=>{if(activeSection!==n.id)e.currentTarget.style.background=G[50];}}
                    onMouseLeave={e=>{if(activeSection!==n.id)e.currentTarget.style.background="transparent";}}>
                    <span style={{fontSize:15}}>{n.icon}</span>
                    <span>{n.label}</span>
                    {activeSection===n.id&&<span style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:G[500]}}/>}
                  </button>
                ))}
              </div>
              <div style={{margin:"0 10px 12px",padding:"10px 12px",background:G[50],border:`1px solid ${G[200]}`,borderRadius:10}}>
                <div style={{fontSize:11,fontWeight:700,color:G[700],marginBottom:4}}>💡 Pro Tip</div>
                <div style={{fontSize:11,color:C.textMid,lineHeight:1.5}}>Use action verbs like "Led", "Built", "Increased" to boost your ATS score.</div>
              </div>
            </div>
          )}

          {/* EDITOR */}
          {view!=="preview"&&(
            <div style={{flex:view==="split"?"0 0 420px":1,overflowY:"auto",padding:"22px 24px",background:C.pageBg,borderRight:view==="split"?`1.5px solid ${C.border}`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
                <span style={{fontSize:20}}>{currentNav?.icon}</span>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:C.text}}>{currentNav?.label}</div>
                  <div style={{fontSize:11,color:C.textLight}}>Fill in your information below</div>
                </div>
              </div>
              {renderSection()}
            </div>
          )}

          {/* PREVIEW */}
          {(view==="split"||view==="preview")&&(
            <div style={{flex:1,overflowY:"auto",background:"#e8f5e9",padding:"24px",display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:"100%",maxWidth:860,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:G[500],animation:"pulse 2s ease infinite"}}/>
                  <span style={{fontSize:12,fontWeight:700,color:G[700]}}>Live Preview</span>
                  <span style={{fontSize:11,color:C.textLight}}>· Updates as you type</span>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{background:G[100],color:G[800],border:`1px solid ${G[300]}`,borderRadius:99,padding:"3px 12px",fontSize:11,fontWeight:700}}>{TEMPLATES.find(t=>t.id===activeTpl)?.name}</span>
                  <button onClick={()=>setShowAI(true)} style={{background:`linear-gradient(135deg,${G[600]},${G[800]})`,color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><span>✦</span> AI Analyze</button>
                  <button className="btn-primary" onClick={handleDownload} style={{padding:"6px 16px",fontSize:12}}>⬇ PDF</button>
                </div>
              </div>
              <div ref={pdfRef} id="pdf-target" style={{width:"100%",maxWidth:860,background:C.white,borderRadius:14,overflow:"hidden",boxShadow:`0 8px 40px ${C.shadowMd},0 2px 8px ${C.shadow}`,marginBottom:24}}>
                <ResumeRender data={data} tpl={activeTpl}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}