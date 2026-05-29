import { useState, useEffect, useRef, useCallback } from "react";

/* ── PALETTE ── */
const G = {
  50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",
  400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d",
};

const FEATURES = [
  { icon:"⚡", title:"AI-Powered Writing",    desc:"Craft compelling bullet points in seconds. Our AI learns your tone and tailors every line to your dream role.", color:G[500], glow:"rgba(34,197,94,0.3)" },
  { icon:"🎯", title:"ATS Optimization",      desc:"Beat applicant tracking systems with real-time scoring against Fortune 500 ATS engines before you hit send.", color:"#3b82f6", glow:"rgba(59,130,246,0.3)" },
  { icon:"🎨", title:"50+ Premium Templates", desc:"Designer-crafted layouts. Every template is recruiter-approved and pixel-perfect across every device.", color:"#f59e0b", glow:"rgba(245,158,11,0.3)" },
  { icon:"📤", title:"One-Click Export",       desc:"Download as PDF or DOCX, or share a live link. Perfect formatting guaranteed everywhere, always.", color:"#ec4899", glow:"rgba(236,72,153,0.3)" },
  { icon:"💡", title:"Real-Time Suggestions", desc:"Power words, action verbs, and measurable achievements surfaced as you type — live coaching in the editor.", color:"#8b5cf6", glow:"rgba(139,92,246,0.3)" },
  { icon:"🔗", title:"LinkedIn Import",        desc:"Pull your entire career history from LinkedIn in one click. Start from what you already have.", color:"#06b6d4", glow:"rgba(6,182,212,0.3)" },
];

const STATS = [
  { value:"2.4M+", label:"Resumes Built",  num:2.4,  suffix:"M+", float:true  },
  { value:"94%",   label:"Interview Rate", num:94,   suffix:"%",  float:false },
  { value:"3",     label:"Minutes Avg.",   num:3,    suffix:"",   float:false },
  { value:"180+",  label:"Countries",      num:180,  suffix:"+",  float:false },
];

const STEPS = [
  { num:"01", title:"Pick a Template",  desc:"50+ ATS-ready designs for every industry",    emoji:"🖼️" },
  { num:"02", title:"Add Your Details", desc:"AI fills smart suggestions as you type",        emoji:"✍️" },
  { num:"03", title:"Export & Apply",   desc:"Download PDF instantly, land the interview",   emoji:"🚀" },
];

const WORDS = ["Stunning","AI-Crafted","Job-Winning","Standout","Professional","Irresistible"];

const COMPANIES = ["Google","Amazon","Microsoft","Meta","Stripe","Airbnb","Spotify","Netflix","Notion","Figma","Apple","Uber"];

const TESTIMONIALS = [
  { name:"Akash M.",  role:"Hired at Stripe", text:"Got 3 interview calls in the first week. The AI suggestions completely transformed my resume.", emoji:"👩‍💼", rating:5 },
  { name:"James L.",  role:"Hired at Google", text:"The ATS score feature is a game changer. Went from zero replies to landing my dream job at Google.",emoji:"🧑‍💻", rating:5 },
  { name:"Priya M.",  role:"Hired at Airbnb", text:"Built my entire resume in 8 minutes. Downloaded, applied, got the interview. Absolutely unbelievable.",emoji:"👩‍🎨", rating:5 },
  { name:"Sunny L.", role:"Hired at Meta",   text:"The LinkedIn import saved me hours. ATS score jumped from 62 to 96. Worth every second.",       emoji:"🧑‍🔬", rating:5 },
  { name:"Yuki T.",   role:"Hired at Notion", text:"As a designer I'm picky about layouts. These templates are genuinely gorgeous and they work.",    emoji:"👩‍💻", rating:5 },
  { name:"Johnny S.",   role:"Hired at Fuck Off",  text:"I was skeptical but the AI nailed my tone. Recruiters told me my resume was the best they'd seen.", emoji:"🧑‍🎨", rating:5 },
];

const PRICING = [
  { name:"Free",    price:"$0",   period:"forever", color:"#6b7280", features:["3 resume downloads","5 AI suggestions/day","10 templates","PDF export"],        cta:"Start Free",    popular:false },
  { name:"Pro",     price:"$9",   period:"/month",  color:G[500],    features:["Unlimited downloads","Unlimited AI writing","50+ templates","ATS score live","LinkedIn import","Priority support"], cta:"Start Pro Trial", popular:true },
  { name:"Teams",   price:"$29",  period:"/month",  color:"#8b5cf6", features:["Everything in Pro","5 team seats","Shared brand kit","Analytics dashboard","API access","Dedicated CSM"],   cta:"Talk to Sales",   popular:false },
];

/* ── HOOKS ── */
function useInView(ref, threshold = 0.1, once = true) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); if (once) obs.disconnect(); } else if (!once) setVisible(false); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function useParallax(speed = 0.3) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const fn = () => setOffset(window.scrollY * speed);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [speed]);
  return offset;
}

function useMagnetic(strength = 0.35) {
  const ref = useRef();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = useCallback((e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    setPos({ x: (e.clientX - cx) * strength, y: (e.clientY - cy) * strength });
  }, [strength]);
  const handleLeave = useCallback(() => setPos({ x: 0, y: 0 }), []);
  return { ref, pos, handleMove, handleLeave };
}

/* ── ANIMATED WORD ── */
function AnimatedWord() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("in");
  useEffect(() => {
    const id = setInterval(() => {
      setPhase("out");
      setTimeout(() => { setIdx(i => (i + 1) % WORDS.length); setPhase("in"); }, 450);
    }, 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{
      display:"inline-block",
      background:`linear-gradient(120deg,${G[600]},${G[400]},#86efac)`,
      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
      transition:"opacity .45s cubic-bezier(.22,1,.36,1), transform .45s cubic-bezier(.22,1,.36,1)",
      opacity: phase==="in" ? 1 : 0,
      transform: phase==="in" ? "translateY(0) scale(1)" : "translateY(-24px) scale(0.94)",
      filter: phase==="in" ? "blur(0px)" : "blur(4px)",
    }}>
      {WORDS[idx]}
    </span>
  );
}

/* ── COUNT UP ── */
function CountUp({ num, suffix, float: isFloat }) {
  const [val, setVal] = useState("0");
  const ref = useRef();
  const visible = useInView(ref);
  useEffect(() => {
    if (!visible) return;
    const dur = 1800;
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

/* ── PARTICLES ── */
function Particles({ count = 35, color = "34,197,94" }) {
  const ref = useRef();
  const rafRef = useRef();
  const ptsRef = useRef([]);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e) => {
      const r = c.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    c.addEventListener("mousemove", onMouse);

    ptsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
      r: Math.random() * 3 + 1.5, o: Math.random() * .4 + .1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      const m = mouseRef.current;

      ptsRef.current.forEach(p => {
        // mouse repulsion
        const dx = p.x - m.x; const dy = p.y - m.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
          const force = (100 - dist) / 100 * 0.8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.o})`;
        ctx.fill();
      });
      ptsRef.current.forEach((a, i) => {
        ptsRef.current.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${color},${.15 * (1 - d / 130)})`;
            ctx.lineWidth = .8; ctx.stroke();
          }
        });
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); c.removeEventListener("mousemove", onMouse); };
  }, []);

  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
}

/* ── CUSTOM CURSOR ── */
function CustomCursor() {
  const dot = useRef();
  const ring = useRef();
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef();

  useEffect(() => {
    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
      if (dot.current) {
        dot.current.style.left = pos.current.x + "px";
        dot.current.style.top  = pos.current.y + "px";
      }
      if (ring.current) {
        ring.current.style.left = ringPos.current.x + "px";
        ring.current.style.top  = ringPos.current.y + "px";
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    const onEnter = () => { ring.current?.classList.add("cursor-hover"); };
    const onLeave = () => { ring.current?.classList.remove("cursor-hover"); };
    document.querySelectorAll("button,a,.cursor-target").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <>
      <div ref={dot} style={{ position:"fixed", width:8, height:8, borderRadius:"50%", background:G[400], pointerEvents:"none", zIndex:9999, transform:"translate(-50%,-50%)", transition:"transform .1s" }} />
      <div ref={ring} style={{ position:"fixed", width:36, height:36, borderRadius:"50%", border:`2px solid ${G[400]}`, pointerEvents:"none", zIndex:9998, transform:"translate(-50%,-50%)", opacity:.6 }} />
    </>
  );
}

/* ── TYPEWRITER CHIP ── */
function TypewriterChip() {
  const lines = [
    "Improved leadership bullet point",
    "Added quantified achievement ↑43%",
    "ATS score jumped to 97%",
    "Tailored for Product Manager role",
    "Action verb upgraded: 'Led' → 'Spearheaded'",
  ];
  const [li, setLi]       = useState(0);
  const [chars, setChars] = useState(0);
  const [del, setDel]     = useState(false);
  useEffect(() => {
    const cur = lines[li];
    if (!del && chars < cur.length) { const t = setTimeout(() => setChars(c => c + 1), 36); return () => clearTimeout(t); }
    if (!del && chars === cur.length) { const t = setTimeout(() => setDel(true), 1600); return () => clearTimeout(t); }
    if (del && chars > 0) { const t = setTimeout(() => setChars(c => c - 1), 20); return () => clearTimeout(t); }
    if (del && chars === 0) { setDel(false); setLi(l => (l + 1) % lines.length); }
  }, [chars, del, li]);
  return (
    <div style={{ background:G[50], border:`1px solid ${G[200]}`, borderRadius:12, padding:"10px 14px",
      fontSize:12.5, color:G[700], fontFamily:"'Fira Code',monospace", display:"flex", alignItems:"center", gap:8, marginTop:16 }}>
      <span style={{ width:8, height:8, borderRadius:"50%", background:G[400], flexShrink:0, animation:"pulse 1.4s ease-in-out infinite" }} />
      <span>✨ AI: {lines[li].slice(0, chars)}</span>
      <span style={{ width:2, height:14, background:G[500], borderRadius:1, animation:"blink .7s step-end infinite" }} />
    </div>
  );
}

/* ── FEATURE CARD ── */
function FeatureCard({ f, i }) {
  const ref = useRef();
  const visible = useInView(ref);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMouseMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    setTilt({ x: ((e.clientY - cy) / r.height) * 12, y: -((e.clientX - cx) / r.width) * 12 });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={onMouseMove}
      style={{
        background: hovered ? "#fff" : "#fafafa",
        border: `1.5px solid ${hovered ? f.color + "66" : "#e5e7eb"}`,
        borderRadius:22, padding:"34px 28px", cursor:"default",
        boxShadow: hovered ? `0 20px 60px ${f.glow}, 0 2px 8px rgba(0,0,0,0.06)` : "0 1px 4px rgba(0,0,0,0.04)",
        opacity:   visible ? 1 : 0,
        transform: visible
          ? (hovered
            ? `translateY(-10px) scale(1.02) perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
            : "translateY(0) scale(1)")
          : "translateY(48px) scale(0.95)",
        transition: `opacity .6s cubic-bezier(.22,1,.36,1) ${i * 100}ms,
                     transform .45s cubic-bezier(.22,1,.36,1),
                     background .3s, border-color .3s, box-shadow .3s`,
      }}
    >
      <div style={{ width:58, height:58, borderRadius:18,
        background:`${f.color}18`, border:`1.5px solid ${f.color}40`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:28, marginBottom:22,
        transform: hovered ? "rotate(-10deg) scale(1.15)" : "rotate(0) scale(1)",
        transition:"transform .35s cubic-bezier(.34,1.56,.64,1)",
        boxShadow: hovered ? `0 8px 24px ${f.glow}` : "none",
      }}>
        {f.icon}
      </div>
      <h3 style={{ margin:"0 0 10px", fontSize:17, fontWeight:700, color:"#111827", letterSpacing:"-0.02em" }}>{f.title}</h3>
      <p  style={{ margin:0, fontSize:14, color:"#6b7280", lineHeight:1.7 }}>{f.desc}</p>
      <div style={{ marginTop:20, display:"flex", alignItems:"center", gap:6,
        fontSize:13, fontWeight:600, color:f.color,
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateX(0)" : "translateX(-10px)",
        transition:"all .3s ease" }}>
        Learn more <span style={{ animation: hovered ? "arrowBounce .8s ease-in-out infinite" : "none" }}>→</span>
      </div>
      {/* shimmer overlay */}
      {hovered && (
        <div style={{ position:"absolute", inset:0, borderRadius:22, pointerEvents:"none",
          background:"linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.06) 100%)" }} />
      )}
    </div>
  );
}

/* ── TESTIMONIAL CARD ── */
function TestiCard({ t, i }) {
  const ref = useRef();
  const visible = useInView(ref);
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background:"#fff", border:`1.5px solid ${hovered ? G[300] : G[100]}`, borderRadius:22,
        padding:"28px 24px",
        boxShadow: hovered ? `0 16px 40px rgba(34,197,94,0.12), 0 2px 8px rgba(0,0,0,0.06)` : "0 2px 12px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-6px) scale(1.01)" : (visible ? "translateY(0)" : "translateY(44px)"),
        opacity:   visible ? 1 : 0,
        transition:`opacity .65s ease ${i * 110}ms, transform .4s cubic-bezier(.22,1,.36,1), box-shadow .3s, border-color .3s`,
      }}>
      <div style={{ display:"flex", gap:3, marginBottom:16 }}>
        {[...Array(t.rating)].map((_, j) => (
          <span key={j} style={{ color:G[400], fontSize:16,
            transform:`scale(${hovered ? 1.2 : 1}) rotate(${hovered ? (j-2)*5 : 0}deg)`,
            transition:`transform .3s ease ${j * 50}ms`, display:"inline-block" }}>★</span>
        ))}
      </div>
      <p style={{ fontSize:14.5, color:"#374151", lineHeight:1.7, margin:"0 0 20px" }}>"{t.text}"</p>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:42, height:42, borderRadius:"50%", background:G[50],
          border:`1.5px solid ${G[200]}`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:22,
          transform: hovered ? "scale(1.1) rotate(-5deg)" : "scale(1)",
          transition:"transform .3s cubic-bezier(.34,1.56,.64,1)" }}>
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

/* ── PRICING CARD ── */
function PricingCard({ p, i }) {
  const ref = useRef();
  const visible = useInView(ref);
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: p.popular ? `linear-gradient(160deg,${G[600]},${G[700]})` : "#fff",
        border: p.popular ? "none" : `1.5px solid ${hovered ? p.color + "55" : "#e5e7eb"}`,
        borderRadius:24, padding:"36px 28px", position:"relative",
        boxShadow: hovered
          ? p.popular ? `0 24px 64px rgba(34,197,94,0.5)` : `0 16px 48px ${p.color}30`
          : p.popular ? `0 16px 48px rgba(34,197,94,0.35)` : "0 2px 12px rgba(0,0,0,0.05)",
        transform: visible
          ? (hovered ? "translateY(-10px) scale(1.02)" : p.popular ? "translateY(-6px)" : "translateY(0)")
          : "translateY(40px)",
        opacity:   visible ? 1 : 0,
        transition:`opacity .6s ease ${i * 130}ms, transform .4s cubic-bezier(.22,1,.36,1), box-shadow .3s`,
      }}>
      {p.popular && (
        <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)",
          background:"linear-gradient(90deg,#fbbf24,#f59e0b)", borderRadius:999,
          padding:"6px 20px", fontSize:12, fontWeight:800, color:"#78350f",
          boxShadow:"0 4px 16px rgba(245,158,11,0.5)", whiteSpace:"nowrap" }}>
          ✦ Most Popular
        </div>
      )}
      <div style={{ marginBottom:6, fontSize:13, fontWeight:700, color: p.popular ? "rgba(255,255,255,0.7)" : "#9ca3af", letterSpacing:".08em", textTransform:"uppercase" }}>{p.name}</div>
      <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:6 }}>
        <span style={{ fontSize:48, fontWeight:800, letterSpacing:"-0.05em", color: p.popular ? "#fff" : "#111827", lineHeight:1 }}>{p.price}</span>
        <span style={{ fontSize:14, color: p.popular ? "rgba(255,255,255,0.6)" : "#9ca3af" }}>{p.period}</span>
      </div>
      <div style={{ height:1, background: p.popular ? "rgba(255,255,255,0.15)" : "#f0f0f0", margin:"24px 0" }} />
      <div style={{ marginBottom:28 }}>
        {p.features.map((feat, j) => (
          <div key={j} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:11,
            transform: hovered ? "translateX(4px)" : "translateX(0)",
            transition:`transform .3s ease ${j * 40}ms`,
            opacity: visible ? 1 : 0,
            transitionDelay: `${i * 130 + j * 60}ms` }}>
            <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0,
              background: p.popular ? "rgba(255,255,255,0.2)" : `${p.color}20`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, color: p.popular ? "#fff" : p.color, fontWeight:800 }}>✓</div>
            <span style={{ fontSize:14, color: p.popular ? "rgba(255,255,255,0.85)" : "#374151" }}>{feat}</span>
          </div>
        ))}
      </div>
      <button style={{ width:"100%", padding:"15px", borderRadius:14, border:"none", cursor:"pointer",
        background: p.popular ? "rgba(255,255,255,0.2)" : p.color, color:"#fff",
        fontSize:15, fontWeight:700, fontFamily:"inherit", letterSpacing:"-0.01em",
        transition:"all .3s cubic-bezier(.22,1,.36,1)",
        boxShadow: hovered ? `0 8px 24px ${p.popular ? "rgba(255,255,255,0.2)" : p.color + "60"}` : "none",
        transform: hovered ? "scale(1.02)" : "scale(1)",
      }}>
        {p.cta} →
      </button>
    </div>
  );
}

/* ── SCROLL PROGRESS BAR ── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fn = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((window.scrollY / total) * 100);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:300, height:3,
      background:"rgba(0,0,0,0.05)" }}>
      <div style={{ height:"100%", width:`${progress}%`,
        background:`linear-gradient(90deg,${G[400]},${G[600]})`,
        transition:"width .05s", boxShadow:`0 0 8px ${G[400]}` }} />
    </div>
  );
}

/* ── FLOATING BADGE ── */
function FloatBadge({ style, children, delay = 0 }) {
  return (
    <div style={{
      position:"absolute", background:"#fff",
      border:"1.5px solid #e5e7eb", borderRadius:16, padding:"12px 16px",
      boxShadow:"0 8px 32px rgba(0,0,0,0.08)",
      animation:`float ${5 + delay}s ease-in-out ${delay}s infinite`,
      ...style
    }}>
      {children}
    </div>
  );
}

/* ── SECTION REVEAL WRAPPER ── */
function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const ref = useRef();
  const visible = useInView(ref);
  const transforms = { up:"translateY(50px)", down:"translateY(-50px)", left:"translateX(-50px)", right:"translateX(50px)" };
  return (
    <div ref={ref} className={className} style={{
      opacity:   visible ? 1 : 0,
      transform: visible ? "translate(0,0)" : transforms[direction],
      transition:`opacity .7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ── GLITCH TEXT ── */
function GlitchText({ text, style = {} }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3500);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ position:"relative", display:"inline-block", ...style }}>
      {text}
      {glitch && <>
        <span style={{ position:"absolute", top:0, left:0, color:"#22c55e", opacity:.7, animation:"glitchR .1s ease", clipPath:"inset(0 0 60% 0)" }}>{text}</span>
        <span style={{ position:"absolute", top:0, left:0, color:"#3b82f6", opacity:.5, animation:"glitchL .15s ease", clipPath:"inset(60% 0 0 0)" }}>{text}</span>
      </>}
    </span>
  );
}

/* ── MAIN ── */
export default function Home() {
  const navigate = (path) => { window.location.href = path; };
  const [scrolled, setScrolled]   = useState(false);
  const [atsAnim,  setAtsAnim]    = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const heroParallax = useParallax(0.25);
  const stepsRef = useRef(); const stepsV = useInView(stepsRef);
  const ctaRef   = useRef(); const ctaV   = useInView(ctaRef);
  const statsRef = useRef(); const statsV = useInView(statsRef);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { const t = setTimeout(() => setAtsAnim(true), 700); return () => clearTimeout(t); }, []);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,700;1,600&family=Fira+Code:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;cursor:none}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:#f9fafb}
    ::-webkit-scrollbar-thumb{background:#d1fae5;border-radius:3px}
    .cursor-hover{transform:translate(-50%,-50%) scale(2.2)!important;opacity:.25!important;background:${G[500]}!important;border-color:transparent!important}
    @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
    @keyframes floatR{0%,100%{transform:translateY(0) rotate(2deg)}50%{transform:translateY(-20px) rotate(-2deg)}}
    @keyframes spinSlow{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.75)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}
    @keyframes glowPulse{0%,100%{box-shadow:0 28px 80px rgba(34,197,94,.4)}50%{box-shadow:0 28px 80px rgba(34,197,94,.75)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes arrowBounce{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
    @keyframes glitchR{0%,100%{transform:none}50%{transform:translateX(3px) skewX(2deg)}}
    @keyframes glitchL{0%,100%{transform:none}50%{transform:translateX(-3px) skewX(-2deg)}}
    @keyframes borderPulse{0%,100%{border-color:#bbf7d0}50%{border-color:#4ade80}}
    @keyframes countUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
    @keyframes ripple{from{transform:translate(-50%,-50%) scale(0);opacity:.5}to{transform:translate(-50%,-50%) scale(4);opacity:0}}
    @keyframes slideInLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideInRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
    @keyframes rotateIn{from{opacity:0;transform:rotate(-10deg) scale(0.9)}to{opacity:1;transform:rotate(0) scale(1)}}
    @keyframes bounceDot{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
    .btn-green{background:${G[500]};color:#fff;border:none;border-radius:14px;padding:14px 30px;font-size:15px;font-weight:700;cursor:none;font-family:inherit;letter-spacing:-.01em;position:relative;overflow:hidden;transition:all .3s cubic-bezier(.22,1,.36,1)}
    .btn-green::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15),transparent);opacity:0;transition:opacity .3s}
    .btn-green:hover{background:${G[600]};transform:translateY(-3px);box-shadow:0 16px 40px rgba(34,197,94,.5)}
    .btn-green:hover::after{opacity:1}
    .btn-green:active{transform:scale(0.97)}
    .btn-outline{background:#fff;color:${G[600]};border:2px solid ${G[500]};border-radius:14px;padding:14px 28px;font-size:15px;font-weight:700;cursor:none;font-family:inherit;transition:all .3s ease;position:relative;overflow:hidden}
    .btn-outline:hover{background:${G[50]};transform:translateY(-2px);box-shadow:0 8px 24px rgba(34,197,94,.25)}
    .btn-outline:active{transform:scale(0.97)}
    .nav-link{color:#4b5563;text-decoration:none;font-size:14px;font-weight:500;transition:all .2s;position:relative}
    .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:${G[500]};transition:width .3s ease;border-radius:1px}
    .nav-link:hover{color:${G[600]}}
    .nav-link:hover::after{width:100%}
    .skeleton{border-radius:4px;background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.6s infinite}
    .footer-link-item{color:rgba(255,255,255,.65);margin-bottom:12px;cursor:none;transition:all .3s;font-size:14px;display:flex;align-items:center;gap:6px}
    .footer-link-item:hover{color:#4ade80;transform:translateX(4px)}
    .social-icon-btn{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;cursor:none;transition:all .3s;font-size:18px}
    .social-icon-btn:hover{transform:translateY(-5px) rotate(5deg);background:linear-gradient(135deg,${G[500]},${G[600]});box-shadow:0 8px 20px rgba(34,197,94,.4)}
    .footer-legal-item{color:rgba(255,255,255,.55);font-size:13px;cursor:none;transition:color .3s}
    .footer-legal-item:hover{color:#4ade80}
    .cta-white-btn{background:#fff;color:${G[700]};border:none;border-radius:14px;padding:18px 48px;font-size:17px;font-weight:800;cursor:none;font-family:inherit;transition:all .3s cubic-bezier(.22,1,.36,1);letter-spacing:-.01em;position:relative;overflow:hidden}
    .cta-white-btn:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.22)}
    .cta-white-btn:active{transform:scale(0.97)}
    .marquee-track:hover{animation-play-state:paused}
    .feature-card-wrap{position:relative}
  `;

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','Segoe UI',sans-serif", background:"#fff", color:"#111827", overflowX:"hidden" }}>
      <style>{css}</style>
      <ScrollProgress />
      <CustomCursor />

      {/* ── NAV ── */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        padding:"0 5%", height:68,
        background: scrolled ? "rgba(255,255,255,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${G[100]}` : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,.07)" : "none",
        transition:"all .4s ease",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10,
            background:`linear-gradient(135deg,${G[400]},${G[600]})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, boxShadow:`0 4px 14px ${G[400]}70`,
            animation:"rotateIn .6s cubic-bezier(.34,1.56,.64,1) both" }}>🤖</div>
          <span style={{ fontWeight:800, fontSize:19, letterSpacing:"-0.04em", color:"#111827",
            animation:"fadeIn .6s ease .1s both" }}>
            Resume<span style={{ color:G[500] }}>AI</span>
          </span>
        </div>
        <div style={{ display:"flex", gap:32 }}>
          {["Features","Templates","Pricing","About"].map((l, i) => (
            <a key={l} href="#" className="nav-link" style={{ animationDelay:`${i * 80}ms` }}>{l}</a>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, animation:"fadeIn .6s ease .3s both" }}>
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
        background:`radial-gradient(ellipse 90% 70% at 50% -5%,${G[50]} 0%,#fff 65%)`,
      }}>
        <Particles count={40} />

        {/* Spinning rings */}
        {[700, 500, 320].map((size, i) => (
          <div key={i} style={{ position:"absolute", width:size, height:size, borderRadius:"50%",
            border:`1px ${i === 1 ? "dashed" : "solid"} ${G[i === 2 ? 300 : 200]}`,
            top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            pointerEvents:"none", opacity:.6,
            animation:`spinSlow ${30 + i * 12}s linear ${i % 2 === 0 ? "" : "reverse"} infinite` }} />
        ))}

        {/* Left float badge */}
        <FloatBadge style={{ left:"3%", top:"38%", width:190, opacity:.95 }} delay={0.5}>
          <div style={{ fontSize:11, color:G[500], fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:".08em" }}>ATS Score</div>
          <div style={{ fontSize:30, fontWeight:800, color:G[600], letterSpacing:"-0.04em" }}>98 / 100</div>
          <div style={{ marginTop:8, height:6, background:G[100], borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", background:`linear-gradient(90deg,${G[400]},${G[600]})`, borderRadius:3,
              width: atsAnim ? "98%" : "0%", transition:"width 1.4s ease .6s",
              boxShadow:`0 0 8px ${G[400]}` }} />
          </div>
        </FloatBadge>

        {/* Right float badge */}
        <FloatBadge style={{ right:"3%", top:"35%", width:195, opacity:.95 }} delay={1}>
          <div style={{ fontSize:11, color:"#3b82f6", fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:".08em" }}>New Interview</div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🏢</div>
            <div>
              <div style={{ fontWeight:700, fontSize:13 }}>Google</div>
              <div style={{ fontSize:12, color:"#6b7280" }}>Product Designer</div>
            </div>
          </div>
          <div style={{ marginTop:10, background:G[50], borderRadius:8, padding:"6px 10px",
            fontSize:12, color:G[600], fontWeight:600, display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:G[400], animation:"pulse 1.2s ease-in-out infinite", display:"inline-block" }} />
            Interview in 2 days
          </div>
        </FloatBadge>

        {/* Bottom-left float */}
        <FloatBadge style={{ left:"6%", bottom:"18%", width:170, opacity:.85 }} delay={1.5}>
          <div style={{ fontSize:11, color:"#8b5cf6", fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:".08em" }}>Hired!</div>
          <div style={{ fontSize:13, fontWeight:600, color:"#374151" }}>🎉Akash just got<br />hired at JIS UNIVERSITY</div>
        </FloatBadge>


          <FloatBadge style={{ right:"6%", bottom:"18%", width:170, opacity:.85 }} delay={1.5}>
          <div style={{ fontSize:11, color:"#8b5cf6", fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:".08em" }}>Hired!</div>
          <div style={{ fontSize:13, fontWeight:600, color:"#374151" }}>🎉Priya just got<br />hired at Google</div>
        </FloatBadge>

        {/* Center */}
        <div style={{ maxWidth:760, textAlign:"center", position:"relative", zIndex:2,
          transform:`translateY(${-heroParallax * 0.2}px)` }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:G[50], border:`1.5px solid ${G[200]}`, borderRadius:999,
            padding:"7px 18px", marginBottom:32, fontSize:13, fontWeight:600, color:G[700],
            animation:"fadeIn .7s ease both",
            boxShadow:`0 4px 16px ${G[200]}` }}>
            <span style={{ animation:"pulse 2s ease-in-out infinite", display:"inline-block" }}>🤖</span>
            Powered by GPT-4o · Smarter than ever
          </div>

          <h1 style={{ fontSize:"clamp(44px,6.5vw,80px)", fontWeight:800, lineHeight:1.06,
            letterSpacing:"-0.045em", margin:"0 0 26px", fontFamily:"'Lora','Georgia',serif",
            animation:"fadeUp .9s cubic-bezier(.22,1,.36,1) .1s both", color:"#111827" }}>
            Build a <AnimatedWord /><br />Resume in Minutes
          </h1>

          <p style={{ fontSize:18.5, color:"#6b7280", lineHeight:1.68, maxWidth:540,
            margin:"0 auto 40px", animation:"fadeUp .9s cubic-bezier(.22,1,.36,1) .22s both" }}>
            AI that understands your career. ATS-beating templates. Your dream job — one click away ❤️
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap",
            animation:"fadeUp .9s cubic-bezier(.22,1,.36,1) .34s both" }}>
            <button className="btn-green" style={{ padding:"18px 40px", fontSize:16 }} 
            onClick={() => navigate("/login")}>
              Build My Resume — Free 🎉
            </button>
            <button className="btn-outline" style={{ padding:"18px 28px", fontSize:16, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ width:34, height:34, borderRadius:"50%", background:G[50], border:`1.5px solid ${G[300]}`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>▶</span>
              Watch Demo
            </button>
          </div>

          <p style={{ marginTop:18, fontSize:13, color:"#9ca3af", animation:"fadeIn 1s ease .5s both" }}>
            No credit card · Free forever plan · 3-minute setup
          </p>

          {/* Social proof avatars */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12,
            marginTop:28, animation:"fadeUp .9s ease .55s both" }}>
            <div style={{ display:"flex" }}>
              {["🧑‍💼","👩‍💻","🧑‍🎨","👩‍🔬","🧑‍💻","👩‍🎤"].map((e, i) => (
                <div key={i} style={{ width:36, height:36, borderRadius:"50%",
                  background:`hsl(${135 + i * 18},55%,88%)`,
                  border:"2.5px solid #fff", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:18, marginLeft: i === 0 ? 0 : -12,
                  transition:"transform .2s", zIndex: 10 - i,
                  animation:`fadeIn .4s ease ${i * 80}ms both` }}>
                  {e}
                </div>
              ))}
            </div>
            <div style={{ fontSize:13.5, color:"#6b7280" }}>
              <span style={{ fontWeight:700, color:"#111827" }}>2.4M+</span> professionals already hired
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ marginTop:48, display:"flex", flexDirection:"column", alignItems:"center", gap:8,
            animation:"fadeIn 1.2s ease .8s both", opacity:.5 }}>
            <div style={{ width:28, height:44, border:"2px solid #d1d5db", borderRadius:14,
              display:"flex", alignItems:"flex-start", justifyContent:"center", padding:5 }}>
              <div style={{ width:4, height:4, borderRadius:"50%", background:"#6b7280",
                animation:"scrollDot 1.8s ease-in-out infinite" }} />
            </div>
            <span style={{ fontSize:11, color:"#9ca3af", letterSpacing:".08em", textTransform:"uppercase" }}>Scroll</span>
          </div>
        </div>
      </section>

      {/* Scroll dot keyframe injected separately */}
      <style>{`@keyframes scrollDot{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(16px);opacity:0.3}}`}</style>

      {/* ── MARQUEE ── */}
      <div style={{ overflow:"hidden", borderTop:`1px solid ${G[100]}`, borderBottom:`1px solid ${G[100]}`,
        padding:"14px 0", background:G[50] }}>
        <div className="marquee-track" style={{ display:"flex", width:"max-content", animation:"marquee 22s linear infinite", gap:52 }}>
          {[...COMPANIES, ...COMPANIES].map((c, i) => (
            <span key={i} style={{ fontSize:13.5, fontWeight:700, color:G[600],
              letterSpacing:".07em", textTransform:"uppercase", whiteSpace:"nowrap",
              display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:G[300], display:"inline-block" }} />
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ padding:"80px 5%", maxWidth:1040, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0,
          border:`1px solid ${G[100]}`, borderRadius:24, overflow:"hidden",
          boxShadow:"0 4px 24px rgba(0,0,0,0.05)" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign:"center", padding:"48px 24px",
              borderLeft: i > 0 ? `1px solid ${G[100]}` : "none",
              background: statsV ? "#fff" : G[50],
              transition:`background .5s ease ${i * 100}ms`,
              position:"relative", overflow:"hidden" }}>
              {/* animated bg glow */}
              <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 50% 50%,${G[100]},transparent 70%)`,
                opacity: statsV ? 1 : 0, transition:`opacity .8s ease ${i * 100}ms` }} />
              <div style={{ fontSize:52, fontWeight:800, color:G[600], letterSpacing:"-0.05em",
                fontFamily:"'Lora',serif", lineHeight:1, marginBottom:8,
                position:"relative",
                opacity: statsV ? 1 : 0,
                transform: statsV ? "translateY(0)" : "translateY(30px)",
                transition:`all .7s cubic-bezier(.22,1,.36,1) ${i * 120}ms` }}>
                <CountUp num={s.num} suffix={s.suffix} float={s.float} />
              </div>
              <div style={{ fontSize:14, color:"#9ca3af", fontWeight:500, position:"relative",
                opacity: statsV ? 1 : 0, transition:`opacity .6s ease ${i * 120 + 200}ms` }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:"60px 5% 100px", background:G[50] }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <Reveal direction="up">
            <div style={{ textAlign:"center", marginBottom:64 }}>
              <div style={{ fontSize:12, color:G[600], fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12 }}>Why ResumeAI</div>
              <h2 style={{ fontSize:"clamp(30px,4vw,52px)", fontWeight:800, letterSpacing:"-0.04em", margin:"0 0 14px", fontFamily:"'Lora',serif", color:"#111827" }}>
                Everything you need<br />to get hired faster
              </h2>
              <p style={{ color:"#6b7280", fontSize:17, maxWidth:460, margin:"0 auto" }}>
                From blank page to interview-ready in under 3 minutes.
              </p>
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} f={f} i={i} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={stepsRef} style={{ padding:"100px 5%", maxWidth:1040, margin:"0 auto" }}>
        <Reveal direction="up">
          <div style={{ textAlign:"center", marginBottom:72 }}>
            <div style={{ fontSize:12, color:G[600], fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12 }}>How It Works</div>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, letterSpacing:"-0.04em", margin:0, fontFamily:"'Lora',serif", color:"#111827" }}>
              Three steps to your dream job
            </h2>
          </div>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, position:"relative" }}>
          {/* animated connector line */}
          <div style={{ position:"absolute", top:52, left:"18%", height:3, zIndex:0, borderRadius:2,
            background:`linear-gradient(90deg,${G[300]},${G[500]},${G[400]})`,
            width: stepsV ? "63%" : "0%", transition:"width 1.4s cubic-bezier(.22,1,.36,1) .5s",
            boxShadow: stepsV ? `0 0 12px ${G[400]}60` : "none" }} />

          {STEPS.map((s, i) => (
            <div key={i} style={{ textAlign:"center", padding:"0 28px", position:"relative", zIndex:1,
              opacity:  stepsV ? 1 : 0,
              transform: stepsV ? "translateY(0)" : "translateY(44px)",
              transition:`all .8s cubic-bezier(.22,1,.36,1) ${i * 180}ms` }}>
              <div style={{ width:108, height:108, borderRadius:"50%", margin:"0 auto 30px",
                background:`linear-gradient(135deg,${G[100]},${G[200]})`,
                border:`3px solid ${G[300]}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:38, position:"relative",
                boxShadow:`0 10px 32px ${G[200]}, 0 0 0 6px ${G[50]}`,
                animation: stepsV ? `wiggle 3.5s ease-in-out ${i * 0.7 + 1}s infinite` : "none",
              }}>
                {s.emoji}
                <div style={{ position:"absolute", top:-10, right:-6, width:30, height:30,
                  borderRadius:"50%", background:`linear-gradient(135deg,${G[500]},${G[600]})`,
                  color:"#fff", fontSize:11, fontWeight:800,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 4px 12px ${G[500]}70` }}>{s.num}</div>
              </div>
              <h3 style={{ fontSize:20, fontWeight:800, margin:"0 0 10px", letterSpacing:"-0.025em", color:"#111827" }}>{s.title}</h3>
              <p style={{ color:"#6b7280", fontSize:14.5, lineHeight:1.68 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE EDITOR SPLIT ── */}
      <section style={{ padding:"80px 5% 100px", background:G[50] }}>
        <div style={{ maxWidth:1120, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
          <Reveal direction="left" delay={0}>
            <div style={{ fontSize:12, color:G[600], fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", marginBottom:14 }}>Live Editor</div>
            <h2 style={{ fontSize:"clamp(26px,3.2vw,42px)", fontWeight:800, letterSpacing:"-0.04em",
              margin:"0 0 18px", fontFamily:"'Lora',serif", lineHeight:1.16, color:"#111827" }}>
              Watch your resume come alive as you type
            </h2>
            <p style={{ color:"#6b7280", fontSize:15.5, lineHeight:1.75, margin:"0 0 28px" }}>
              Real-time preview. AI suggestions inline. An ATS score that updates live. Every change — instant.
            </p>
            {["Smart autofill from your LinkedIn profile","Instant ATS compatibility score live","One-click tone: formal, friendly, bold","Auto-translated for 40+ languages"].map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, fontSize:15, color:"#374151", marginBottom:14,
                animation:`slideInLeft .6s cubic-bezier(.22,1,.36,1) ${i * 100 + 200}ms both` }}>
                <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0,
                  background:`linear-gradient(135deg,${G[400]},${G[600]})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, color:"#fff", boxShadow:`0 4px 12px ${G[400]}50` }}>✓</div>
                {item}
              </div>
            ))}
            <button className="btn-green" style={{ marginTop:16, padding:"15px 32px", fontSize:15 }}>
              Try the Editor Free →
            </button>
          </Reveal>

          <Reveal direction="right" delay={100}>
            <div style={{ background:"#fff", border:`1.5px solid ${G[200]}`, borderRadius:28, padding:30,
              boxShadow:`0 24px 64px rgba(0,0,0,0.08), 0 4px 16px ${G[100]}`,
              position:"relative", animation:"float 7s ease-in-out infinite" }}>
              <div style={{ position:"absolute", top:-15, right:22,
                background:`linear-gradient(135deg,${G[500]},${G[600]})`,
                borderRadius:999, padding:"6px 16px", fontSize:12, fontWeight:700, color:"#fff",
                boxShadow:`0 6px 18px ${G[500]}55` }}>✅ ATS Score: 98%</div>

              <div style={{ marginBottom:18 }}>
                <div className="skeleton" style={{ height:13, width:"54%", marginBottom:7 }} />
                <div className="skeleton" style={{ height:8,  width:"38%" }} />
              </div>
              <div style={{ height:1, background:G[100], marginBottom:16 }} />
              <div style={{ fontSize:10, color:G[600], fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", marginBottom:12 }}>Experience</div>
              {[[80,65,92],[75,58,85]].map((widths, i) => (
                <div key={i} style={{ marginBottom:14 }}>
                  <div className="skeleton" style={{ height:8, width:"58%", marginBottom:5 }} />
                  <div className="skeleton" style={{ height:7, width:"40%", marginBottom:8 }} />
                  {widths.map((w, j) => <div key={j} className="skeleton" style={{ height:5.5, width:`${w}%`, marginBottom:4 }} />)}
                </div>
              ))}
              <div style={{ height:1, background:G[100], margin:"12px 0" }} />
              <div style={{ fontSize:10, color:"#3b82f6", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", marginBottom:10 }}>Skills</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {["Figma","React","Python","Strategy","AI/ML","Design"].map(s => (
                  <div key={s} style={{ background:G[50], border:`1px solid ${G[200]}`, borderRadius:7,
                    padding:"5px 11px", fontSize:11, fontWeight:600, color:G[700] }}>{s}</div>
                ))}
              </div>
              <TypewriterChip />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:"100px 5%", maxWidth:1200, margin:"0 auto" }}>
        <Reveal direction="up">
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <div style={{ fontSize:12, color:G[600], fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12 }}>Testimonials</div>
            <h2 style={{ fontSize:"clamp(26px,3.5vw,46px)", fontWeight:800, letterSpacing:"-0.04em", fontFamily:"'Lora',serif", color:"#111827" }}>
              Loved by job seekers worldwide
            </h2>
          </div>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
          {TESTIMONIALS.map((t, i) => <TestiCard key={i} t={t} i={i} />)}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding:"80px 5% 100px", background:G[50] }}>
        <div style={{ maxWidth:1060, margin:"0 auto" }}>
          <Reveal direction="up">
            <div style={{ textAlign:"center", marginBottom:64 }}>
              <div style={{ fontSize:12, color:G[600], fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12 }}>Pricing</div>
              <h2 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:800, letterSpacing:"-0.04em", margin:"0 0 14px", fontFamily:"'Lora',serif", color:"#111827" }}>
                Simple, transparent pricing
              </h2>
              <p style={{ color:"#6b7280", fontSize:16, maxWidth:440, margin:"0 auto" }}>
                Start free. Upgrade when you're ready. Cancel anytime.
              </p>
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, alignItems:"start" }}>
            {PRICING.map((p, i) => <PricingCard key={i} p={p} i={i} />)}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding:"80px 5%", maxWidth:760, margin:"0 auto" }}>
        <Reveal direction="up">
          <h2 style={{ textAlign:"center", fontSize:"clamp(24px,3.5vw,40px)", fontWeight:800, letterSpacing:"-0.04em", fontFamily:"'Lora',serif", color:"#111827", marginBottom:48 }}>
            Frequently asked questions
          </h2>
        </Reveal>
        {[
          { q:"Is ResumeAI really free?", a:"Yes! The free plan lets you build and download up to 3 resumes forever. No hidden fees." },
          { q:"How does the AI writing work?", a:"Our AI analyzes your role, industry, and experience, then suggests tailored bullet points, power verbs, and quantified achievements." },
          { q:"What is an ATS score?", a:"ATS (Applicant Tracking System) score measures how well your resume passes automated screening. We score against real Fortune 500 ATS engines." },
          { q:"Can I import from LinkedIn?", a:"Absolutely. One click and your entire career history, skills, and education are imported and formatted instantly." },
        ].map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} i={i} />
        ))}
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} style={{ padding:"80px 5% 100px" }}>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center",
          background:`linear-gradient(135deg,${G[500]},${G[600]},${G[700]})`,
          borderRadius:36, padding:"76px 52px",
          animation:"glowPulse 3s ease-in-out infinite",
          opacity:  ctaV ? 1 : 0,
          transform: ctaV ? "scale(1) translateY(0)" : "scale(0.92) translateY(32px)",
          transition:"opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)",
          position:"relative", overflow:"hidden" }}>
          {/* bg particles */}
          <div style={{ position:"absolute", inset:0 }}><Particles count={16} color="255,255,255" /></div>
          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ fontSize:52, marginBottom:16, animation:"float 3s ease-in-out infinite" }}>🚀</div>
            <h2 style={{ fontSize:"clamp(28px,4vw,46px)", fontWeight:800, letterSpacing:"-0.04em",
              margin:"0 0 16px", fontFamily:"'Lora',serif", color:"#fff" }}>
              Your next job starts here
            </h2>
            <p style={{ color:"rgba(255,255,255,0.82)", fontSize:16.5, margin:"0 0 36px", lineHeight:1.68 }}>
              Join 2.4 million professionals who built their dream resume with ResumeAI.
            </p>
            <button className="cta-white-btn" onClick={() => navigate("/login")}>
              Create My Free Resume →
            </button>
            <p style={{ marginTop:16, fontSize:13, color:"rgba(255,255,255,0.58)" }}>
              Takes 3 minutes · No signup required to start
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"linear-gradient(160deg,#0f172a,#111827 40%,#14532d)",
        padding:"70px 5% 25px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%",
          background:"rgba(34,197,94,0.12)", filter:"blur(90px)", top:-140, right:-80 }} />
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%",
          background:"rgba(59,130,246,0.08)", filter:"blur(80px)", bottom:-100, left:-60 }} />

        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40,
          position:"relative", zIndex:2, marginBottom:50 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ width:46, height:46, borderRadius:12,
                background:"linear-gradient(135deg,#22c55e,#16a34a)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontSize:22, boxShadow:"0 10px 25px rgba(34,197,94,0.4)" }}>✦</div>
              <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, letterSpacing:"-0.04em" }}>
                Resume<span style={{ color:"#4ade80" }}>AI</span>
              </h2>
            </div>
            <p style={{ color:"rgba(255,255,255,0.65)", lineHeight:1.8, maxWidth:320, fontSize:14 }}>
              Build AI-powered resumes that stand out, beat ATS systems, and help you land your dream job faster.
            </p>
            <div style={{ display:"flex", gap:14, marginTop:24 }}>
              {["🌐","📘","📸","💼"].map((icon, i) => (
                <div key={i} className="social-icon-btn">{icon}</div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ color:"#fff", marginBottom:18, fontSize:16, fontWeight:600 }}>Product</h3>
            {["Features","Templates","Pricing","Builder","Changelog"].map(item => (
              <p key={item} className="footer-link-item"><span style={{ fontSize:10, opacity:.5 }}>→</span> {item}</p>
            ))}
          </div>
          <div>
            <h3 style={{ color:"#fff", marginBottom:18, fontSize:16, fontWeight:600 }}>Company</h3>
            {["About","Careers","Blog","Press","Contact"].map(item => (
              <p key={item} className="footer-link-item"><span style={{ fontSize:10, opacity:.5 }}>→</span> {item}</p>
            ))}
          </div>
          <div>
            <h3 style={{ color:"#fff", marginBottom:18, fontSize:16, fontWeight:600 }}>Newsletter</h3>
            <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14, lineHeight:1.7, marginBottom:18 }}>
              Get resume tips & career updates weekly.
            </p>
            <div style={{ display:"flex", background:"rgba(255,255,255,0.08)", borderRadius:14,
              overflow:"hidden", border:"1px solid rgba(255,255,255,0.1)" }}>
              <input type="email" placeholder="Enter email" style={{
                flex:1, border:"none", outline:"none", background:"transparent",
                padding:14, color:"#fff", fontSize:14, cursor:"none" }} />
              <button style={{ border:"none", background:"linear-gradient(135deg,#22c55e,#16a34a)",
                color:"#fff", padding:"0 18px", cursor:"none", fontWeight:700, fontSize:18 }}>→</button>
            </div>
          </div>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:22,
          display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:2 }}>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13 }}>© 2026 ResumeAI. All rights reserved.</p>
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

/* ── FAQ ITEM ── */
function FAQItem({ q, a, i }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const visible = useInView(ref);
  return (
    <div ref={ref} style={{
      borderBottom:"1px solid #e5e7eb", marginBottom:0,
      opacity:  visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition:`all .6s cubic-bezier(.22,1,.36,1) ${i * 100}ms`,
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width:"100%", padding:"22px 0", display:"flex", justifyContent:"space-between",
        alignItems:"center", background:"none", border:"none", cursor:"none",
        fontFamily:"inherit", fontWeight:700, fontSize:16, color:"#111827", textAlign:"left",
      }}>
        {q}
        <span style={{ fontSize:22, color:G[500], transform: open ? "rotate(45deg)" : "rotate(0)",
          transition:"transform .3s cubic-bezier(.34,1.56,.64,1)", flexShrink:0, marginLeft:12 }}>+</span>
      </button>
      <div style={{ overflow:"hidden", maxHeight: open ? "200px" : "0px",
        transition:"max-height .4s cubic-bezier(.22,1,.36,1)", paddingBottom: open ? 20 : 0 }}>
        <p style={{ color:"#6b7280", fontSize:15, lineHeight:1.72 }}>{a}</p>
      </div>
    </div>
  );
}