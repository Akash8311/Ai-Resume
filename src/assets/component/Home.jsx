import { useState, useEffect, useRef } from "react";
// If you use react-router-dom, uncomment the next line:
// import { useNavigate } from "react-router-dom";

/* ── palette ── */
const G = {
  50:  "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0",
  300: "#86efac", 400: "#4ade80", 500: "#22c55e",
  600: "#16a34a", 700: "#15803d", 800: "#166534", 900: "#14532d",
};

const FEATURES = [
  { icon: "⚡", title: "AI-Powered Writing",    desc: "Craft compelling bullet points in seconds. Our AI learns your tone and tailors every line to your dream role.", color: G[500] },
  { icon: "🎯", title: "ATS Optimization",      desc: "Beat applicant tracking systems. Get a real-time score against Fortune 500 ATS engines before you hit send.", color: "#3b82f6" },
  { icon: "🎨", title: "50+ Premium Templates", desc: "Designer-crafted layouts. Every template is recruiter-approved and pixel-perfect across every device.", color: "#f59e0b" },
  { icon: "📤", title: "One-Click Export",       desc: "Download as PDF or DOCX, or share a live link. Perfect formatting — guaranteed, everywhere.", color: "#ec4899" },
  { icon: "💡", title: "Real-Time Suggestions", desc: "Power words, action verbs, and measurable achievements surfaced as you type — live coaching in the editor.", color: "#8b5cf6" },
  { icon: "🔗", title: "LinkedIn Import",        desc: "Pull your entire career history from LinkedIn in one click. Start from what you already have.", color: "#06b6d4" },
];

const STATS = [
  { value: "2.4M+", label: "Resumes Built",  num: 2.4,  suffix: "M+", float: true  },
  { value: "94%",   label: "Interview Rate", num: 94,   suffix: "%",  float: false },
  { value: "3",     label: "Minutes Avg.",   num: 3,    suffix: "",   float: false },
  { value: "180+",  label: "Countries",      num: 180,  suffix: "+",  float: false },
];

const STEPS = [
  { num: "01", title: "Pick a Template",  desc: "50+ ATS-ready designs for every industry",     emoji: "🖼️" },
  { num: "02", title: "Add Your Details", desc: "AI fills smart suggestions as you type",         emoji: "✍️" },
  { num: "03", title: "Export & Apply",   desc: "Download PDF instantly and land the interview",  emoji: "🚀" },
];

const WORDS = ["Stunning", "AI-Crafted", "Job-Winning", "Standout", "Professional"];

const COMPANIES = ["Google","Amazon","Microsoft","Meta","Stripe","Airbnb","Spotify","Netflix","Notion","Figma"];

const TESTIMONIALS = [
  { name:"Akash M.",  role:"Hired at Stripe", text:"Got 3 interview calls in the first week. The AI suggestions completely transformed my resume.", emoji:"👩‍💼" },
  { name:"James L.",  role:"Hired at Google", text:"The ATS score feature is a game changer. Went from zero replies to landing my dream job.",        emoji:"🧑‍💻" },
  { name:"Priya M.",  role:"Hired at Airbnb", text:"Built my entire resume in 8 minutes. Downloaded, applied, got the interview. Unbelievable.",       emoji:"👩‍🎨" },
];

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */
function useInView(ref, threshold = 0.12) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

/* ─────────────────────────────────────────
   ANIMATED WORD
───────────────────────────────────────── */
function AnimatedWord() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("in"); // "in" | "out"

  useEffect(() => {
    const id = setInterval(() => {
      setPhase("out");
      setTimeout(() => {
        setIdx(i => (i + 1) % WORDS.length);
        setPhase("in");
      }, 420);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{
      display: "inline-block",
      background: `linear-gradient(120deg,${G[600]},${G[400]})`,
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      transition: "opacity .4s cubic-bezier(.22,1,.36,1), transform .4s cubic-bezier(.22,1,.36,1)",
      opacity: phase === "in" ? 1 : 0,
      transform: phase === "in" ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.96)",
    }}>
      {WORDS[idx]}
    </span>
  );
}

/* ─────────────────────────────────────────
   COUNT UP
───────────────────────────────────────── */
function CountUp({ num, suffix, float: isFloat }) {
  const [val, setVal] = useState("0");
  const ref = useRef();
  const visible = useInView(ref);

  useEffect(() => {
    if (!visible) return;
    const dur = 1600;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      const cur = isFloat ? (ease * num).toFixed(1) : Math.round(ease * num);
      setVal(cur + suffix);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible]);

  return <span ref={ref}>{val}</span>;
}

/* ─────────────────────────────────────────
   PARTICLES CANVAS
───────────────────────────────────────── */
function Particles() {
  const ref = useRef();
  const rafRef = useRef();
  const ptsRef = useRef([]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");

    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    ptsRef.current = Array.from({ length: 28 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 3 + 1.5, o: Math.random() * .35 + .1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ptsRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width)  p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,197,94,${p.o})`;
        ctx.fill();
      });
      ptsRef.current.forEach((a, i) => {
        ptsRef.current.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(34,197,94,${.12 * (1 - d / 120)})`;
            ctx.lineWidth = .8; ctx.stroke();
          }
        });
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />
  );
}

/* ─────────────────────────────────────────
   FEATURE CARD
───────────────────────────────────────── */
function FeatureCard({ f, i }) {
  const ref = useRef();
  const visible = useInView(ref);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#fff" : "#fafafa",
        border: `1.5px solid ${hovered ? f.color + "55" : "#e5e7eb"}`,
        borderRadius: 20, padding: "32px 28px", cursor: "default",
        boxShadow: hovered
          ? `0 16px 48px ${f.color}22, 0 2px 8px rgba(0,0,0,0.06)`
          : "0 1px 4px rgba(0,0,0,0.04)",
        opacity:    visible ? 1 : 0,
        transform:  visible
          ? (hovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)")
          : "translateY(40px) scale(0.97)",
        transition: `opacity .55s cubic-bezier(.22,1,.36,1) ${i * 90}ms,
                     transform .45s cubic-bezier(.22,1,.36,1),
                     background .3s, border-color .3s, box-shadow .3s`,
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: `${f.color}15`, border: `1.5px solid ${f.color}35`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, marginBottom: 20,
        transform: hovered ? "rotate(-8deg) scale(1.12)" : "rotate(0) scale(1)",
        transition: "transform .35s cubic-bezier(.34,1.56,.64,1)",
      }}>
        {f.icon}
      </div>
      <h3 style={{ margin:"0 0 10px", fontSize:17, fontWeight:700, color:"#111827", letterSpacing:"-0.02em" }}>{f.title}</h3>
      <p  style={{ margin:0, fontSize:14, color:"#6b7280", lineHeight:1.68 }}>{f.desc}</p>
      <div style={{
        marginTop:20, display:"flex", alignItems:"center", gap:6,
        fontSize:13, fontWeight:600, color: f.color,
        opacity:   hovered ? 1 : 0,
        transform: hovered ? "translateX(0)" : "translateX(-8px)",
        transition: "all .3s ease",
      }}>
        Learn more <span>→</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TYPEWRITER CHIP
───────────────────────────────────────── */
function TypewriterChip() {
  const lines = [
    "Improved leadership bullet point",
    "Added quantified achievement",
    "ATS score jumped to 97%",
    "Tailored for Product Manager role",
  ];
  const [li, setLi]       = useState(0);
  const [chars, setChars] = useState(0);
  const [del, setDel]     = useState(false);

  useEffect(() => {
    const cur = lines[li];
    if (!del && chars < cur.length) {
      const t = setTimeout(() => setChars(c => c + 1), 38);
      return () => clearTimeout(t);
    }
    if (!del && chars === cur.length) {
      const t = setTimeout(() => setDel(true), 1400);
      return () => clearTimeout(t);
    }
    if (del && chars > 0) {
      const t = setTimeout(() => setChars(c => c - 1), 22);
      return () => clearTimeout(t);
    }
    if (del && chars === 0) { setDel(false); setLi(l => (l + 1) % lines.length); }
  }, [chars, del, li]);

  return (
    <div style={{
      background: G[50], border: `1px solid ${G[200]}`, borderRadius: 12,
      padding: "10px 14px", fontSize: 13, color: G[700],
      fontFamily: "'Fira Code', monospace",
      display: "flex", alignItems: "center", gap: 8, marginTop: 16,
    }}>
      <span style={{ width:8, height:8, borderRadius:"50%", background:G[400], flexShrink:0,
        animation:"pulse 1.4s ease-in-out infinite" }} />
      <span>✨ AI: {lines[li].slice(0, chars)}</span>
      <span style={{ width:2, height:14, background:G[500], borderRadius:1,
        animation:"blink .7s step-end infinite" }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   TESTIMONIAL CARD
───────────────────────────────────────── */
function TestiCard({ t, i }) {
  const ref = useRef();
  const visible = useInView(ref);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", border: `1.5px solid ${G[100]}`, borderRadius: 20,
        padding: "28px 24px", boxShadow: hovered
          ? "0 12px 32px rgba(0,0,0,0.10)"
          : "0 2px 12px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        opacity:   visible ? 1 : 0,
        transition: `opacity .6s ease ${i * 120}ms, transform .3s ease, box-shadow .3s ease`,
      }}
    >
      <div style={{ display:"flex", gap:4, marginBottom:16 }}>
        {[...Array(5)].map((_, j) => (
          <span key={j} style={{ color:G[400], fontSize:16 }}>★</span>
        ))}
      </div>
      <p style={{ fontSize:14.5, color:"#374151", lineHeight:1.68, margin:"0 0 20px" }}>"{t.text}"</p>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:40, height:40, borderRadius:"50%", background:G[50],
          border:`1.5px solid ${G[200]}`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:20 }}>
          {t.emoji}
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{t.name}</div>
          <div style={{ fontSize:12, color:G[600], fontWeight:600 }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────── */
export default function Home() {
  // If using react-router-dom: const navigate = useNavigate();
  const navigate = (path) => { window.location.href = path; }; // fallback if no router

  const [scrolled,  setScrolled]  = useState(false);
  const [atsAnim,   setAtsAnim]   = useState(false);

  const stepsRef = useRef(); const stepsV = useInView(stepsRef);
  const ctaRef   = useRef(); const ctaV   = useInView(ctaRef);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // trigger ATS bar after mount
  useEffect(() => { const t = setTimeout(() => setAtsAnim(true), 600); return () => clearTimeout(t); }, []);

  /* ── inline <style> for keyframes ── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,700;1,600&family=Fira+Code:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:#f9fafb}
    ::-webkit-scrollbar-thumb{background:#d1fae5;border-radius:3px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
    @keyframes floatR{0%,100%{transform:translateY(0) rotate(3deg)}50%{transform:translateY(-18px) rotate(-2deg)}}
    @keyframes spinSlow{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes scaleIn{from{transform:scaleX(0)}to{transform:scaleX(1)}}
    @keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}
    @keyframes slideInLeft{from{opacity:0;transform:translateX(-32px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideInRight{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}
    @keyframes glowPulse{0%,100%{box-shadow:0 24px 80px rgba(34,197,94,.4)}50%{box-shadow:0 24px 80px rgba(34,197,94,.7)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    .nav-link{color:#4b5563;text-decoration:none;font-size:14px;font-weight:500;transition:color .2s}
    .nav-link:hover{color:${G[600]}}
    .btn-green{background:${G[500]};color:#fff;border:none;border-radius:14px;padding:14px 30px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:-.01em;transition:all .3s cubic-bezier(.22,1,.36,1);position:relative;overflow:hidden}
    .btn-green:hover{background:${G[600]};transform:translateY(-3px);box-shadow:0 14px 40px rgba(34,197,94,.5)}
    .btn-outline{background:#fff;color:${G[600]};border:2px solid ${G[500]};border-radius:14px;padding:14px 28px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .3s ease}
    .btn-outline:hover{background:${G[50]};transform:translateY(-2px);box-shadow:0 8px 24px rgba(34,197,94,.3)}
    .skeleton{border-radius:4px;background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
    .step-circle-anim{animation:wiggle 3s ease-in-out infinite}
    .footer-link-item{color:rgba(255,255,255,.7);margin-bottom:12px;cursor:pointer;transition:color .3s;font-size:14px}
    .footer-link-item:hover{color:#4ade80}
    .social-icon-btn{width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s;font-size:18px}
    .social-icon-btn:hover{transform:translateY(-4px);background:linear-gradient(135deg,#22c55e,#16a34a)}
    .footer-legal-item{color:rgba(255,255,255,.6);font-size:13px;cursor:pointer;transition:color .3s}
    .footer-legal-item:hover{color:#4ade80}
    .cta-white-btn{background:#fff;color:${G[700]};border:none;border-radius:14px;padding:18px 46px;font-size:17px;font-weight:800;cursor:pointer;font-family:inherit;transition:all .3s cubic-bezier(.22,1,.36,1);letter-spacing:-.01em}
    .cta-white-btn:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(0,0,0,.18)}
  `;

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','Segoe UI',sans-serif", background:"#fff", color:"#111827", overflowX:"hidden" }}>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        padding:"0 5%", height:68,
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${G[100]}` : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.06)" : "none",
        transition: "all .4s ease",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        {/* logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10,
            background:`linear-gradient(135deg,${G[400]},${G[600]})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, boxShadow:`0 4px 12px ${G[400]}60` }}>✦</div>
          <span style={{ fontWeight:800, fontSize:19, letterSpacing:"-0.04em", color:"#111827" }}>
            Resume<span style={{ color:G[500] }}>AI</span>
          </span>
        </div>

        {/* links */}
        <div style={{ display:"flex", gap:32 }}>
          {["Features","Templates","Pricing","About"].map(l => (
            <a key={l} href="#" className="nav-link">{l}</a>
          ))}
        </div>

        {/* actions */}
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn-outline" style={{ padding:"9px 20px", fontSize:14 }}
            onClick={() => navigate("/login")}>Log in</button>
          <button className="btn-green" style={{ padding:"9px 20px", fontSize:14 }}
            onClick={() => navigate("/login")}>Get Started Free →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        padding:"110px 5% 80px", position:"relative", overflow:"hidden",
        background:`radial-gradient(ellipse 80% 60% at 50% -10%,${G[50]} 0%,#fff 70%)`,
      }}>
        <Particles />

        {/* rings */}
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%",
          border:`1px solid ${G[200]}`, top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          pointerEvents:"none", animation:"spinSlow 40s linear infinite" }} />
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%",
          border:`1px dashed ${G[300]}`, top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          pointerEvents:"none", animation:"spinSlow 25s linear reverse infinite" }} />

        {/* left float card */}
        <div style={{ position:"absolute", left:"4%", top:"42%", transform:"translateY(-50%)",
          background:"#fff", border:`1.5px solid ${G[200]}`, borderRadius:16, padding:"14px 18px",
          boxShadow:`0 8px 32px ${G[200]}`, animation:"float 5s ease-in-out infinite",
          fontSize:13, fontWeight:600, color:"#374151", width:180, opacity:.9 }}>
          <div style={{ fontSize:11, color:G[500], fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:".08em" }}>ATS Score</div>
          <div style={{ fontSize:28, fontWeight:800, color:G[600], letterSpacing:"-0.04em" }}>98 / 100</div>
          <div style={{ marginTop:8, height:6, background:G[100], borderRadius:3, overflow:"hidden" }}>
            <div style={{
              height:"100%", background:`linear-gradient(90deg,${G[400]},${G[600]})`, borderRadius:3,
              width: atsAnim ? "98%" : "0%", transition:"width 1.2s ease .5s",
            }} />
          </div>
        </div>

        {/* right float card */}
        <div style={{ position:"absolute", right:"4%", top:"38%", transform:"translateY(-50%)",
          background:"#fff", border:"1.5px solid #dbeafe", borderRadius:16, padding:"14px 18px",
          boxShadow:"0 8px 32px rgba(59,130,246,0.12)", animation:"floatR 6s ease-in-out 1s infinite",
          fontSize:13, width:190, opacity:.9 }}>
          <div style={{ fontSize:11, color:"#3b82f6", fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:".08em" }}>New Interview</div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"#dbeafe",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🏢</div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#111827" }}>Google</div>
              <div style={{ fontSize:12, color:"#6b7280" }}>Product Designer</div>
            </div>
          </div>
          <div style={{ marginTop:10, background:G[50], borderRadius:8, padding:"6px 10px",
            fontSize:12, color:G[600], fontWeight:600, display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:G[400],
              animation:"pulse 1.2s ease-in-out infinite", display:"inline-block" }} />
            Interview in 2 days
          </div>
        </div>

        {/* center */}
        <div style={{ maxWidth:740, textAlign:"center", position:"relative", zIndex:2 }}>
          {/* badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:G[50], border:`1.5px solid ${G[200]}`, borderRadius:999,
            padding:"7px 18px", marginBottom:32, fontSize:13, fontWeight:600, color:G[700],
            animation:"fadeIn .6s ease both" }}>
            <span style={{ fontSize:15 }}>🤖</span> Powered by GPT-4o · Smarter than ever
          </div>

          <h1 style={{ fontSize:"clamp(44px,6.5vw,78px)", fontWeight:800, lineHeight:1.06,
            letterSpacing:"-0.045em", margin:"0 0 26px", fontFamily:"'Lora','Georgia',serif",
            animation:"fadeUp .8s cubic-bezier(.22,1,.36,1) .1s both", color:"#111827" }}>
            Build a <AnimatedWord /><br />Resume in Minutes
          </h1>

          <p style={{ fontSize:18, color:"#6b7280", lineHeight:1.68, maxWidth:540,
            margin:"0 auto 40px", animation:"fadeUp .8s cubic-bezier(.22,1,.36,1) .22s both" }}>
            AI that understands your career. ATS-beating templates. Your dream job — one click away ❤️
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap",
            animation:"fadeUp .8s cubic-bezier(.22,1,.36,1) .34s both" }}>
            <button className="btn-green" style={{ padding:"17px 38px", fontSize:16 }}>
              Build My Resume — Free 🎉
            </button>
            <button className="btn-outline" style={{ padding:"17px 28px", fontSize:16, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ width:32, height:32, borderRadius:"50%", background:G[50],
                border:`1.5px solid ${G[300]}`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:13 }}>▶</span>
              See a Demo
            </button>
          </div>

          <p style={{ marginTop:18, fontSize:13, color:"#9ca3af", animation:"fadeIn 1s ease .5s both" }}>
            No credit card · Free forever plan · 3-minute setup
          </p>

          {/* social proof */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12,
            marginTop:28, animation:"fadeUp .8s ease .55s both" }}>
            <div style={{ display:"flex" }}>
              {["🧑‍💼","👩‍💻","🧑‍🎨","👩‍🔬","🧑‍💻"].map((e, i) => (
                <div key={i} style={{ width:34, height:34, borderRadius:"50%",
                  background:`hsl(${140 + i * 20},60%,92%)`,
                  border:"2px solid #fff", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:17, marginLeft: i === 0 ? 0 : -10 }}>
                  {e}
                </div>
              ))}
            </div>
            <div style={{ fontSize:13, color:"#6b7280" }}>
              <span style={{ fontWeight:700, color:"#111827" }}>2.4M+</span> professionals already hired
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ overflow:"hidden", borderTop:`1px solid ${G[100]}`, borderBottom:`1px solid ${G[100]}`,
        padding:"16px 0", background:G[50] }}>
        <div style={{ display:"flex", width:"max-content", animation:"marquee 20s linear infinite", gap:56 }}>
          {[...COMPANIES, ...COMPANIES].map((c, i) => (
            <span key={i} style={{ fontSize:14, fontWeight:700, color:G[600],
              letterSpacing:".06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{c}</span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section style={{ padding:"80px 5%", maxWidth:1000, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0 }}>
          {STATS.map((s, i) => {
            const ref = useRef(); const v = useInView(ref);
            return (
              <div key={i} ref={ref} style={{ textAlign:"center", padding:"44px 24px",
                borderLeft: i > 0 ? `1px solid ${G[100]}` : "none",
                opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(28px)",
                transition:`all .6s cubic-bezier(.22,1,.36,1) ${i * 110}ms` }}>
                <div style={{ fontSize:50, fontWeight:800, color:G[600], letterSpacing:"-0.05em",
                  fontFamily:"'Lora',serif", lineHeight:1, marginBottom:8 }}>
                  <CountUp num={s.num} suffix={s.suffix} float={s.float} />
                </div>
                <div style={{ fontSize:14, color:"#9ca3af", fontWeight:500 }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:"60px 5% 100px", background:G[50] }}>
        <div style={{ maxWidth:1180, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ fontSize:12, color:G[600], fontWeight:700, letterSpacing:".14em",
              textTransform:"uppercase", marginBottom:12 }}>Why ResumeAI</div>
            <h2 style={{ fontSize:"clamp(30px,4vw,50px)", fontWeight:800, letterSpacing:"-0.04em",
              margin:"0 0 14px", fontFamily:"'Lora',serif", color:"#111827" }}>
              Everything you need<br />to get hired faster
            </h2>
            <p style={{ color:"#6b7280", fontSize:17, maxWidth:460, margin:"0 auto" }}>
              From blank page to interview-ready in under 3 minutes.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} f={f} i={i} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={stepsRef} style={{ padding:"100px 5%", maxWidth:1000, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:72 }}>
          <div style={{ fontSize:12, color:G[600], fontWeight:700, letterSpacing:".14em",
            textTransform:"uppercase", marginBottom:12 }}>How It Works</div>
          <h2 style={{ fontSize:"clamp(28px,4vw,46px)", fontWeight:800, letterSpacing:"-0.04em",
            margin:0, fontFamily:"'Lora',serif", color:"#111827" }}>
            Three steps to your dream job
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, position:"relative" }}>
          {/* connector line */}
          <div style={{ position:"absolute", top:52, left:"20%", height:2, zIndex:0,
            background:`linear-gradient(90deg,${G[300]},${G[500]})`,
            width: stepsV ? "60%" : "0%", transition:"width 1.2s ease .4s" }} />

          {STEPS.map((s, i) => (
            <div key={i} style={{ textAlign:"center", padding:"0 32px", position:"relative", zIndex:1,
              opacity: stepsV ? 1 : 0,
              transform: stepsV ? "translateY(0)" : "translateY(36px)",
              transition:`all .7s cubic-bezier(.22,1,.36,1) ${i * 160}ms` }}>
              <div style={{ width:104, height:104, borderRadius:"50%", margin:"0 auto 28px",
                background:`linear-gradient(135deg,${G[100]},${G[200]})`,
                border:`2px solid ${G[300]}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:36, position:"relative", boxShadow:`0 8px 28px ${G[200]}`,
                animation: stepsV ? `wiggle 3s ease-in-out ${i * .6 + 1}s infinite` : "none",
              }}>
                {s.emoji}
                <div style={{ position:"absolute", top:-8, right:-4, width:28, height:28,
                  borderRadius:"50%", background:G[500], color:"#fff", fontSize:11, fontWeight:800,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 4px 12px ${G[500]}60` }}>{s.num}</div>
              </div>
              <h3 style={{ fontSize:19, fontWeight:800, margin:"0 0 10px", letterSpacing:"-0.025em", color:"#111827" }}>{s.title}</h3>
              <p style={{ color:"#6b7280", fontSize:14.5, lineHeight:1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SPLIT SECTION ── */}
      <section style={{ padding:"80px 5% 100px", background:G[50] }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"center" }}>
          {/* left */}
          <div style={{ animation:"slideInLeft .8s cubic-bezier(.22,1,.36,1) both" }}>
            <div style={{ fontSize:12, color:G[600], fontWeight:700, letterSpacing:".14em",
              textTransform:"uppercase", marginBottom:14 }}>Live Editor</div>
            <h2 style={{ fontSize:"clamp(26px,3.2vw,40px)", fontWeight:800, letterSpacing:"-0.04em",
              margin:"0 0 18px", fontFamily:"'Lora',serif", lineHeight:1.18, color:"#111827" }}>
              Watch your resume come alive as you type
            </h2>
            <p style={{ color:"#6b7280", fontSize:15.5, lineHeight:1.72, margin:"0 0 28px" }}>
              Real-time preview. AI suggestions inline. An ATS score that updates live. Every change — instant.
            </p>
            {["Smart autofill from your LinkedIn profile","Instant ATS compatibility score live","One-click tone: formal, friendly, bold"].map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, fontSize:15,
                color:"#374151", marginBottom:14 }}>
                <div style={{ width:24, height:24, borderRadius:"50%", flexShrink:0,
                  background:`linear-gradient(135deg,${G[400]},${G[600]})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, color:"#fff", marginTop:1, boxShadow:`0 4px 12px ${G[400]}50` }}>✓</div>
                {item}
              </div>
            ))}
            <button className="btn-green" style={{ marginTop:12, padding:"14px 30px", fontSize:15 }}>
              Try the Editor Free →
            </button>
          </div>

          {/* right — resume card */}
          <div style={{ animation:"slideInRight .8s cubic-bezier(.22,1,.36,1) .15s both" }}>
            <div style={{ background:"#fff", border:`1.5px solid ${G[200]}`, borderRadius:24, padding:28,
              boxShadow:`0 20px 60px rgba(0,0,0,0.08),0 4px 16px ${G[100]}`,
              position:"relative", animation:"float 7s ease-in-out infinite" }}>

              {/* ATS badge */}
              <div style={{ position:"absolute", top:-14, right:20,
                background:`linear-gradient(135deg,${G[500]},${G[600]})`,
                borderRadius:999, padding:"6px 16px", fontSize:12, fontWeight:700, color:"#fff",
                boxShadow:`0 6px 18px ${G[500]}50` }}>✅ ATS Score: 98%</div>

              {/* skeleton name */}
              <div style={{ marginBottom:18 }}>
                <div className="skeleton" style={{ height:13, width:"52%", marginBottom:7 }} />
                <div className="skeleton" style={{ height:8,  width:"36%" }} />
              </div>
              <div style={{ height:1, background:G[100], marginBottom:16 }} />

              {/* experience */}
              <div style={{ fontSize:10, color:G[600], fontWeight:700, letterSpacing:".12em",
                textTransform:"uppercase", marginBottom:12 }}>Experience</div>
              {[[80,65,90],[75,60]].map((widths, i) => (
                <div key={i} style={{ marginBottom:14 }}>
                  <div className="skeleton" style={{ height:8, width:"58%", marginBottom:5 }} />
                  <div className="skeleton" style={{ height:7, width:"40%", marginBottom:8 }} />
                  {widths.map((w, j) => (
                    <div key={j} className="skeleton" style={{ height:5.5, width:`${w}%`, marginBottom:4 }} />
                  ))}
                </div>
              ))}
              <div style={{ height:1, background:G[100], margin:"12px 0" }} />

              {/* skills */}
              <div style={{ fontSize:10, color:"#3b82f6", fontWeight:700, letterSpacing:".12em",
                textTransform:"uppercase", marginBottom:10 }}>Skills</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {["Figma","React","Python","Strategy","AI/ML"].map(s => (
                  <div key={s} style={{ background:G[50], border:`1px solid ${G[200]}`, borderRadius:7,
                    padding:"5px 11px", fontSize:11, fontWeight:600, color:G[700] }}>{s}</div>
                ))}
              </div>
              <TypewriterChip />
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:"100px 5%", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <h2 style={{ fontSize:"clamp(26px,3.5vw,44px)", fontWeight:800, letterSpacing:"-0.04em",
            fontFamily:"'Lora',serif", color:"#111827" }}>Loved by job seekers worldwide</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
          {TESTIMONIALS.map((t, i) => <TestiCard key={i} t={t} i={i} />)}
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} style={{ padding:"80px 5% 100px" }}>
        <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center",
          background:`linear-gradient(135deg,${G[500]},${G[600]})`,
          borderRadius:32, padding:"72px 48px",
          animation:"glowPulse 3s ease-in-out infinite",
          opacity: ctaV ? 1 : 0, transform: ctaV ? "scale(1)" : "scale(0.94)",
          transition:"opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)",
        }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🚀</div>
          <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:800, letterSpacing:"-0.04em",
            margin:"0 0 16px", fontFamily:"'Lora',serif", color:"#fff" }}>
            Your next job starts here
          </h2>
          <p style={{ color:"rgba(255,255,255,0.82)", fontSize:16, margin:"0 0 36px", lineHeight:1.65 }}>
            Join 2.4 million professionals who built their dream resume with ResumeAI.
          </p>
          <button className="cta-white-btn" onClick={() => navigate("/login")}>
            Create My Free Resume →
          </button>
          <p style={{ marginTop:16, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            Takes 3 minutes · No signup required to start
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background:"linear-gradient(135deg,#0f172a,#111827,#14532d)",
        padding:"70px 5% 25px", position:"relative", overflow:"hidden",
      }}>
        {/* glow */}
        <div style={{ position:"absolute", width:350, height:350, borderRadius:"50%",
          background:"rgba(34,197,94,0.15)", filter:"blur(80px)", top:-120, right:-100 }} />

        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40,
          position:"relative", zIndex:2, marginBottom:50 }}>
          {/* brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ width:45, height:45, borderRadius:12,
                background:"linear-gradient(135deg,#22c55e,#16a34a)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontSize:20, fontWeight:700,
                boxShadow:"0 10px 25px rgba(34,197,94,0.4)" }}>✦</div>
              <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, letterSpacing:"-0.04em" }}>
                Resume<span style={{ color:"#4ade80" }}>AI</span>
              </h2>
            </div>
            <p style={{ color:"rgba(255,255,255,0.7)", lineHeight:1.8, maxWidth:320, fontSize:14 }}>
              Build AI-powered resumes that stand out, beat ATS systems, and help you land your dream job faster.
            </p>
            <div style={{ display:"flex", gap:14, marginTop:24 }}>
              {["🌐","📘","📸","💼"].map((icon, i) => (
                <div key={i} className="social-icon-btn">{icon}</div>
              ))}
            </div>
          </div>

          {/* product links */}
          <div>
            <h3 style={{ color:"#fff", marginBottom:18, fontSize:16, fontWeight:600 }}>Product</h3>
            {["Features","Templates","Pricing","Builder"].map(item => (
              <p key={item} className="footer-link-item">{item}</p>
            ))}
          </div>

          {/* company */}
          <div>
            <h3 style={{ color:"#fff", marginBottom:18, fontSize:16, fontWeight:600 }}>Company</h3>
            {["About","Careers","Blog","Contact"].map(item => (
              <p key={item} className="footer-link-item">{item}</p>
            ))}
          </div>

          {/* newsletter */}
          <div>
            <h3 style={{ color:"#fff", marginBottom:18, fontSize:16, fontWeight:600 }}>Newsletter</h3>
            <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14, lineHeight:1.7, marginBottom:18 }}>
              Get resume tips & career updates weekly.
            </p>
            <div style={{ display:"flex", background:"rgba(255,255,255,0.08)", borderRadius:14,
              overflow:"hidden", border:"1px solid rgba(255,255,255,0.1)" }}>
              <input type="email" placeholder="Enter email" style={{
                flex:1, border:"none", outline:"none", background:"transparent",
                padding:14, color:"#fff", fontSize:14,
              }} />
              <button style={{ border:"none", background:"linear-gradient(135deg,#22c55e,#16a34a)",
                color:"#fff", padding:"0 18px", cursor:"pointer", fontWeight:700, fontSize:18 }}>→</button>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:22,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          position:"relative", zIndex:2 }}>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13 }}>
            © 2026 ResumeAI. All rights reserved.
          </p>
          <div style={{ display:"flex", gap:24 }}>
            {["Privacy Policy","Terms","Support"].map(item => (
              <span key={item} className="footer-legal-item">{item}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
