import { useState, useRef, useCallback, useEffect } from "react";

/* ─── GLOBAL CSS ──────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800;900&family=Open+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Open Sans',sans-serif;background:#f0f4f8;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#e2e8f0;}
::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:99px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}  }
@keyframes scanLine{0%{top:0;}100%{top:100%;}}
@keyframes scoreReveal{from{stroke-dasharray:0 314;}to{}}
@keyframes slideIn{from{opacity:0;transform:translateX(-16px);}to{opacity:1;transform:translateX(0);}}
@keyframes bounceIn{0%{transform:scale(0.8);opacity:0;}70%{transform:scale(1.04);}100%{transform:scale(1);opacity:1;}}
.fade-up{animation:fadeUp 0.4s ease both;}
.fade-in{animation:fadeIn 0.35s ease both;}
.bounce-in{animation:bounceIn 0.5s cubic-bezier(.36,.07,.19,.97) both;}
input,textarea,select{
  font-family:'Open Sans',sans-serif;font-size:13px;
  background:#fff;border:1.5px solid #cbd5e1;border-radius:8px;
  padding:9px 12px;color:#1e293b;width:100%;
  transition:border 0.2s,box-shadow 0.2s;resize:vertical;outline:none;
}
input:focus,textarea:focus,select:focus{border-color:#1e3a5f;box-shadow:0 0 0 3px rgba(30,58,95,0.1);}
input::placeholder,textarea::placeholder{color:#94a3b8;}
label{display:block;font-size:11px;font-weight:700;color:#334155;
  letter-spacing:0.6px;text-transform:uppercase;margin-bottom:4px;}
button{font-family:'Open Sans',sans-serif;cursor:pointer;}
.tpl-card{transition:all 0.22s ease;cursor:pointer;}
.tpl-card:hover{transform:translateY(-3px);}
.tpl-card.selected{outline:2.5px solid #2563eb;}
.nav-btn{transition:all 0.15s ease;}
.nav-btn:hover{background:#dbeafe !important;}
`;

/* ─── TEMPLATE DEFINITIONS ──────────────────────────────────────── */
const TEMPLATES = [
  { id:"blueSidebar",   name:"Blue Sidebar",    tag:"Classic",      preview:"#1e3a5f" },
  { id:"greenSidebar",  name:"Green Sidebar",   tag:"Fresh",        preview:"#166534" },
  { id:"darkPro",       name:"Dark Pro",        tag:"Executive",    preview:"#0f172a" },
  { id:"minimalClean",  name:"Minimal Clean",   tag:"ATS Best",     preview:"#f8fafc" },
  { id:"modernSplit",   name:"Modern Split",    tag:"Creative",     preview:"#7c3aed" },
  { id:"redBold",       name:"Bold Red",        tag:"Standout",     preview:"#991b1b" },
];

const uid = () => Math.random().toString(36).slice(2,8);

const NAV = [
  {id:"basics",label:"Basic Info",icon:"👤"},
  {id:"profile",label:"Profile",icon:"📝"},
  {id:"education",label:"Education",icon:"🎓"},
  {id:"experience",label:"Experience",icon:"💼"},
  {id:"projects",label:"Projects",icon:"🚀"},
  {id:"skills",label:"Skills",icon:"⚡"},
  {id:"languages",label:"Languages",icon:"🌍"},
  {id:"certifications",label:"Certifications",icon:"🏆"},
  {id:"achievements",label:"Achievements",icon:"🏅"},
];

const EMPTY_DATA = () => ({
  photo:null, name:"", title:"", email:"", phone:"", location:"",
  linkedin:"", github:"", website:"", profile:"",
  reference:"References available upon request.",
  education:[{id:uid(),institution:"",degree:"",startYear:"",endYear:"",description:"",gpa:""}],
  experience:[{id:uid(),startYear:"",endYear:"",title:"",bullets:""}],
  projects:[{id:uid(),startYear:"",endYear:"",title:"",bullets:""}],
  skills:[{id:uid(),category:"Technical",items:""}],
  languages:[{id:uid(),language:"",proficiency:"Fluent"}],
  certifications:[{id:uid(),name:"",issuer:"",year:""}],
  achievements:[{id:uid(),title:"",description:""}],
});

/* ══════════════════════════════════════════════════════════════════
   RESUME RENDERERS (6 templates)
══════════════════════════════════════════════════════════════════ */
const parseBullets = t => t ? t.split("\n").filter(l=>l.trim()) : [];

/* Shared sidebar layout helper */
function SidebarLayout({ sidebarBg, sidebarText, accentColor, headerAccent, data, children }) {
  const SideSection = ({title,ch}) => (
    <div style={{marginBottom:18}}>
      <div style={{fontSize:9.5,fontWeight:800,letterSpacing:2,textTransform:"uppercase",
        color:headerAccent,borderBottom:"1px solid rgba(255,255,255,0.15)",
        paddingBottom:5,marginBottom:9,fontFamily:"'Raleway',sans-serif"}}>{title}</div>
      {ch}
    </div>
  );
  return (
    <div style={{fontFamily:"'Open Sans',sans-serif",display:"grid",gridTemplateColumns:"210px 1fr",minHeight:"100%",background:"#fff"}}>
      <div style={{background:sidebarBg,color:sidebarText,padding:"28px 16px"}}>
        {data.photo
          ? <img src={data.photo} alt="profile" style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",border:`3px solid ${headerAccent}`,display:"block",margin:"0 auto 18px"}}/>
          : <div style={{width:70,height:70,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"2px dashed rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 18px"}}>👤</div>
        }
        <SideSection title="Contact" ch={<>
          {data.email&&<div style={{fontSize:10.5,color:headerAccent,marginBottom:4,wordBreak:"break-all"}}>✉ {data.email}</div>}
          {data.phone&&<div style={{fontSize:10.5,color:headerAccent,marginBottom:4}}>📞 {data.phone}</div>}
          {data.location&&<div style={{fontSize:10.5,color:headerAccent,marginBottom:4}}>📍 {data.location}</div>}
          {data.linkedin&&<div style={{fontSize:10.5,color:headerAccent,marginBottom:4,wordBreak:"break-all"}}>in {data.linkedin}</div>}
          {data.github&&<div style={{fontSize:10.5,color:headerAccent,marginBottom:4,wordBreak:"break-all"}}>⌥ {data.github}</div>}
        </>}/>
        {data.skills?.some(s=>s.items)&&<SideSection title="Skills" ch={
          data.skills.filter(s=>s.items).map((s,i)=>(
            <div key={i} style={{marginBottom:8}}>
              {s.category&&<div style={{fontSize:9,fontWeight:700,color:headerAccent,marginBottom:4,textTransform:"uppercase",letterSpacing:0.4}}>{s.category}</div>}
              {s.items.split(",").map(sk=>sk.trim()).filter(Boolean).map((sk,j)=>(
                <div key={j} style={{fontSize:10.5,color:sidebarText,marginBottom:3,paddingLeft:8,borderLeft:`2px solid ${accentColor}`}}>{sk}</div>
              ))}
            </div>
          ))
        }/>}
        {data.languages?.some(l=>l.language)&&<SideSection title="Languages" ch={
          data.languages.filter(l=>l.language).map((l,i)=>(
            <div key={i} style={{fontSize:10.5,marginBottom:5}}>
              <span style={{fontWeight:700,color:sidebarText}}>{l.language}</span>
              {l.proficiency&&<span style={{color:headerAccent,fontSize:10}}> ({l.proficiency})</span>}
            </div>
          ))
        }/>}
        {data.certifications?.some(c=>c.name)&&<SideSection title="Certifications" ch={
          data.certifications.filter(c=>c.name).map((c,i)=>(
            <div key={i} style={{marginBottom:7}}>
              <div style={{fontSize:10.5,fontWeight:700,color:sidebarText}}>{c.name}</div>
              {(c.issuer||c.year)&&<div style={{fontSize:9.5,color:headerAccent}}>{c.issuer}{c.year&&` · ${c.year}`}</div>}
            </div>
          ))
        }/>}
        {data.reference&&<SideSection title="Reference" ch={<div style={{fontSize:10.5,color:headerAccent,fontStyle:"italic",lineHeight:1.5}}>{data.reference}</div>}/>}
      </div>
      <div style={{padding:"28px 28px",background:"#fff"}}>{children}</div>
    </div>
  );
}

function MainSection({title,icon,accentColor,children}){
  return(
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:accentColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{icon}</div>
        <div style={{fontSize:11,fontWeight:800,color:accentColor,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'Raleway',sans-serif",borderBottom:`2px solid ${accentColor}`,flex:1,paddingBottom:3}}>{title}</div>
      </div>
      {children}
    </div>
  );
}

function TimelineEntry({startYear,endYear,title,bullets,accentColor,nameStyle}){
  return(
    <div style={{display:"grid",gridTemplateColumns:"58px 1fr",gap:12,marginBottom:12}}>
      <div style={{textAlign:"center"}}>
        {startYear&&<div style={{fontSize:10,fontWeight:700,color:accentColor,lineHeight:1.4}}>{startYear}</div>}
        {endYear&&<div style={{fontSize:10,fontWeight:700,color:accentColor,lineHeight:1.4}}>{endYear}</div>}
      </div>
      <div>
        <div style={{fontWeight:700,fontSize:12.5,...nameStyle}}>{title}</div>
        {parseBullets(bullets).length>0&&<ul style={{paddingLeft:16,marginTop:4}}>
          {parseBullets(bullets).map((b,j)=><li key={j} style={{fontSize:11.5,color:"#374151",lineHeight:1.6,marginBottom:2}}>{b}</li>)}
        </ul>}
      </div>
    </div>
  );
}

/* TEMPLATE 1 – Blue Sidebar */
function BlueSidebar({data}){
  const ac="#1e3a5f";
  return(
    <SidebarLayout sidebarBg="#1e3a5f" sidebarText="#e0f2fe" accentColor="#3b82f6" headerAccent="#93c5fd" data={data}>
      <div style={{marginBottom:20,borderBottom:"3px solid #1e3a5f",paddingBottom:12}}>
        <div style={{fontSize:28,fontWeight:900,color:"#1e3a5f",fontFamily:"'Raleway',sans-serif",letterSpacing:-0.5}}>{data.name||"YOUR NAME"}</div>
        {data.title&&<div style={{fontSize:12.5,fontStyle:"italic",color:"#2563eb",marginTop:4,fontWeight:600}}>{data.title}</div>}
      </div>
      {data.profile&&<MainSection title="Profile" icon="ℹ" accentColor={ac}><p style={{fontSize:12,color:"#374151",lineHeight:1.75}}>{data.profile}</p></MainSection>}
      {data.education?.some(e=>e.institution||e.degree)&&<MainSection title="Education" icon="🎓" accentColor={ac}>
        {data.education.filter(e=>e.institution||e.degree).map((e,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"58px 1fr",gap:12,marginBottom:12}}>
            <div style={{textAlign:"center"}}>
              {e.startYear&&<div style={{fontSize:10,fontWeight:700,color:ac}}>{e.startYear}</div>}
              {e.endYear&&<div style={{fontSize:10,fontWeight:700,color:ac}}>{e.endYear}</div>}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:12.5,color:ac}}>{e.degree||"Degree"}</div>
              <div style={{fontSize:11.5,color:"#2563eb",fontWeight:600}}>{e.institution}</div>
              {e.description&&<div style={{fontSize:11.5,color:"#4b5563",marginTop:2,lineHeight:1.5}}>{e.description}</div>}
              {e.gpa&&<div style={{fontSize:11.5,color:"#374151",marginTop:2}}><strong>GPA:</strong> {e.gpa}</div>}
            </div>
          </div>
        ))}
      </MainSection>}
      {data.experience?.some(e=>e.title)&&<MainSection title="Experience" icon="💼" accentColor={ac}>
        {data.experience.filter(e=>e.title).map((e,i)=><TimelineEntry key={i} {...e} accentColor={ac} nameStyle={{color:ac,fontStyle:"italic"}}/>)}
      </MainSection>}
      {data.projects?.some(p=>p.title)&&<MainSection title="Projects" icon="🚀" accentColor={ac}>
        {data.projects.filter(p=>p.title).map((p,i)=><TimelineEntry key={i} {...p} accentColor={ac} nameStyle={{color:ac}}/>)}
      </MainSection>}
      {data.achievements?.some(a=>a.title)&&<MainSection title="Achievements" icon="🏅" accentColor={ac}>
        {data.achievements.filter(a=>a.title).map((a,i)=>(
          <div key={i} style={{marginBottom:8}}>
            <div style={{fontWeight:700,fontSize:12.5,color:ac}}>{a.title}</div>
            {a.description&&<div style={{fontSize:11.5,color:"#4b5563",lineHeight:1.5}}>{a.description}</div>}
          </div>
        ))}
      </MainSection>}
    </SidebarLayout>
  );
}

/* TEMPLATE 2 – Green Sidebar */
function GreenSidebar({data}){
  const ac="#166534";
  return(
    <SidebarLayout sidebarBg="#14532d" sidebarText="#d1fae5" accentColor="#22c55e" headerAccent="#86efac" data={data}>
      <div style={{marginBottom:20,borderBottom:"3px solid #166534",paddingBottom:12}}>
        <div style={{fontSize:28,fontWeight:900,color:"#14532d",fontFamily:"'Raleway',sans-serif",letterSpacing:-0.5}}>{data.name||"YOUR NAME"}</div>
        {data.title&&<div style={{fontSize:12.5,fontStyle:"italic",color:"#16a34a",marginTop:4,fontWeight:600}}>{data.title}</div>}
      </div>
      {data.profile&&<MainSection title="Profile" icon="ℹ" accentColor={ac}><p style={{fontSize:12,color:"#374151",lineHeight:1.75}}>{data.profile}</p></MainSection>}
      {data.education?.some(e=>e.institution||e.degree)&&<MainSection title="Education" icon="🎓" accentColor={ac}>
        {data.education.filter(e=>e.institution||e.degree).map((e,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"58px 1fr",gap:12,marginBottom:12}}>
            <div style={{textAlign:"center"}}>
              {e.startYear&&<div style={{fontSize:10,fontWeight:700,color:ac}}>{e.startYear}</div>}
              {e.endYear&&<div style={{fontSize:10,fontWeight:700,color:ac}}>{e.endYear}</div>}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:12.5,color:ac}}>{e.degree||"Degree"}</div>
              <div style={{fontSize:11.5,color:"#16a34a",fontWeight:600}}>{e.institution}</div>
              {e.description&&<div style={{fontSize:11.5,color:"#4b5563",marginTop:2,lineHeight:1.5}}>{e.description}</div>}
              {e.gpa&&<div style={{fontSize:11.5,color:"#374151",marginTop:2}}><strong>GPA:</strong> {e.gpa}</div>}
            </div>
          </div>
        ))}
      </MainSection>}
      {data.experience?.some(e=>e.title)&&<MainSection title="Experience" icon="💼" accentColor={ac}>
        {data.experience.filter(e=>e.title).map((e,i)=><TimelineEntry key={i} {...e} accentColor={ac} nameStyle={{color:ac,fontStyle:"italic"}}/>)}
      </MainSection>}
      {data.projects?.some(p=>p.title)&&<MainSection title="Projects" icon="🚀" accentColor={ac}>
        {data.projects.filter(p=>p.title).map((p,i)=><TimelineEntry key={i} {...p} accentColor={ac} nameStyle={{color:ac}}/>)}
      </MainSection>}
    </SidebarLayout>
  );
}

/* TEMPLATE 3 – Dark Pro */
function DarkPro({data}){
  const ac="#a78bfa";
  return(
    <SidebarLayout sidebarBg="#0f172a" sidebarText="#e2e8f0" accentColor="#7c3aed" headerAccent="#a78bfa" data={data}>
      <div style={{marginBottom:20,paddingBottom:12,borderBottom:"3px solid #7c3aed"}}>
        <div style={{fontSize:28,fontWeight:900,color:"#0f172a",fontFamily:"'Raleway',sans-serif",letterSpacing:-0.5}}>{data.name||"YOUR NAME"}</div>
        {data.title&&<div style={{fontSize:12.5,color:"#7c3aed",marginTop:4,fontWeight:700,letterSpacing:0.5}}>{data.title}</div>}
      </div>
      {data.profile&&<MainSection title="Profile" icon="ℹ" accentColor="#7c3aed"><p style={{fontSize:12,color:"#374151",lineHeight:1.75}}>{data.profile}</p></MainSection>}
      {data.education?.some(e=>e.institution||e.degree)&&<MainSection title="Education" icon="🎓" accentColor="#7c3aed">
        {data.education.filter(e=>e.institution||e.degree).map((e,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"58px 1fr",gap:12,marginBottom:12}}>
            <div style={{textAlign:"center"}}>
              {e.startYear&&<div style={{fontSize:10,fontWeight:700,color:ac}}>{e.startYear}</div>}
              {e.endYear&&<div style={{fontSize:10,fontWeight:700,color:ac}}>{e.endYear}</div>}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:12.5,color:"#0f172a"}}>{e.degree||"Degree"}</div>
              <div style={{fontSize:11.5,color:"#7c3aed",fontWeight:600}}>{e.institution}</div>
              {e.description&&<div style={{fontSize:11.5,color:"#4b5563",marginTop:2,lineHeight:1.5}}>{e.description}</div>}
              {e.gpa&&<div style={{fontSize:11.5,color:"#374151",marginTop:2}}><strong>GPA:</strong> {e.gpa}</div>}
            </div>
          </div>
        ))}
      </MainSection>}
      {data.experience?.some(e=>e.title)&&<MainSection title="Experience" icon="💼" accentColor="#7c3aed">
        {data.experience.filter(e=>e.title).map((e,i)=><TimelineEntry key={i} {...e} accentColor="#7c3aed" nameStyle={{color:"#0f172a",fontStyle:"italic"}}/>)}
      </MainSection>}
      {data.projects?.some(p=>p.title)&&<MainSection title="Projects" icon="🚀" accentColor="#7c3aed">
        {data.projects.filter(p=>p.title).map((p,i)=><TimelineEntry key={i} {...p} accentColor="#7c3aed" nameStyle={{color:"#0f172a"}}/>)}
      </MainSection>}
    </SidebarLayout>
  );
}

/* TEMPLATE 4 – Minimal Clean (no sidebar, ATS-friendly) */
function MinimalClean({data}){
  const ac="#1e293b";
  const MSection = ({title,children}) => (
    <div style={{marginBottom:18}}>
      <div style={{fontSize:11,fontWeight:800,color:ac,letterSpacing:1.5,textTransform:"uppercase",borderBottom:"1.5px solid #1e293b",paddingBottom:4,marginBottom:10,fontFamily:"'Raleway',sans-serif"}}>{title}</div>
      {children}
    </div>
  );
  return(
    <div style={{fontFamily:"'Open Sans',sans-serif",background:"#fff",padding:"36px 40px"}}>
      <div style={{textAlign:"center",marginBottom:22,paddingBottom:16,borderBottom:"2px solid #1e293b"}}>
        {data.photo&&<img src={data.photo} alt="profile" style={{width:70,height:70,borderRadius:"50%",objectFit:"cover",border:"2px solid #1e293b",marginBottom:10,display:"block",margin:"0 auto 10px"}}/>}
        <div style={{fontSize:28,fontWeight:900,color:ac,fontFamily:"'Raleway',sans-serif",letterSpacing:-0.5}}>{data.name||"YOUR NAME"}</div>
        {data.title&&<div style={{fontSize:12.5,color:"#64748b",marginTop:4}}>{data.title}</div>}
        <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",fontSize:11.5,color:"#475569",marginTop:10}}>
          {data.email&&<span>✉ {data.email}</span>}
          {data.phone&&<span>📞 {data.phone}</span>}
          {data.location&&<span>📍 {data.location}</span>}
          {data.linkedin&&<span>in {data.linkedin}</span>}
          {data.github&&<span>⌥ {data.github}</span>}
        </div>
      </div>
      {data.profile&&<MSection title="Summary"><p style={{fontSize:12,color:"#374151",lineHeight:1.75}}>{data.profile}</p></MSection>}
      {data.experience?.some(e=>e.title)&&<MSection title="Experience">
        {data.experience.filter(e=>e.title).map((e,i)=>(
          <div key={i} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{fontWeight:700,fontSize:12.5,color:ac}}>{e.title}</div>
              {(e.startYear||e.endYear)&&<div style={{fontSize:11,color:"#64748b",whiteSpace:"nowrap"}}>{e.startYear} – {e.endYear}</div>}
            </div>
            {parseBullets(e.bullets).length>0&&<ul style={{paddingLeft:16,marginTop:4}}>
              {parseBullets(e.bullets).map((b,j)=><li key={j} style={{fontSize:11.5,color:"#4b5563",lineHeight:1.6,marginBottom:2}}>{b}</li>)}
            </ul>}
          </div>
        ))}
      </MSection>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {data.skills?.some(s=>s.items)&&<MSection title="Skills">
          {data.skills.filter(s=>s.items).map((s,i)=>(
            <div key={i} style={{marginBottom:8}}>
              {s.category&&<div style={{fontSize:11,fontWeight:700,color:"#334155",marginBottom:4}}>{s.category}</div>}
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {s.items.split(",").map(sk=>sk.trim()).filter(Boolean).map((sk,j)=>(
                  <span key={j} style={{background:"#f1f5f9",border:"1px solid #cbd5e1",color:"#1e293b",borderRadius:4,padding:"2px 8px",fontSize:11}}>{sk}</span>
                ))}
              </div>
            </div>
          ))}
        </MSection>}
        {data.education?.some(e=>e.institution)&&<MSection title="Education">
          {data.education.filter(e=>e.institution).map((e,i)=>(
            <div key={i} style={{marginBottom:9}}>
              <div style={{fontWeight:700,fontSize:12,color:ac}}>{e.degree}</div>
              <div style={{fontSize:11.5,color:"#475569"}}>{e.institution}</div>
              <div style={{fontSize:11,color:"#64748b"}}>{e.startYear} – {e.endYear}{e.gpa&&` · ${e.gpa}`}</div>
            </div>
          ))}
        </MSection>}
      </div>
      {data.projects?.some(p=>p.title)&&<MSection title="Projects">
        {data.projects.filter(p=>p.title).map((p,i)=>(
          <div key={i} style={{marginBottom:10}}>
            <div style={{fontWeight:700,fontSize:12.5,color:ac}}>{p.title}</div>
            {parseBullets(p.bullets).length>0&&<ul style={{paddingLeft:16,marginTop:3}}>
              {parseBullets(p.bullets).map((b,j)=><li key={j} style={{fontSize:11.5,color:"#4b5563",lineHeight:1.6,marginBottom:2}}>{b}</li>)}
            </ul>}
          </div>
        ))}
      </MSection>}
    </div>
  );
}

/* TEMPLATE 5 – Modern Split (purple) */
function ModernSplit({data}){
  const ac="#7c3aed";
  return(
    <SidebarLayout sidebarBg="#4c1d95" sidebarText="#ede9fe" accentColor="#a78bfa" headerAccent="#c4b5fd" data={data}>
      <div style={{marginBottom:20,paddingBottom:12,borderBottom:"3px solid #7c3aed"}}>
        <div style={{fontSize:26,fontWeight:900,color:"#4c1d95",fontFamily:"'Playfair Display',serif",letterSpacing:-0.3}}>{data.name||"Your Name"}</div>
        {data.title&&<div style={{fontSize:12.5,color:ac,marginTop:4,fontWeight:600,letterSpacing:0.3}}>{data.title}</div>}
      </div>
      {data.profile&&<MainSection title="About" icon="✦" accentColor={ac}><p style={{fontSize:12,color:"#374151",lineHeight:1.75,fontStyle:"italic"}}>{data.profile}</p></MainSection>}
      {data.experience?.some(e=>e.title)&&<MainSection title="Experience" icon="💼" accentColor={ac}>
        {data.experience.filter(e=>e.title).map((e,i)=><TimelineEntry key={i} {...e} accentColor={ac} nameStyle={{color:"#4c1d95",fontWeight:700}}/>)}
      </MainSection>}
      {data.education?.some(e=>e.institution||e.degree)&&<MainSection title="Education" icon="🎓" accentColor={ac}>
        {data.education.filter(e=>e.institution||e.degree).map((e,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"58px 1fr",gap:12,marginBottom:12}}>
            <div style={{textAlign:"center"}}>
              {e.startYear&&<div style={{fontSize:10,fontWeight:700,color:ac}}>{e.startYear}</div>}
              {e.endYear&&<div style={{fontSize:10,fontWeight:700,color:ac}}>{e.endYear}</div>}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:12.5,color:"#4c1d95"}}>{e.degree||"Degree"}</div>
              <div style={{fontSize:11.5,color:ac,fontWeight:600}}>{e.institution}</div>
              {e.gpa&&<div style={{fontSize:11.5,color:"#374151",marginTop:2}}><strong>GPA:</strong> {e.gpa}</div>}
            </div>
          </div>
        ))}
      </MainSection>}
      {data.projects?.some(p=>p.title)&&<MainSection title="Projects" icon="🚀" accentColor={ac}>
        {data.projects.filter(p=>p.title).map((p,i)=><TimelineEntry key={i} {...p} accentColor={ac} nameStyle={{color:"#4c1d95"}}/>)}
      </MainSection>}
    </SidebarLayout>
  );
}

/* TEMPLATE 6 – Bold Red */
function RedBold({data}){
  const ac="#991b1b";
  return(
    <SidebarLayout sidebarBg="#7f1d1d" sidebarText="#fee2e2" accentColor="#ef4444" headerAccent="#fca5a5" data={data}>
      <div style={{marginBottom:20,paddingBottom:12,borderBottom:"3px solid #991b1b"}}>
        <div style={{fontSize:28,fontWeight:900,color:"#7f1d1d",fontFamily:"'Raleway',sans-serif",letterSpacing:-0.5}}>{data.name||"YOUR NAME"}</div>
        {data.title&&<div style={{fontSize:12.5,color:ac,marginTop:4,fontWeight:700}}>{data.title}</div>}
      </div>
      {data.profile&&<MainSection title="Profile" icon="ℹ" accentColor={ac}><p style={{fontSize:12,color:"#374151",lineHeight:1.75}}>{data.profile}</p></MainSection>}
      {data.experience?.some(e=>e.title)&&<MainSection title="Experience" icon="💼" accentColor={ac}>
        {data.experience.filter(e=>e.title).map((e,i)=><TimelineEntry key={i} {...e} accentColor={ac} nameStyle={{color:"#7f1d1d",fontStyle:"italic"}}/>)}
      </MainSection>}
      {data.education?.some(e=>e.institution||e.degree)&&<MainSection title="Education" icon="🎓" accentColor={ac}>
        {data.education.filter(e=>e.institution||e.degree).map((e,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"58px 1fr",gap:12,marginBottom:12}}>
            <div style={{textAlign:"center"}}>
              {e.startYear&&<div style={{fontSize:10,fontWeight:700,color:ac}}>{e.startYear}</div>}
              {e.endYear&&<div style={{fontSize:10,fontWeight:700,color:ac}}>{e.endYear}</div>}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:12.5,color:"#7f1d1d"}}>{e.degree||"Degree"}</div>
              <div style={{fontSize:11.5,color:ac,fontWeight:600}}>{e.institution}</div>
              {e.gpa&&<div style={{fontSize:11.5,color:"#374151",marginTop:2}}><strong>GPA:</strong> {e.gpa}</div>}
            </div>
          </div>
        ))}
      </MainSection>}
      {data.projects?.some(p=>p.title)&&<MainSection title="Projects" icon="🚀" accentColor={ac}>
        {data.projects.filter(p=>p.title).map((p,i)=><TimelineEntry key={i} {...p} accentColor={ac} nameStyle={{color:"#7f1d1d"}}/>)}
      </MainSection>}
    </SidebarLayout>
  );
}

const RENDERERS = { blueSidebar:BlueSidebar, greenSidebar:GreenSidebar, darkPro:DarkPro, minimalClean:MinimalClean, modernSplit:ModernSplit, redBold:RedBold };
function ResumeRender({data,tpl}){
  const Comp = RENDERERS[tpl]||BlueSidebar;
  return <Comp data={data}/>;
}

/* ══════════════════════════════════════════════════════════════════
   AI RESUME ANALYZER (rule-based, no API)
══════════════════════════════════════════════════════════════════ */
const TECH_KEYWORDS = ["javascript","python","react","node","java","sql","html","css","typescript",
  "aws","docker","kubernetes","git","mongodb","postgresql","rest","api","agile","scrum","linux",
  "machine learning","data analysis","cloud","devops","ci/cd","testing","angular","vue","php","c++",
  "c#",".net","spring","django","flask","tensorflow","pytorch","graphql","microservices"];

const ACTION_VERBS = ["led","built","developed","implemented","created","designed","managed","improved",
  "increased","reduced","delivered","launched","optimized","automated","streamlined","achieved",
  "collaborated","coordinated","established","generated"];

function analyzeResume(text) {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const wordCount = words.length;

  // Section detection
  const hasEmail = /[\w.-]+@[\w.-]+\.\w{2,}/.test(text);
  const hasPhone = /(\+?\d[\d\s\-().]{7,})/.test(text);
  const hasSummary = /summary|profile|objective|about/i.test(text);
  const hasExperience = /experience|work|employment|intern/i.test(text);
  const hasEducation = /education|degree|university|college|bachelor|master/i.test(text);
  const hasSkills = /skills|technologies|tools|stack/i.test(text);
  const hasProjects = /project/i.test(text);
  const hasCerts = /certif|certificate|certification/i.test(text);
  const hasAchievements = /achievement|award|honor|recognition/i.test(text);
  const hasLinkedIn = /linkedin/i.test(text);
  const hasGithub = /github/i.test(text);

  // Keyword matching
  const matchedKeywords = TECH_KEYWORDS.filter(kw => lower.includes(kw));
  const keywordMatch = Math.min(100, Math.round((matchedKeywords.length / 15) * 100));

  // Action verbs
  const matchedVerbs = ACTION_VERBS.filter(v => lower.includes(v));
  const verbScore = Math.min(100, Math.round((matchedVerbs.length / 8) * 100));

  // Measurable achievements
  const hasMeasurables = /\d+%|\d+x|increased by|reduced by|\$[\d,]+|million|thousand/i.test(text);

  // Length check
  const lengthScore = wordCount < 100 ? 20 : wordCount < 200 ? 50 : wordCount < 400 ? 80 : 100;

  // Section scores
  const contactScore = ((hasEmail?25:0)+(hasPhone?25:0)+(hasLinkedIn?25:0)+(hasGithub?25:0));
  const summaryScore = hasSummary ? (wordCount > 200 ? 80 : 60) : 10;
  const expScore = hasExperience ? (matchedVerbs.length>=3?90:matchedVerbs.length>=1?70:50) : 10;
  const eduScore = hasEducation ? 85 : 20;
  const skillsScore = hasSkills ? (matchedKeywords.length>=8?90:matchedKeywords.length>=4?70:50) : 10;
  const projectScore = hasProjects ? (matchedKeywords.length>=4?80:55) : 20;

  // ATS score
  const atsScore = Math.round(
    (hasEmail?10:0)+(hasPhone?10:0)+(hasSkills?15:0)+
    (hasExperience?15:0)+(hasEducation?10:0)+
    Math.min(20,(matchedKeywords.length/15)*20)+
    Math.min(10,(matchedVerbs.length/8)*10)+
    (wordCount>200?10:5)
  );

  // Content score
  const contentScore = Math.round(
    ((hasSummary?15:0)+(hasMeasurables?20:0)+
    Math.min(25,(matchedVerbs.length/8)*25)+
    (hasProjects?15:0)+(hasCerts?10:0)+(hasAchievements?15:0)) * 1.1
  );

  // Overall
  const overallScore = Math.min(100,Math.round(
    atsScore*0.3 + Math.min(100,contentScore)*0.25 +
    skillsScore*0.2 + expScore*0.15 + contactScore*0.1
  ));

  // Issues
  const criticalIssues = [];
  const warnings = [];
  const suggestions = [];

  if(!hasEmail) criticalIssues.push({type:"critical",text:"Missing email address — recruiters need to contact you."});
  if(!hasPhone) criticalIssues.push({type:"critical",text:"Missing phone number — critical for recruiter outreach."});
  if(!hasExperience) criticalIssues.push({type:"critical",text:"No experience section detected — this is a core resume section."});
  if(!hasSkills) criticalIssues.push({type:"critical",text:"No skills section found — ATS systems rely heavily on this."});
  if(!hasSummary) warnings.push({type:"warning",text:"No professional summary — add a 3-4 sentence intro at the top."});
  if(!hasProjects) warnings.push({type:"warning",text:"No projects section — especially important for students & freshers."});
  if(wordCount<150) warnings.push({type:"warning",text:`Resume is very short (${wordCount} words) — aim for 300–600 words.`});
  if(matchedKeywords.length<5) warnings.push({type:"warning",text:"Low keyword density — ATS may rank you lower than competitors."});
  if(matchedVerbs.length<3) warnings.push({type:"warning",text:"Weak action verbs — use words like 'Led', 'Built', 'Optimized'."});
  if(!hasMeasurables) suggestions.push({type:"suggestion",text:"Add measurable achievements (e.g. 'Improved speed by 40%')."});
  if(!hasCerts) suggestions.push({type:"suggestion",text:"Include certifications to stand out (AWS, Google, etc.)."});
  if(!hasLinkedIn) suggestions.push({type:"suggestion",text:"Add your LinkedIn profile URL for professional credibility."});
  if(!hasGithub) suggestions.push({type:"suggestion",text:"Add your GitHub profile to showcase your code."});
  if(!hasAchievements) suggestions.push({type:"suggestion",text:"Add an achievements section to highlight awards/honors."});
  suggestions.push({type:"suggestion",text:"Tailor your resume keywords to each specific job description."});
  suggestions.push({type:"suggestion",text:"Use consistent date formatting throughout (e.g. Jan 2023 – Present)."});

  const grade = overallScore>=90?"A+":overallScore>=80?"A":overallScore>=70?"B+":overallScore>=60?"B":overallScore>=50?"C+":"C";

  return {
    overallScore, atsScore: Math.min(100,atsScore),
    contentScore: Math.min(100,contentScore),
    skillsScore, expScore, contactScore,
    keywordMatch, verbScore, wordCount,
    grade,
    sections:{contact:contactScore,summary:summaryScore,experience:expScore,education:eduScore,skills:skillsScore,projects:projectScore},
    matchedKeywords: matchedKeywords.slice(0,12),
    missingKeywords: TECH_KEYWORDS.filter(k=>!lower.includes(k)).slice(0,8),
    matchedVerbs,
    issues:[...criticalIssues,...warnings,...suggestions],
    criticalCount:criticalIssues.length,
    warningCount:warnings.length,
    suggestionCount:suggestions.length,
    strengths:[
      hasEmail&&hasPhone&&"Complete contact information provided",
      hasExperience&&matchedVerbs.length>=2&&"Uses strong action verbs in experience",
      matchedKeywords.length>=6&&`${matchedKeywords.length} industry keywords detected`,
      hasProjects&&"Projects section boosts fresher/student profiles",
      hasMeasurables&&"Includes measurable achievements — excellent!",
      hasEducation&&"Education section is present",
    ].filter(Boolean).slice(0,4),
  };
}

const SCAN_STEPS = [
  "Reading resume content…",
  "Extracting personal information…",
  "Analyzing skills & keywords…",
  "Checking ATS compatibility…",
  "Reviewing experience section…",
  "Detecting missing sections…",
  "Measuring keyword density…",
  "Generating recommendations…",
];

function AIAnalyzer({ onClose }) {
  const [stage, setStage] = useState("upload"); // upload | scanning | results
  const [scanStep, setScanStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const runScan = useCallback((text) => {
    setStage("scanning");
    setScanStep(0);
    setCompletedSteps([]);
    let step = 0;
    const interval = setInterval(() => {
      setCompletedSteps(prev => [...prev, step]);
      step++;
      setScanStep(step);
      if (step >= SCAN_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          setResult(analyzeResume(text));
          setStage("results");
        }, 500);
      }
    }, 500);
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => runScan(e.target.result || "");
    reader.readAsText(file);
  };

  const scoreColor = s => s>=80?"#16a34a":s>=60?"#d97706":s>=40?"#f97316":"#dc2626";
  const scoreLabel = s => s>=85?"Excellent":s>=70?"Good":s>=55?"Fair":"Needs Work";

  // Circular score ring
  const Ring = ({score,size=90,stroke=8,label}) => {
    const r = (size-stroke*2)/2;
    const circ = 2*Math.PI*r;
    const dash = (score/100)*circ;
    const col = scoreColor(score);
    return(
      <div style={{textAlign:"center"}}>
        <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{transition:"stroke-dasharray 1s ease"}}/>
        </svg>
        <div style={{marginTop:-size/2-8,position:"relative",zIndex:1,transform:`translateY(-${size/2-8}px)`}}>
          <div style={{fontSize:size>80?20:14,fontWeight:900,color:col,lineHeight:1}}>{score}</div>
          <div style={{fontSize:9.5,color:"#64748b"}}>/ 100</div>
        </div>
        {label&&<div style={{fontSize:11,fontWeight:700,color:"#334155",marginTop:4}}>{label}</div>}
      </div>
    );
  };

  const ProgressBar = ({value,color}) => (
    <div style={{height:6,background:"#f1f5f9",borderRadius:99,overflow:"hidden",marginTop:4}}>
      <div style={{height:"100%",width:`${value}%`,background:color||scoreColor(value),borderRadius:99,transition:"width 1s ease"}}/>
    </div>
  );

  return(
    <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(15,23,42,0.6)",backdropFilter:"blur(4px)"}}/>
      <div className="bounce-in" style={{position:"relative",width:"100%",maxWidth:860,maxHeight:"92vh",background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,0.25)",display:"flex",flexDirection:"column"}}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",padding:"18px 24px",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🤖</div>
            <div>
              <div style={{fontSize:17,fontWeight:800,color:"#fff",fontFamily:"'Raleway',sans-serif"}}>AI Resume Analyzer</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>Advanced rule-based analysis · No API required</div>
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,width:32,height:32,color:"#fff",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        <div style={{overflowY:"auto",flex:1,padding:"24px"}}>

          {/* UPLOAD */}
          {stage==="upload"&&(
            <div className="fade-in" style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:52,marginBottom:12}}>📄</div>
              <h3 style={{fontSize:20,fontWeight:800,color:"#1e293b",marginBottom:8,fontFamily:"'Raleway',sans-serif"}}>Upload Your Resume</h3>
              <p style={{color:"#64748b",fontSize:14,lineHeight:1.7,maxWidth:460,margin:"0 auto 28px"}}>Upload a plain text (.txt) or markdown file of your resume. Our AI engine will scan every section and provide a detailed score with actionable feedback.</p>
              <div
                onClick={()=>fileRef.current?.click()}
                onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
                onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                onDragLeave={()=>setDragOver(false)}
                style={{
                  maxWidth:440,margin:"0 auto 20px",border:`2px dashed ${dragOver?"#2563eb":"#93c5fd"}`,
                  borderRadius:14,padding:"36px 24px",cursor:"pointer",
                  background:dragOver?"#eff6ff":"#f8fafc",transition:"all 0.2s"
                }}>
                <div style={{fontSize:36,marginBottom:12}}>📁</div>
                <div style={{fontWeight:700,fontSize:14,color:"#1e293b",marginBottom:4}}>Click to upload or drag & drop</div>
                <div style={{fontSize:12,color:"#64748b"}}>TXT, MD files supported · Max 5MB</div>
              </div>
              <input ref={fileRef} type="file" accept=".txt,.md,.csv" onChange={e=>handleFile(e.target.files[0])} style={{display:"none"}}/>
              <div style={{marginTop:16,padding:"12px 20px",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,maxWidth:440,margin:"16px auto 0",fontSize:12.5,color:"#1e40af",lineHeight:1.6}}>
                💡 <strong>Tip:</strong> Copy your resume text into a .txt file and upload it for the most accurate analysis.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,maxWidth:500,margin:"24px auto 0"}}>
                {[["🎯","ATS Check","Keyword & structure scan"],["📊","Full Scoring","6-dimension analysis"],["⚡","Quick Fixes","Prioritized action items"]].map(([ic,t,d])=>(
                  <div key={t} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px 12px",textAlign:"center"}}>
                    <div style={{fontSize:22,marginBottom:5}}>{ic}</div>
                    <div style={{fontSize:11.5,fontWeight:700,color:"#1e293b",marginBottom:3}}>{t}</div>
                    <div style={{fontSize:11,color:"#64748b",lineHeight:1.4}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCANNING */}
          {stage==="scanning"&&(
            <div className="fade-in" style={{textAlign:"center",padding:"24px 0"}}>
              {/* Animated scan graphic */}
              <div style={{position:"relative",width:120,height:120,margin:"0 auto 24px"}}>
                <svg viewBox="0 0 120 120" style={{animation:"spin 2s linear infinite"}}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#dbeafe" strokeWidth="8"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#2563eb" strokeWidth="8" strokeDasharray="80 235" strokeLinecap="round"/>
                </svg>
                <svg viewBox="0 0 120 120" style={{position:"absolute",top:0,left:0,animation:"spin 1.4s linear infinite reverse"}}>
                  <circle cx="60" cy="60" r="38" fill="none" stroke="#bfdbfe" strokeWidth="5"/>
                  <circle cx="60" cy="60" r="38" fill="none" stroke="#60a5fa" strokeWidth="5" strokeDasharray="40 199" strokeLinecap="round"/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🤖</div>
              </div>
              <div style={{fontSize:18,fontWeight:800,color:"#1e293b",marginBottom:6,fontFamily:"'Raleway',sans-serif"}}>Analyzing Your Resume…</div>
              <div style={{color:"#64748b",fontSize:13,marginBottom:28}}>Advanced AI engine scanning every section</div>
              <div style={{maxWidth:420,margin:"0 auto"}}>
                {SCAN_STEPS.map((step,i)=>{
                  const done = completedSteps.includes(i);
                  const active = scanStep===i;
                  return(
                    <div key={i} style={{
                      display:"flex",alignItems:"center",gap:12,padding:"9px 14px",
                      background:done?"#f0fdf4":active?"#eff6ff":"#f8fafc",
                      border:`1px solid ${done?"#bbf7d0":active?"#bfdbfe":"#e2e8f0"}`,
                      borderRadius:9,marginBottom:7,
                      animation:active||done?`fadeIn 0.3s ease both`:"none",
                      transition:"all 0.3s ease"
                    }}>
                      <div style={{
                        width:22,height:22,borderRadius:"50%",flexShrink:0,
                        background:done?"#16a34a":active?"#2563eb":"#e2e8f0",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:11,color:"#fff",
                        animation:active?"pulse 1s ease infinite":"none"
                      }}>
                        {done?"✓":active?"●":i+1}
                      </div>
                      <span style={{fontSize:12.5,color:done?"#166534":active?"#1e40af":"#94a3b8",fontWeight:done||active?600:400}}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RESULTS */}
          {stage==="results"&&result&&(
            <div className="fade-in">
              {/* Top Score Row */}
              <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:24,background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:16,padding:"20px 24px",marginBottom:20,alignItems:"center"}}>
                <div style={{textAlign:"center"}}>
                  {/* Big ring */}
                  <div style={{position:"relative",display:"inline-block"}}>
                    <svg width={110} height={110} style={{transform:"rotate(-90deg)"}}>
                      <circle cx={55} cy={55} r={42} fill="none" stroke="#f0f0f0" strokeWidth={10}/>
                      <circle cx={55} cy={55} r={42} fill="none" stroke={scoreColor(result.overallScore)} strokeWidth={10}
                        strokeDasharray={`${(result.overallScore/100)*(2*Math.PI*42)} ${2*Math.PI*42}`} strokeLinecap="round"
                        style={{transition:"stroke-dasharray 1.5s ease"}}/>
                    </svg>
                    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                      <div style={{fontSize:24,fontWeight:900,color:scoreColor(result.overallScore),lineHeight:1}}>{result.overallScore}</div>
                      <div style={{fontSize:9,color:"#94a3b8",marginTop:1}}>/100</div>
                    </div>
                  </div>
                  <div style={{fontSize:18,fontWeight:900,color:scoreColor(result.overallScore),marginTop:4}}>{result.grade}</div>
                  <div style={{fontSize:11,color:"#64748b"}}>{scoreLabel(result.overallScore)}</div>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:800,color:"#1e293b",marginBottom:14,fontFamily:"'Raleway',sans-serif"}}>Overall Resume Score</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {[["ATS Score",result.atsScore],["Content Score",result.contentScore],["Skills Score",result.skillsScore],["Experience",result.expScore]].map(([l,v])=>(
                      <div key={l} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 13px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                          <span style={{fontSize:11.5,color:"#475569",fontWeight:600}}>{l}</span>
                          <span style={{fontSize:13,fontWeight:800,color:scoreColor(v)}}>{v}</span>
                        </div>
                        <ProgressBar value={v}/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
                {[
                  ["🔑","Keyword Match",`${result.keywordMatch}%`,"#2563eb"],
                  ["📊","ATS Score",`${result.atsScore}/100`,"#16a34a"],
                  ["⚠️","Issues Found",`${result.issues.length}`,"#d97706"],
                  ["📝","Word Count",`${result.wordCount}`,"#7c3aed"],
                ].map(([ic,l,v,c])=>(
                  <div key={l} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 12px",textAlign:"center"}}>
                    <div style={{fontSize:20,marginBottom:5}}>{ic}</div>
                    <div style={{fontSize:18,fontWeight:900,color:c,marginBottom:2}}>{v}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Sub-tabs */}
              <div style={{display:"flex",gap:3,background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:10,padding:3,marginBottom:18}}>
                {[["overview","📊 Overview"],["issues","🚨 Issues"],["sections","📋 Sections"],["keywords","🔑 Keywords"]].map(([id,label])=>(
                  <button key={id} onClick={()=>setActiveTab(id)} style={{
                    flex:1,padding:"8px 6px",borderRadius:8,border:"none",fontSize:12,fontWeight:700,
                    background:activeTab===id?"#1e3a5f":"transparent",
                    color:activeTab===id?"#fff":"#64748b",transition:"all 0.2s"
                  }}>{label}</button>
                ))}
              </div>

              {/* TAB: OVERVIEW */}
              {activeTab==="overview"&&(
                <div className="fade-in">
                  {result.strengths.length>0&&<div style={{marginBottom:16}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#475569",marginBottom:9,textTransform:"uppercase",letterSpacing:0.7}}>✅ Strengths Detected</div>
                    {result.strengths.map((s,i)=>(
                      <div key={i} style={{display:"flex",gap:10,padding:"10px 14px",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:9,marginBottom:7}}>
                        <div style={{width:20,height:20,borderRadius:"50%",background:"#16a34a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0}}>✓</div>
                        <span style={{fontSize:13,color:"#166534",lineHeight:1.6}}>{s}</span>
                      </div>
                    ))}
                  </div>}
                  {/* ATS gauge */}
                  <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px 18px",marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{fontWeight:700,fontSize:13,color:"#1e293b"}}>ATS Compatibility Gauge</div>
                      <span style={{fontSize:14,fontWeight:900,color:scoreColor(result.atsScore)}}>{result.atsScore}%</span>
                    </div>
                    <div style={{height:14,background:"#f1f5f9",borderRadius:99,overflow:"hidden",position:"relative"}}>
                      <div style={{height:"100%",width:`${result.atsScore}%`,background:`linear-gradient(90deg,${scoreColor(result.atsScore)},${scoreColor(result.atsScore)}aa)`,borderRadius:99,transition:"width 1.2s ease"}}/>
                      {[25,50,75].map(m=><div key={m} style={{position:"absolute",top:0,bottom:0,left:`${m}%`,width:1,background:"rgba(255,255,255,0.6)"}}/>)}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#94a3b8",marginTop:5}}>
                      <span>Needs Work</span><span>Fair</span><span>Good</span><span>Excellent</span>
                    </div>
                  </div>
                  {/* Quick wins */}
                  <div style={{fontSize:12,fontWeight:700,color:"#475569",marginBottom:9,textTransform:"uppercase",letterSpacing:0.7}}>⚡ Top Quick Wins</div>
                  {result.issues.filter(i=>i.type==="suggestion").slice(0,3).map((w,i)=>(
                    <div key={i} style={{display:"flex",gap:10,padding:"10px 14px",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:9,marginBottom:7}}>
                      <span style={{fontSize:14,flexShrink:0}}>💡</span>
                      <span style={{fontSize:12.5,color:"#92400e",lineHeight:1.6}}>{w.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: ISSUES */}
              {activeTab==="issues"&&(
                <div className="fade-in">
                  <div style={{display:"flex",gap:10,marginBottom:14}}>
                    {[["🔴","Critical",result.criticalCount,"#fee2e2","#dc2626"],["🟡","Warnings",result.warningCount,"#fffbeb","#d97706"],["🔵","Suggestions",result.suggestionCount,"#eff6ff","#2563eb"]].map(([ic,l,c,bg,col])=>(
                      <div key={l} style={{flex:1,background:bg,border:`1px solid ${col}44`,borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
                        <div style={{fontSize:18}}>{ic}</div>
                        <div style={{fontSize:18,fontWeight:900,color:col}}>{c}</div>
                        <div style={{fontSize:11,color:col,fontWeight:600}}>{l}</div>
                      </div>
                    ))}
                  </div>
                  {result.issues.map((issue,i)=>{
                    const cfg = issue.type==="critical"
                      ? {bg:"#fef2f2",border:"#fecaca",badge:"#dc2626",label:"CRITICAL"}
                      : issue.type==="warning"
                      ? {bg:"#fffbeb",border:"#fde68a",badge:"#d97706",label:"WARNING"}
                      : {bg:"#eff6ff",border:"#bfdbfe",badge:"#2563eb",label:"TIP"};
                    return(
                      <div key={i} style={{background:cfg.bg,border:`1.5px solid ${cfg.border}`,borderRadius:11,padding:"13px 16px",marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>
                        <span style={{background:cfg.badge,color:"#fff",borderRadius:99,padding:"2px 8px",fontSize:9.5,fontWeight:800,letterSpacing:0.5,flexShrink:0,marginTop:2}}>{cfg.label}</span>
                        <span style={{fontSize:13,color:"#1e293b",lineHeight:1.6}}>{issue.text}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB: SECTIONS */}
              {activeTab==="sections"&&(
                <div className="fade-in">
                  {Object.entries(result.sections).map(([sec,score])=>(
                    <div key={sec} style={{marginBottom:12,padding:"14px 16px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:11}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                        <div style={{fontWeight:700,fontSize:13,color:"#1e293b",textTransform:"capitalize"}}>{sec}</div>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:90,height:6,background:"#f1f5f9",borderRadius:99,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${score}%`,background:scoreColor(score),borderRadius:99,transition:"width 1s ease"}}/>
                          </div>
                          <span style={{fontSize:13,fontWeight:800,color:scoreColor(score),minWidth:26}}>{score}</span>
                        </div>
                      </div>
                      <div style={{fontSize:11.5,color:"#64748b"}}>
                        {score>=80?"✅ Well structured and complete":score>=60?"⚠️ Needs more detail or keywords":"❌ Missing or very weak — priority fix needed"}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: KEYWORDS */}
              {activeTab==="keywords"&&(
                <div className="fade-in">
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#475569",marginBottom:10,textTransform:"uppercase",letterSpacing:0.7}}>✅ Detected Keywords ({result.matchedKeywords.length})</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {result.matchedKeywords.map((kw,i)=>(
                        <span key={i} style={{background:"#f0fdf4",border:"1.5px solid #86efac",color:"#166534",borderRadius:99,padding:"6px 14px",fontSize:12.5,fontWeight:600}}>✓ {kw}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#475569",marginBottom:10,textTransform:"uppercase",letterSpacing:0.7}}>❌ Missing Keywords ({result.missingKeywords.length}+)</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {result.missingKeywords.map((kw,i)=>(
                        <span key={i} style={{background:"#fef2f2",border:"1.5px solid #fecaca",color:"#991b1b",borderRadius:99,padding:"6px 14px",fontSize:12.5,fontWeight:600}}>+ {kw}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{background:"#eff6ff",border:"1.5px solid #bfdbfe",borderRadius:12,padding:"14px 16px"}}>
                    <div style={{fontWeight:700,color:"#1e40af",fontSize:12.5,marginBottom:6}}>💡 Keyword Strategy</div>
                    <ul style={{fontSize:12.5,color:"#1e3a8a",lineHeight:1.8,paddingLeft:18}}>
                      <li>Mirror exact keywords from job descriptions you're targeting</li>
                      <li>Add missing technical keywords to your Skills section</li>
                      <li>Use keywords naturally in experience bullet points</li>
                      <li>Avoid keyword stuffing — quality context matters</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {stage==="results"&&(
          <div style={{borderTop:"1.5px solid #e2e8f0",padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",flexShrink:0}}>
            <span style={{fontSize:11.5,color:"#64748b"}}>Rule-based analysis · {new Date().toLocaleDateString()}</span>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setStage("upload");setResult(null);}} style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:8,padding:"7px 16px",fontSize:12.5,fontWeight:700,color:"#475569"}}>Re-upload</button>
              <button onClick={onClose} style={{background:"#1e3a5f",color:"#fff",border:"none",borderRadius:8,padding:"7px 18px",fontSize:12.5,fontWeight:700}}>Apply Feedback →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   REPEAT SECTION EDITOR
══════════════════════════════════════════════════════════════════ */
function RepeatSection({label,items,onChange,fields}){
  const add = () => { const b={id:uid()}; fields.forEach(f=>{b[f.key]="";}); onChange([...items,b]); };
  const remove = id => onChange(items.filter(i=>i.id!==id));
  const update = (id,key,val) => onChange(items.map(i=>i.id===id?{...i,[key]:val}:i));
  return(
    <div>
      {items.map((item,idx)=>(
        <div key={item.id} style={{background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:10,padding:"14px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:11,fontWeight:700,color:"#1e3a5f",background:"#dbeafe",borderRadius:99,padding:"2px 10px"}}>{label} {idx+1}</span>
            {items.length>1&&<button onClick={()=>remove(item.id)} style={{background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:6,padding:"3px 9px",fontSize:11,fontWeight:700}}>✕</button>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:fields.length>2?"1fr 1fr":"1fr",gap:"8px 12px"}}>
            {fields.map(f=>(
              <div key={f.key} style={{gridColumn:f.full?"1/-1":"auto"}}>
                <label>{f.label}</label>
                {f.type==="textarea"
                  ? <textarea rows={3} value={item[f.key]||""} onChange={e=>update(item.id,f.key,e.target.value)} placeholder={f.placeholder||""}/>
                  : f.type==="select"
                  ? <select value={item[f.key]||""} onChange={e=>update(item.id,f.key,e.target.value)} style={{height:40}}>{(f.options||[]).map(o=><option key={o}>{o}</option>)}</select>
                  : <input type="text" value={item[f.key]||""} onChange={e=>update(item.id,f.key,e.target.value)} placeholder={f.placeholder||""}/>
                }
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={add} style={{width:"100%",padding:"9px",borderRadius:8,border:"1.5px dashed #93c5fd",background:"#eff6ff",color:"#1e3a5f",fontWeight:700,fontSize:12}}>+ Add {label}</button>
    </div>
  );
}

/* ─── PHOTO UPLOAD ─────────────────────────────────────────────── */
function PhotoUpload({photo,onChange}){
  const ref = useRef();
  const handleFile = e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>onChange(ev.target.result);r.readAsDataURL(f);};
  return(
    <div style={{marginBottom:18}}>
      <label>Profile Photo</label>
      <div style={{display:"flex",alignItems:"center",gap:14,marginTop:4}}>
        <div onClick={()=>ref.current?.click()} style={{width:70,height:70,borderRadius:"50%",border:"2px dashed #93c5fd",overflow:"hidden",cursor:"pointer",background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>
          {photo?<img src={photo} alt="p" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"📷"}
        </div>
        <div>
          <button onClick={()=>ref.current?.click()} style={{background:"#1e3a5f",color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:700}}>Upload Photo</button>
          {photo&&<button onClick={()=>onChange(null)} style={{marginLeft:8,background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:7,padding:"7px 10px",fontSize:12,fontWeight:700}}>Remove</button>}
          <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>JPG, PNG · Square recommended</div>
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TEMPLATE PANEL
══════════════════════════════════════════════════════════════════ */
function TemplatePanel({activeTpl,onSelect,onClose}){
  return(
    <div style={{background:"#fff",borderBottom:"1.5px solid #e2e8f0",padding:"16px 22px",boxShadow:"0 4px 16px rgba(0,0,0,0.08)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div style={{fontWeight:800,fontSize:14,color:"#1e293b",fontFamily:"'Raleway',sans-serif"}}>Choose Template</div>
        <button onClick={onClose} style={{background:"#f1f5f9",border:"none",borderRadius:7,padding:"5px 12px",fontSize:12,fontWeight:700,color:"#475569"}}>✕ Close</button>
      </div>
      <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:4}}>
        {TEMPLATES.map(t=>(
          <div key={t.id} className={`tpl-card${activeTpl===t.id?" selected":""}`} onClick={()=>{onSelect(t.id);onClose();}}
            style={{flexShrink:0,width:140,background:"#fff",border:`1.5px solid ${activeTpl===t.id?"#2563eb":"#e2e8f0"}`,borderRadius:12,overflow:"hidden",boxShadow:activeTpl===t.id?"0 0 0 3px #bfdbfe":"none"}}>
            <div style={{height:72,background:t.preview==="#f8fafc"?"#f8fafc":t.preview,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #e2e8f0"}}>
              <div style={{fontSize:10,fontWeight:800,color:t.preview==="#f8fafc"?"#1e293b":"#fff",letterSpacing:1,textTransform:"uppercase",fontFamily:"'Raleway',sans-serif"}}>{t.name}</div>
            </div>
            <div style={{padding:"8px 10px"}}>
              <div style={{fontWeight:700,fontSize:12,color:"#1e293b"}}>{t.name}</div>
              <div style={{fontSize:10,color:"#64748b",marginTop:2}}>{t.tag}</div>
              {activeTpl===t.id&&<div style={{fontSize:10,fontWeight:700,color:"#2563eb",marginTop:4}}>✓ Active</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════════ */
export default function ResumeBuilder() {
  const [data, setData] = useState(EMPTY_DATA());
  const [activeSection, setActiveSection] = useState("basics");
  const [activeTpl, setActiveTpl] = useState("blueSidebar");
  const [viewMode, setViewMode] = useState("split");
  const [showTpl, setShowTpl] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const pdfRef = useRef(null);

  const set = useCallback((k,v) => setData(p=>({...p,[k]:v})), []);

  const handleDownload = useCallback(() => {
    setDownloading(true);
    const el = pdfRef.current;
    if (!el){setDownloading(false);return;}
    const win = window.open("","_blank");
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"><title>${data.name||"Resume"}</title>
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800;900&family=Open+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
      <style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Open Sans',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;}@page{size:A4;margin:0;}</style>
    </head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.onload = () => { setTimeout(()=>{win.print();setDownloading(false);},600); };
  },[data.name]);

  const currentNav = NAV.find(n=>n.id===activeSection);

  const renderSection = () => {
    if(activeSection==="basics") return(
      <div className="fade-up">
        <PhotoUpload photo={data.photo} onChange={v=>set("photo",v)}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 14px"}}>
          {[{k:"name",l:"Full Name",p:"Akash Maity"},{k:"title",l:"Professional Title",p:"Full Stack Developer"},{k:"email",l:"Email",p:"email@example.com"},{k:"phone",l:"Phone",p:"+91 98000 00000"},{k:"location",l:"Location",p:"Kolkata, West Bengal"},{k:"linkedin",l:"LinkedIn",p:"linkedin.com/in/username"},{k:"github",l:"GitHub",p:"github.com/username"},{k:"website",l:"Website",p:"yoursite.com"}].map(f=>(
            <div key={f.k}><label>{f.l}</label><input value={data[f.k]} onChange={e=>set(f.k,e.target.value)} placeholder={f.p}/></div>
          ))}
        </div>
        <div style={{marginTop:12}}>
          <label>Reference Note</label>
          <input value={data.reference} onChange={e=>set("reference",e.target.value)} placeholder="References available upon request."/>
        </div>
      </div>
    );
    if(activeSection==="profile") return(
      <div className="fade-up">
        <label>Professional Summary / Profile</label>
        <textarea rows={6} value={data.profile} onChange={e=>set("profile",e.target.value)} placeholder="Dedicated BCA student with a strong foundation in web technologies and full-stack development. Passionate about learning, teamwork, and applying technical skills to solve real-world problems."/>
        <div style={{fontSize:11,color:"#94a3b8",marginTop:5}}>{data.profile.length} characters · Aim for 200–400 characters</div>
      </div>
    );
    if(activeSection==="education") return(
      <div className="fade-up">
        <RepeatSection label="Education" items={data.education} onChange={v=>set("education",v)} fields={[
          {key:"degree",label:"Degree / Course",placeholder:"Bachelor of Computer Applications"},
          {key:"institution",label:"Institution",placeholder:"JIS University"},
          {key:"startYear",label:"Start Year",placeholder:"2023"},
          {key:"endYear",label:"End Year",placeholder:"2026"},
          {key:"gpa",label:"GPA / Grade",placeholder:"8.56/10"},
          {key:"description",label:"Description",placeholder:"Graduated with highest honors...",full:true},
        ]}/>
      </div>
    );
    if(activeSection==="experience") return(
      <div className="fade-up">
        <p style={{fontSize:12,color:"#64748b",marginBottom:10}}>💡 One bullet point per line. Press Enter for each new point.</p>
        <RepeatSection label="Experience" items={data.experience} onChange={v=>set("experience",v)} fields={[
          {key:"startYear",label:"Start Year",placeholder:"2023"},
          {key:"endYear",label:"End Year",placeholder:"NOW"},
          {key:"title",label:"Role / Title",placeholder:"Web Development Intern – Company Name",full:true},
          {key:"bullets",label:"Bullet Points (one per line)",type:"textarea",placeholder:"Built a secure online exam platform with authentication\nImplemented timed tests and result calculation\nGenerated certificates automatically",full:true},
        ]}/>
      </div>
    );
    if(activeSection==="projects") return(
      <div className="fade-up">
        <p style={{fontSize:12,color:"#64748b",marginBottom:10}}>💡 One bullet point per line.</p>
        <RepeatSection label="Project" items={data.projects} onChange={v=>set("projects",v)} fields={[
          {key:"startYear",label:"Start Year",placeholder:"2023"},
          {key:"endYear",label:"End Year",placeholder:"2025"},
          {key:"title",label:"Project / Section Title",placeholder:"Academic & Personal Projects",full:true},
          {key:"bullets",label:"Bullet Points (one per line)",type:"textarea",placeholder:"NovaExam: Built a secure online exam system\nQR Code Generator using JavaScript & APIs",full:true},
        ]}/>
      </div>
    );
    if(activeSection==="skills") return(
      <div className="fade-up">
        <RepeatSection label="Skill Group" items={data.skills} onChange={v=>set("skills",v)} fields={[
          {key:"category",label:"Category",placeholder:"Technical"},
          {key:"items",label:"Skills (comma separated)",placeholder:"C, C++, Java, React, Node.js, MongoDB",full:true},
        ]}/>
      </div>
    );
    if(activeSection==="languages") return(
      <div className="fade-up">
        <RepeatSection label="Language" items={data.languages} onChange={v=>set("languages",v)} fields={[
          {key:"language",label:"Language",placeholder:"English"},
          {key:"proficiency",label:"Proficiency",type:"select",options:["Native","Fluent","Advanced","Intermediate","Beginner"]},
        ]}/>
      </div>
    );
    if(activeSection==="certifications") return(
      <div className="fade-up">
        <RepeatSection label="Certification" items={data.certifications} onChange={v=>set("certifications",v)} fields={[
          {key:"name",label:"Certification Name",placeholder:"AWS Solutions Architect"},
          {key:"issuer",label:"Issuing Org",placeholder:"Amazon Web Services"},
          {key:"year",label:"Year",placeholder:"2024"},
        ]}/>
      </div>
    );
    if(activeSection==="achievements") return(
      <div className="fade-up">
        <RepeatSection label="Achievement" items={data.achievements} onChange={v=>set("achievements",v)} fields={[
          {key:"title",label:"Achievement Title",placeholder:"Employee of the Year",full:true},
          {key:"description",label:"Description",placeholder:"Brief description of the achievement",full:true},
        ]}/>
      </div>
    );
  };

  return(
    <>
      <style>{GLOBAL_CSS}</style>
      {showAI&&<AIAnalyzer onClose={()=>setShowAI(false)}/>}
      <div style={{minHeight:"100vh",background:"#f0f4f8",display:"flex",flexDirection:"column"}}>

        {/* TOP BAR */}
        <div style={{background:"#3d459f",padding:"0 18px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:8,background:"#0c2165",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#fff",fontSize:16,fontFamily:"'Raleway',sans-serif"}}>🤖</div>
            <div>
              <div style={{fontWeight:800,fontSize:14,color:"#fff",fontFamily:"'Raleway',sans-serif"}}>ResumeAI</div>
              <div style={{fontSize:10,color:"#f3f4fb"}}>6 Templates · AI Resume Analyzer</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:2,background:"rgba(255,255,255,0.1)",borderRadius:8,padding:3}}>
              {[["split","⊞ Split"],["editor","✏ Edit"],["preview","👁 Preview"]].map(([v,l])=>(
                <button key={v} onClick={()=>setViewMode(v)} style={{padding:"5px 11px",borderRadius:6,border:"none",fontSize:11,fontWeight:700,background:viewMode===v?"#fff":"transparent",color:viewMode===v?"#1e3a5f":"rgba(255,255,255,0.75)",transition:"all 0.2s"}}>{l}</button>
              ))}
            </div>
            <button onClick={()=>setShowTpl(p=>!p)} style={{background:"rgba(255,255,255,0.12)",color:"#fff",border:"1px solid rgba(255,255,255,0.25)",borderRadius:8,padding:"7px 13px",fontSize:12,fontWeight:700}}>🎨 Templates</button>
            <button onClick={()=>setShowAI(true)} style={{background:"linear-gradient(13deg,#7c3aed,#23eb)",color:"#fefcfc",border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,fontWeight:700,boxShadow:"0 4px 12px rgba(196, 190, 227, 0.4)",display:"flex",alignItems:"center",gap:6}}>  
              🤖 AI Analyzer
            </button>
            <button onClick={handleDownload} disabled={downloading} style={{background:downloading?"#334155":"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
              {downloading?<><span style={{animation:"spin 0.8s linear infinite",display:"inline-block"}}>⟳</span> Preparing…</>:<>⬇ PDF</>}
            </button>
          </div>
        </div>

        {/* TEMPLATE PANEL */}
        {showTpl&&<TemplatePanel activeTpl={activeTpl} onSelect={setActiveTpl} onClose={()=>setShowTpl(false)}/>}

        {/* MAIN LAYOUT */}
        <div style={{display:"flex",flex:1,overflow:"hidden"}}>

          {/* SIDEBAR NAV */}
          {viewMode!=="preview"&&(
            <div style={{width:196,background:"#fff",borderRight:"1.5px solid #e2e8f0",overflowY:"auto",flexShrink:0,padding:"10px 7px"}}>
              {NAV.map(n=>(
                <button key={n.id} className="nav-btn" onClick={()=>setActiveSection(n.id)} style={{
                  width:"100%",display:"flex",alignItems:"center",gap:9,
                  padding:"9px 11px",borderRadius:9,border:"none",
                  background:activeSection===n.id?"#dbeafe":"transparent",
                  color:activeSection===n.id?"#1e3a5f":"#475569",
                  fontWeight:activeSection===n.id?700:500,fontSize:12.5,
                  cursor:"pointer",marginBottom:2,textAlign:"left"
                }}>
                  <span style={{fontSize:14}}>{n.icon}</span>
                  <span>{n.label}</span>
                  {activeSection===n.id&&<span style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:"#2563eb"}}/>}
                </button>
              ))}
              <div style={{margin:"14px 4px 0",padding:"10px",background:"#c6d4df",border:"1px solid #bbf7d0",borderRadius:9}}>
                <div style={{fontSize:10.5,fontWeight:700,color:"#166534",marginBottom:3}}>💡 Tip</div>
                <div style={{fontSize:10.5,color:"#166534",lineHeight:1.5}}>Use strong action verbs: "Built", "Led", "Increased" for maximum impact.</div>
              </div>
              <button onClick={()=>setShowAI(true)} style={{
                width:"100%",marginTop:10,padding:"9px",borderRadius:9,
                background:"linear-gradient(135deg,#eff6ff,#dbeafe)",
                border:"1.5px solid #93c5fd",color:"#1e3a5f",
                fontWeight:700,fontSize:11.5,display:"flex",alignItems:"center",justifyContent:"center",gap:6
              }}>🤖 AI Resume Check</button>
            </div>
          )}

          {/* EDITOR */}
          {viewMode!=="preview"&&(
            <div style={{flex:viewMode==="split"?"0 0 420px":1,overflowY:"auto",padding:"20px 22px",background:"#f8fafc",borderRight:viewMode==="split"?"1.5px solid #e2e8f0":"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                <span style={{fontSize:20}}>{currentNav?.icon}</span>
                <div>
                  <div style={{fontSize:15,fontWeight:800,color:"#1e293b",fontFamily:"'Raleway',sans-serif"}}>{currentNav?.label}</div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>Fill in your information below</div>
                </div>
              </div>
              {renderSection()}
            </div>
          )}

          {/* PREVIEW */}
          {(viewMode==="split"||viewMode==="preview")&&(
            <div style={{flex:1,overflowY:"auto",background:"#dde4f0",padding:"22px",display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:"100%",maxWidth:840,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"#16a34a",animation:"pulse 2s ease infinite"}}/>
                  <span style={{fontSize:12,fontWeight:700,color:"#1e3a5f"}}>Live Preview</span>
                  <span style={{fontSize:11,color:"#64748b"}}>· {TEMPLATES.find(t=>t.id===activeTpl)?.name}</span>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setShowTpl(true)} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:7,padding:"5px 12px",fontSize:11.5,fontWeight:700,color:"#475569"}}>🎨 Change</button>
                  <button onClick={()=>setShowAI(true)} style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:7,padding:"5px 12px",fontSize:11.5,fontWeight:700}}>🤖 Analyze</button>
                  <button onClick={handleDownload} style={{background:"#1e3a5f",color:"#fff",border:"none",borderRadius:7,padding:"5px 12px",fontSize:11.5,fontWeight:700}}>⬇ PDF</button>
                </div>
              </div>
              <div ref={pdfRef} style={{width:"100%",maxWidth:840,background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.15)",marginBottom:24,minHeight:400}}>
                <ResumeRender data={data} tpl={activeTpl}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}