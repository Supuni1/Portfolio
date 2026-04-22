import { useState, useEffect, useRef, useCallback } from "react";
import profilePic from "./assets/profile.jpg";

const C = {
  bg:      "#03050d",
  bgCard:  "rgba(255,255,255,0.04)",
  bgGlass: "rgba(255,255,255,0.06)",
  cyan:    "#00f0ff",
  pink:    "#ff2070",
  violet:  "#b06aff",
  amber:   "#ffb340",
  green:   "#00e5a0",
  blue:    "#4488ff",
  text:    "#e2e8f0",
  muted:   "#8896aa",
};

const DISPLAY = "'Cinzel', serif";
const BODY    = "'Nunito', sans-serif";
const LOGO_F  = "'Orbitron', sans-serif";
const LINKS   = ["home","about","education","skills","projects","journal","career","contact"];
const LCOLS   = [C.cyan,C.pink,C.violet,C.amber,C.green,C.blue,C.pink,C.cyan];

/* ── Global CSS ─────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Nunito:wght@300;400;500;600;700&family=Orbitron:wght@700;900&display=swap');

      @keyframes shimmer  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes pulse    { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
      @keyframes spinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes glow     { 0%,100%{box-shadow:0 0 22px ${C.cyan}44,0 0 60px ${C.cyan}22} 50%{box-shadow:0 0 55px ${C.cyan}99,0 0 110px ${C.cyan}44} }
      @keyframes floatA   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(2deg)} }
      @keyframes floatB   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(-2deg)} }
      @keyframes floatC   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-26px)} }
      @keyframes barFill  { from{width:0} to{width:var(--w)} }
      @keyframes fadeUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
      @keyframes navGlow  { 0%,100%{opacity:.6} 50%{opacity:1} }

      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      html { scroll-behavior:smooth; }
      body { background:${C.bg}; font-family:${BODY}; color:${C.text}; overflow-x:hidden; cursor:none; }
      ::-webkit-scrollbar { width:4px; }
      ::-webkit-scrollbar-track { background:${C.bg}; }
      ::-webkit-scrollbar-thumb { background:linear-gradient(${C.cyan},${C.pink}); border-radius:10px; }
      a { text-decoration:none; }

      /* Custom cursor */
      .cursor-dot  { width:8px; height:8px; background:${C.cyan}; border-radius:50%; position:fixed; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:transform .1s; }
      .cursor-ring { width:36px; height:36px; border:1.5px solid ${C.cyan}66; border-radius:50%; position:fixed; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:transform .18s ease, width .2s, height .2s, border-color .2s; }
      .cursor-ring.hov { width:54px; height:54px; border-color:${C.pink}99; }

      /* Glass card base */
      .glass {
        background: rgba(255,255,255,0.05);
        backdrop-filter: blur(18px) saturate(1.5);
        -webkit-backdrop-filter: blur(18px) saturate(1.5);
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 20px;
      }

      /* Section fade-in transition */
      .sec-fade { opacity:0; transform:translateY(48px); transition: opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); }
      .sec-fade.visible { opacity:1; transform:translateY(0); }

      /* Tilt card */
      .tilt-card { transition: transform .08s linear, box-shadow .3s; will-change:transform; }
    `}</style>
  );
}

/* ── Custom Cursor ──────────────────────────── */
function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);

  useEffect(()=>{
    const move = e => {
      if(dot.current)  { dot.current.style.left=e.clientX+"px"; dot.current.style.top=e.clientY+"px"; }
      if(ring.current) { ring.current.style.left=e.clientX+"px"; ring.current.style.top=e.clientY+"px"; }
    };
    const over  = e => { if(e.target.closest("a,button,[data-hover]") && ring.current) ring.current.classList.add("hov"); };
    const out   = ()  => { if(ring.current) ring.current.classList.remove("hov"); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout",  out);
    return ()=>{ window.removeEventListener("mousemove",move); window.removeEventListener("mouseover",over); window.removeEventListener("mouseout",out); };
  },[]);

  return (
    <>
      <div ref={dot}  className="cursor-dot"/>
      <div ref={ring} className="cursor-ring"/>
    </>
  );
}

/* ── Canvas Particle Field ──────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId, W, H, particles = [], mouse = { x:-999, y:-999 };

    const resize = ()=>{
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", e=>{ mouse.x=e.clientX; mouse.y=e.clientY; });

    const COLS = [C.cyan, C.pink, C.violet, C.amber, C.blue];
    class P {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random()*W;
        this.y  = Math.random()*H;
        this.vx = (Math.random()-.5)*.35;
        this.vy = (Math.random()-.5)*.35;
        this.r  = Math.random()*1.6+.5;
        this.col= COLS[Math.floor(Math.random()*COLS.length)];
        this.a  = Math.random()*.5+.15;
        this.life = 1;
      }
      update() {
        const dx=this.x-mouse.x, dy=this.y-mouse.y, dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){ const f=1-(dist/120); this.vx+=f*dx*.012; this.vy+=f*dy*.012; }
        this.vx*=.99; this.vy*=.99;
        this.x+=this.vx; this.y+=this.vy;
        if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle = this.col+(Math.round(this.a*255).toString(16).padStart(2,"0"));
        ctx.fill();
      }
    }
    for(let i=0;i<140;i++) particles.push(new P());

    // connect nearby particles
    const drawLines = ()=>{
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const dx=particles[i].x-particles[j].x;
          const dy=particles[i].y-particles[j].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if(d<110){
            ctx.beginPath();
            ctx.moveTo(particles[i].x,particles[i].y);
            ctx.lineTo(particles[j].x,particles[j].y);
            const a=(1-d/110)*0.13;
            ctx.strokeStyle=`rgba(0,240,255,${a})`;
            ctx.lineWidth=.6;
            ctx.stroke();
          }
        }
      }
    };

    const loop = ()=>{
      ctx.clearRect(0,0,W,H);
      particles.forEach(p=>{ p.update(); p.draw(); });
      drawLines();
      animId = requestAnimationFrame(loop);
    };
    loop();
    return ()=>{ cancelAnimationFrame(animId); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={canvasRef} style={{ position:"fixed", top:0, left:0, zIndex:0, pointerEvents:"none", opacity:.85 }}/>;
}

/* ── Reveal on scroll ───────────────────────── */
function useSectionReveal() {
  useEffect(()=>{
    const els = document.querySelectorAll(".sec-fade");
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("visible"); });
    },{ threshold:0.08 });
    els.forEach(el=>obs.observe(el));
    return ()=>obs.disconnect();
  });
}

function Reveal({ children, delay=0, style={} }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(()=>{
    const o = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setV(true); },{ threshold:.08 });
    if(ref.current) o.observe(ref.current);
    return ()=>o.disconnect();
  },[]);
  return (
    <div ref={ref} style={{
      opacity:v?1:0, transform:v?"translateY(0)":"translateY(40px)",
      transition:`opacity .7s ease ${delay}s, transform .7s ease ${delay}s`, ...style,
    }}>{children}</div>
  );
}

/* ── 3D Tilt Card ───────────────────────────── */
function TiltCard({ children, color=C.cyan, style={}, className="" }) {
  const ref = useRef(null);
  const onMove = useCallback(e=>{
    const el = ref.current; if(!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX-r.left)/r.width  - .5)*18;
    const y = ((e.clientY-r.top) /r.height - .5)*-18;
    el.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
    el.style.boxShadow = `0 24px 60px ${color}28, ${x>0?"-":""}8px ${y>0?"-":""}8px 30px ${color}18`;
  },[color]);
  const onLeave = useCallback(()=>{
    if(ref.current) { ref.current.style.transform="perspective(600px) rotateY(0) rotateX(0) translateY(0)"; ref.current.style.boxShadow="none"; }
  },[]);
  return (
    <div ref={ref} className={`tilt-card glass ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ border:`1px solid ${color}28`, ...style }}>
      {children}
    </div>
  );
}

/* ── Navbar ─────────────────────────────────── */
function Navbar({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",h);
    return ()=>window.removeEventListener("scroll",h);
  },[]);
  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:1000,
      background: scrolled ? "rgba(3,5,13,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 6%", height:66, transition:"all .4s",
    }}>
      <span style={{
        fontFamily:LOGO_F, fontSize:"1.15rem", letterSpacing:"0.1em",
        background:`linear-gradient(90deg,${C.cyan},${C.pink})`,
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
      }}>SD.</span>
      <div style={{ display:"flex", gap:"1.6rem" }}>
        {LINKS.map((l,i)=>(
          <a key={l} href={`#${l}`} onClick={()=>setActive(l)} style={{
            color: active===l ? LCOLS[i] : C.muted,
            fontFamily:BODY, fontSize:"0.73rem", letterSpacing:"0.1em",
            textTransform:"uppercase", fontWeight:700, transition:"all .25s",
            textShadow: active===l ? `0 0 18px ${LCOLS[i]}` : "none",
            borderBottom: active===l ? `1px solid ${LCOLS[i]}` : "1px solid transparent",
            paddingBottom:2,
          }}>{l}</a>
        ))}
      </div>
    </nav>
  );
}

/* ── Hero ───────────────────────────────────── */
function Hero() {
  const [typed, setTyped] = useState("");
  const roles = ["QA Enthusiast","IT Undergraduate","Software Tester","SLIIT Student","Web Developer Trainee"];
  const [ri, setRi]   = useState(0);
  const [imgErr, setImgErr] = useState(false);
  const heroRef = useRef(null);

  // parallax layers on mouse
  useEffect(()=>{
    const h = e=>{
      const x=(e.clientX/window.innerWidth -.5)*2;
      const y=(e.clientY/window.innerHeight-.5)*2;
      document.querySelectorAll("[data-depth]").forEach(el=>{
        const d = parseFloat(el.dataset.depth);
        el.style.transform = `translate(${x*d*20}px,${y*d*12}px)`;
      });
    };
    window.addEventListener("mousemove",h);
    return ()=>window.removeEventListener("mousemove",h);
  },[]);

  // typewriter
  useEffect(()=>{
    let i=0, adding=true;
    const role=roles[ri];
    const iv=setInterval(()=>{
      if(adding){ setTyped(role.slice(0,i+1)); i++; if(i>=role.length) adding=false; }
      else      { setTyped(role.slice(0,i-1)); i--; if(i<=0){ adding=true; setRi(r=>(r+1)%roles.length); }}
    },80);
    return ()=>clearInterval(iv);
  },[ri]);

  return (
    <section id="home" ref={heroRef} style={{
      minHeight:"100vh", display:"flex", alignItems:"center",
      padding:"100px 8% 60px", position:"relative", overflow:"hidden",
      background:"transparent", gap:"6%",
    }}>
      {/* Gradient mesh behind */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div data-depth="0.2" style={{ position:"absolute", width:700, height:700, borderRadius:"50%", background:`radial-gradient(circle,${C.cyan}18 0%,transparent 70%)`, top:"-20%", left:"-10%", transition:"transform .1s" }}/>
        <div data-depth="0.35" style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle,${C.pink}18 0%,transparent 70%)`, bottom:"-10%", right:"-5%", transition:"transform .1s" }}/>
        <div data-depth="0.15" style={{ position:"absolute", width:350, height:350, borderRadius:"50%", background:`radial-gradient(circle,${C.violet}14 0%,transparent 70%)`, top:"40%", left:"45%", transition:"transform .1s" }}/>
      </div>

      {/* Text side */}
      <div style={{ position:"relative", zIndex:2, flex:1, minWidth:0, animation:"fadeUp .9s ease both" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"7px 20px", borderRadius:50, marginBottom:"2rem",
          background:"rgba(0,240,255,0.07)", border:`1px solid ${C.cyan}44`,
          backdropFilter:"blur(8px)",
        }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:C.cyan, animation:"pulse 2s infinite" }}/>
          <span style={{ color:C.cyan, fontSize:"0.78rem", letterSpacing:"0.1em", fontWeight:600, fontFamily:BODY }}>Available for QA Internship</span>
        </div>

        <h1 style={{
          fontFamily:DISPLAY, fontWeight:900,
          fontSize:"clamp(2.8rem,6.5vw,5.4rem)",
          lineHeight:1.08, marginBottom:"0.7rem",
          background:`linear-gradient(135deg,#fff 25%,${C.cyan} 58%,${C.pink})`,
          backgroundSize:"220% 220%", animation:"shimmer 6s ease infinite",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          letterSpacing:"0.06em",
        }}>Supuni<br/>Dilhara</h1>

        <div style={{ fontSize:"clamp(1rem,2.4vw,1.4rem)", fontFamily:BODY, color:C.muted, marginBottom:"1.7rem", minHeight:"2.4rem" }}>
          <span style={{ color:C.pink, fontWeight:700 }}>{"< "}</span>
          <span style={{ color:C.amber, fontWeight:600 }}>{typed}</span>
          <span style={{ color:C.cyan, animation:"blink 1s infinite" }}>|</span>
          <span style={{ color:C.pink, fontWeight:700 }}>{" />"}</span>
        </div>

        <p style={{ color:C.muted, fontSize:"1rem", lineHeight:1.9, maxWidth:490, marginBottom:"2.6rem", fontFamily:BODY }}>
          IT undergraduate at SLIIT passionate about Software Quality Assurance.
          Building reliable software through thoughtful testing, clear documentation,
          and an uncompromising commitment to quality.
        </p>

        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
          {[
            { label:"View Projects", href:"#projects", bg:`linear-gradient(135deg,${C.cyan},${C.blue})`, col:"#000" },
            { label:"Get In Touch",  href:"#contact",  bg:"rgba(0,240,255,0.07)", col:C.cyan, border:`1px solid ${C.cyan}55` },
          ].map(b=>(
            <a key={b.label} href={b.href} data-hover style={{
              padding:"0.82rem 2.4rem", borderRadius:50,
              background:b.bg, color:b.col,
              fontFamily:BODY, fontWeight:700, fontSize:"0.9rem",
              border:b.border||"none", letterSpacing:"0.06em",
              backdropFilter:"blur(8px)",
              boxShadow: b.bg!=="transparent" ? `0 0 32px ${C.cyan}55` : "none",
              transition:"all .25s",
            }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px) scale(1.03)"}
            onMouseLeave={e=>e.currentTarget.style.transform="none"}
            >{b.label}</a>
          ))}
        </div>
      </div>

      {/* Photo side */}
      <div style={{ position:"relative", zIndex:2, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeUp 1.1s .15s ease both" }}>
        <div data-depth="0.05" style={{ transition:"transform .12s" }}>
          <div style={{ position:"absolute", width:360, height:360, borderRadius:"50%", border:`2px dashed ${C.cyan}30`, animation:"spinRing 22s linear infinite", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}/>
          <div style={{ position:"absolute", width:316, height:316, borderRadius:"50%", border:`1px solid ${C.violet}28`, top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}/>
          <div style={{
            width:278, height:278, borderRadius:"50%",
            border:`3px solid ${C.cyan}66`,
            animation:"glow 3.5s ease-in-out infinite",
            overflow:"hidden", background:`linear-gradient(135deg,#0b0e1a,#0f1220)`,
            boxShadow:`0 0 60px ${C.cyan}33, inset 0 0 40px ${C.cyan}08`,
          }}>
            {!imgErr ? (
              <img src={profilePic} alt="Supuni Dilhara" onError={()=>setImgErr(true)}
                style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }}/>
            ) : (
              <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}>
                <span style={{ fontFamily:DISPLAY, fontWeight:900, fontSize:"3.5rem",
                  background:`linear-gradient(135deg,${C.cyan},${C.pink})`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>SD</span>
                <span style={{ color:C.muted, fontSize:"0.6rem", letterSpacing:"0.15em", fontFamily:BODY }}>PROFILE PHOTO</span>
              </div>
            )}
          </div>

          {/* floating badges */}
          {[
            { label:"SLIIT",       color:C.pink,   pos:{ bottom:"30px", left:"-92px"  }, anim:"floatB" },  
            { label:"QA Focus",    color:C.amber,  pos:{ bottom:"-6px", right:"-76px" }, anim:"floatA" },
          ].map(b=>(
            <div key={b.label} style={{
              position:"absolute", ...b.pos,
              padding:"0.45rem 1.2rem", borderRadius:50,
              background:`${b.color}18`, border:`1px solid ${b.color}44`,
              backdropFilter:"blur(12px)",
              color:b.color, fontSize:"0.76rem", fontFamily:BODY, fontWeight:700,
              animation:`${b.anim} ${3.5+(["floatA","floatB","floatC"].indexOf(b.anim)*.6)}s ease-in-out infinite`,
              whiteSpace:"nowrap", boxShadow:`0 4px 20px ${b.color}22`,
            }}>{b.label}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section Header ─────────────────────────── */
function SectionHeader({ label, title, color=C.cyan }) {
  return (
    <div style={{ marginBottom:"3rem" }}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:"0.9rem" }}>
        <span style={{ width:34, height:2, background:color, display:"block", borderRadius:2 }}/>
        <span style={{ color, fontSize:"0.72rem", letterSpacing:"0.24em", textTransform:"uppercase", fontFamily:BODY, fontWeight:700 }}>{label}</span>
      </div>
      <h2 style={{ fontFamily:DISPLAY, fontWeight:700, fontSize:"clamp(2rem,4.5vw,3rem)", color:"#fff", lineHeight:1.1, letterSpacing:"0.03em" }}>{title}</h2>
    </div>
  );
}

/* ── About ──────────────────────────────────── */
function About() {
  const infos = [
    { k:"Full Name",     v:"W.M.P.G. Supuni Dilhara" },
    { k:"Date of Birth", v:"28 February 2001" },
    { k:"Address",       v:"Kap-ela, Kandalama, Dambulla" },
    { k:"Phone",         v:"+94 71 737 3138" },
    { k:"Email",         v:"supunidilhara1@gmail.com" },
    { k:"Languages",     v:"Sinhala · English" },
    { k:"Reg. No.",      v:"IT22169044" },
  ];
  return (
    <section id="about" className="sec-fade" style={{ padding:"100px 8%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent,rgba(176,106,255,0.04) 50%,transparent)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1 }}>
        <Reveal><SectionHeader label="Who I Am" title="About Me" color={C.violet}/></Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem" }}>
          <Reveal delay={0.1}>
            <div>
              {[
                "I am an IT undergraduate at SLIIT with a burning passion for Software Quality Assurance. I believe great software is built not just by developers, but by testers who catch what others miss.",
                "My journey spans from Rangiri Dambulla Central College to SLIIT's Faculty of Computing, where I've built 7+ projects across web and mobile technologies, each one deepening my understanding of software quality.",
                "Currently working as a Web Developer Trainee at Eco Engineers (Pvt) Ltd while actively seeking a QA internship where I can apply my analytical mindset.",
              ].map((p,i)=>(
                <p key={i} style={{ color:C.muted, lineHeight:1.95, marginBottom:"1.2rem", fontFamily:BODY, fontSize:"0.97rem" }}>{p}</p>
              ))}
              <div style={{ display:"flex", gap:"0.9rem", marginTop:"1.6rem", flexWrap:"wrap" }}>
                {[
                  { icon:"💼", label:"LinkedIn", href:"https://www.linkedin.com/in/supuni-dilhara", color:C.blue },
                  { icon:"💻", label:"GitHub",   href:"https://github.com/Supuni1",                color:C.green },
                  { icon:"✉️", label:"Email",    href:"mailto:supunidilhara1@gmail.com",           color:C.pink },
                ].map(l=>(
                  <a key={l.label} href={l.href} target="_blank" data-hover style={{
                    display:"flex", alignItems:"center", gap:8, padding:"0.55rem 1.3rem", borderRadius:50,
                    background:`${l.color}12`, border:`1px solid ${l.color}40`, backdropFilter:"blur(8px)",
                    color:l.color, fontSize:"0.85rem", fontFamily:BODY, fontWeight:600, transition:"all .22s",
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=`${l.color}25`; e.currentTarget.style.transform="translateY(-3px)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=`${l.color}12`; e.currentTarget.style.transform="none"; }}
                  >{l.icon} {l.label}</a>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="glass" style={{ padding:"2rem", border:`1px solid ${C.violet}22` }}>
              {infos.map((info,i)=>(
                <div key={i} style={{ display:"flex", gap:"1rem", padding:"0.8rem 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color:C.muted, minWidth:112, fontSize:"0.85rem", fontFamily:BODY }}>{info.k}</span>
                  <span style={{ color:"#fff", fontWeight:600, fontSize:"0.9rem", fontFamily:BODY }}>{info.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Education ──────────────────────────────── */
function Education() {
  const items = [
    { year:"2022–Present", degree:"BSc (Hons) Information and Technology",    school:"SLIIT — Faculty of Computing",           detail:"Reg. No. IT22169044 · Specializing in IT", color:C.cyan,   icon:"🎓" },
    { year:"2021",         degree:"G.C.E. Advanced Level — Commerce Stream",  school:"Rangiri Dambulla Central College",        detail:"Accounting · Business · Economics",        color:C.pink,   icon:"📚" },
    { year:"2017",         degree:"G.C.E. Ordinary Level",                    school:"Rangiri Dambulla Central College",        detail:"3 A's · 1 B · 4 C's · 1 S",              color:C.violet, icon:"📖" },
    { year:"Extra",        degree:"English Diploma — ICBT · NVQ Level 4",    school:"Information & Technology",               detail:"Vocational Training Authority",            color:C.amber,  icon:"📜" },
  ];
  return (
    <section id="education" className="sec-fade" style={{ padding:"100px 8%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent,rgba(0,240,255,0.03) 50%,transparent)", pointerEvents:"none" }}/>
      <Reveal><SectionHeader label="Academic Background" title="Education" color={C.cyan}/></Reveal>
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", left:22, top:8, bottom:0, width:2,
          background:`linear-gradient(to bottom,${C.cyan},${C.pink},${C.violet},transparent)`,
          filter:`blur(1px)`,
        }}/>
        {items.map((item,i)=>(
          <Reveal key={i} delay={i*0.12}>
            <div style={{ display:"grid", gridTemplateColumns:"48px 1fr", gap:"1.6rem", marginBottom:"2.2rem" }}>
              <div style={{ width:46, height:46, borderRadius:"50%",
                background:`${item.color}18`, border:`2px solid ${item.color}55`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"1.1rem", zIndex:1, flexShrink:0, marginTop:4,
                boxShadow:`0 0 22px ${item.color}55`, backdropFilter:"blur(8px)",
              }}>{item.icon}</div>
              <TiltCard color={item.color} style={{ padding:"1.6rem 2.2rem" }}>
                <p style={{ color:item.color, fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.4rem", fontFamily:BODY, fontWeight:700 }}>{item.year}</p>
                <h3 style={{ color:"#fff", fontFamily:DISPLAY, fontWeight:600, fontSize:"1.02rem", marginBottom:"0.3rem" }}>{item.degree}</h3>
                <p style={{ color:C.muted, fontSize:"0.88rem", marginBottom:"0.4rem", fontFamily:BODY }}>{item.school}</p>
                <p style={{ color:item.color, fontSize:"0.82rem", fontFamily:BODY, opacity:.85 }}>{item.detail}</p>
              </TiltCard>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Animated Skill Bar ─────────────────────── */
function SkillBar({ name, pct, color, delay=0 }) {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  useEffect(()=>{
    const o = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setRun(true); },{ threshold:.4 });
    if(ref.current) o.observe(ref.current);
    return ()=>o.disconnect();
  },[]);
  return (
    <div ref={ref} style={{ marginBottom:"1.15rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.4rem" }}>
        <span style={{ color:C.text, fontSize:"0.85rem", fontFamily:BODY, fontWeight:600 }}>{name}</span>
        <span style={{ color, fontSize:"0.8rem", fontFamily:BODY, fontWeight:700 }}>{pct}%</span>
      </div>
      <div style={{ height:7, borderRadius:50, background:"rgba(255,255,255,0.07)", overflow:"hidden", position:"relative" }}>
        <div style={{
          position:"absolute", left:0, top:0, height:"100%", borderRadius:50,
          background:`linear-gradient(90deg,${color},${color}88)`,
          width: run ? `${pct}%` : "0%",
          transition: run ? `width 1.1s cubic-bezier(.22,1,.36,1) ${delay}s` : "none",
          boxShadow:`0 0 12px ${color}88`,
        }}/>
      </div>
    </div>
  );
}

/* ── Skills ─────────────────────────────────── */
function Skills() {
  const progSkills = [
    { name:"Java",       pct:80, color:C.amber  },
    { name:"PHP",        pct:70, color:C.violet },
    { name:"JavaScript", pct:78, color:C.cyan   },
    { name:"Kotlin",     pct:62, color:C.green  },
    { name:"C / C++",    pct:58, color:C.pink   },
    { name:"React.js",   pct:72, color:C.blue   },
  ];
  const dbSkills = [
    { name:"MySQL",   pct:82, color:C.cyan  },
    { name:"MongoDB", pct:68, color:C.green },
  ];
  const cats = [
    { title:"Programming", color:C.cyan,   tags:["Java","C","C++","PHP","Kotlin"] },
    { title:"Web Dev",     color:C.pink,   tags:["HTML","CSS","JavaScript","React","Node.js","Express.js"] },
    { title:"Databases",   color:C.violet, tags:["MySQL","MongoDB"] },
    { title:"Tools",       color:C.amber,  tags:["GitHub","Visual Studio","Android Studio","NetBeans"] },
  ];
  const soft = ["Remarkable patience & motivation","Works well under pressure","Team & individual contributor","Strong English communication"];

  return (
    <section id="skills" className="sec-fade" style={{ padding:"100px 8%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent,rgba(255,32,112,0.04) 50%,transparent)", pointerEvents:"none" }}/>
      <Reveal><SectionHeader label="Competencies" title="Skills & Expertise" color={C.pink}/></Reveal>

      {/* Skill bars */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", marginBottom:"2.5rem" }}>
        <Reveal delay={0.1}>
          <div className="glass" style={{ padding:"2rem 2.5rem", border:`1px solid ${C.cyan}22` }}>
            <p style={{ color:C.cyan, fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", fontFamily:BODY, fontWeight:700, marginBottom:"1.5rem" }}>Programming Proficiency</p>
            {progSkills.map((s,i)=><SkillBar key={s.name} {...s} delay={i*0.08}/>)}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="glass" style={{ padding:"2rem 2.5rem", border:`1px solid ${C.green}22` }}>
            <p style={{ color:C.green, fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", fontFamily:BODY, fontWeight:700, marginBottom:"1.5rem" }}>Database Skills</p>
            {dbSkills.map((s,i)=><SkillBar key={s.name} {...s} delay={i*0.1}/>)}
            <div style={{ marginTop:"2rem" }}>
              <p style={{ color:C.violet, fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", fontFamily:BODY, fontWeight:700, marginBottom:"1.2rem" }}>Soft Skills</p>
              {soft.map((s,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"0.7rem" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:C.green, flexShrink:0, boxShadow:`0 0 8px ${C.green}` }}/>
                  <span style={{ color:C.muted, fontSize:"0.88rem", fontFamily:BODY }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Tag clouds */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(255px,1fr))", gap:"1.4rem" }}>
        {cats.map((cat,i)=>(
          <Reveal key={i} delay={i*0.1}>
            <TiltCard color={cat.color} style={{ padding:"1.6rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1rem" }}>
                <div style={{ width:4, height:18, borderRadius:2, background:cat.color }}/>
                <p style={{ color:cat.color, fontSize:"0.72rem", letterSpacing:"0.15em", textTransform:"uppercase", fontFamily:BODY, fontWeight:700 }}>{cat.title}</p>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
                {cat.tags.map(t=>(
                  <span key={t} style={{ background:`${cat.color}12`, border:`1px solid ${cat.color}36`, borderRadius:50, padding:"0.3rem 0.9rem", color:cat.color, fontSize:"0.8rem", fontFamily:BODY, fontWeight:500 }}>{t}</span>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Projects ───────────────────────────────── */
function Projects() {
  const projects = [
    { n:"01", name:"Taxi Management System",                 tech:["HTML","CSS","JavaScript","PHP","MySQL"],           color:C.cyan   },
    { n:"02", name:"Online Food Delivery System",            tech:["MongoDB","Express.js","React.js","Node.js"],       color:C.pink   },
    { n:"03", name:"Customer Care Service",                  tech:["Java","JavaScript","MySQL"],                       color:C.violet },
    { n:"04", name:"Solar Monitoring System",                tech:["MongoDB","Express.js","React.js","Node.js","CSS"], color:C.amber  },
    { n:"05", name:"Age Calculator Mobile App",              tech:["Kotlin","Android Studio"],                         color:C.green  },
    { n:"06", name:"Learning Platform with Social Features", tech:["Java","JavaScript","MongoDB"],                     color:C.blue   },
    { n:"07", name:"Grocery Shop Billing System",            tech:["Java","MySQL"],                                    color:C.pink   },
  ];
  return (
    <section id="projects" className="sec-fade" style={{ padding:"100px 8%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent,rgba(255,179,64,0.04) 50%,transparent)", pointerEvents:"none" }}/>
      <Reveal><SectionHeader label="My Work" title="Projects" color={C.amber}/></Reveal>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(295px,1fr))", gap:"1.5rem" }}>
        {projects.map((p,i)=>(
          <Reveal key={i} delay={i*0.07}>
            <TiltCard color={p.color} style={{ padding:"1.85rem", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${p.color},transparent)`, borderRadius:"20px 20px 0 0" }}/>
              <div style={{ position:"absolute", top:-10, right:10, fontFamily:DISPLAY, fontWeight:700, fontSize:"2.6rem", color:`${p.color}15`, lineHeight:1, letterSpacing:"0.05em" }}>{p.n}</div>
              <h3 style={{ fontFamily:DISPLAY, fontWeight:600, fontSize:"0.99rem", color:"#fff", marginBottom:"1.1rem", lineHeight:1.4, paddingRight:"2rem" }}>{p.name}</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}>
                {p.tech.map(t=>(
                  <span key={t} style={{ background:`${p.color}10`, border:`1px solid ${p.color}36`, borderRadius:50, padding:"0.25rem 0.7rem", color:p.color, fontSize:"0.72rem", fontFamily:BODY, fontWeight:500 }}>{t}</span>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Journal ────────────────────────────────── */
function Journal() {
  return (
    <section id="journal" className="sec-fade" style={{ padding:"100px 8%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent,rgba(68,136,255,0.04) 50%,transparent)", pointerEvents:"none" }}/>
      <Reveal><SectionHeader label="PPW Module Reflection" title="Reflective Journal" color={C.blue}/></Reveal>
      <Reveal delay={0.1}>
        <div className="glass" style={{
          borderRadius:24, padding:"3rem 3.5rem", border:`1px solid ${C.blue}30`,
          position:"relative", overflow:"hidden",
          boxShadow:`0 0 80px ${C.blue}14, inset 0 0 40px ${C.blue}06`,
        }}>
          <div style={{ position:"absolute", top:-32, left:24, fontFamily:DISPLAY, fontWeight:900, fontSize:"10rem", color:`${C.blue}0d`, lineHeight:1, userSelect:"none" }}>"</div>
          <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 80% 20%,${C.violet}08,transparent 60%)`, pointerEvents:"none" }}/>
          <div style={{ position:"relative", zIndex:1 }}>
            {[
              "The Professional Practice in the Workplace (PPW) module has been one of the most transformative experiences in my time at SLIIT. It shifted my perspective from purely technical thinking to understanding what it truly means to be a professional in the IT industry.",
              "Communication stood out as a game-changer. I learned to articulate ideas clearly, structure professional emails, and present myself with confidence — skills I now realise are just as important as writing clean code or running test cases.",
              "The module guided me through career planning, personal branding, and self-reflection. Creating my CV, understanding my strengths and weaknesses, and mapping out a career path helped me see that success in IT requires continuous learning, adaptability, and building meaningful professional relationships.",
              "PPW has given me the mindset and tools to step into the professional world with clarity and purpose — especially in pursuing my goal of becoming a skilled Software QA Engineer.",
            ].map((p,i)=>(
              <p key={i} style={{ color:C.muted, lineHeight:1.95, fontFamily:BODY, fontSize:"0.97rem", marginBottom:"1.2rem", fontStyle:"italic" }}>{p}</p>
            ))}
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginTop:"0.5rem", padding:"8px 22px", borderRadius:50, background:`${C.blue}14`, border:`1px solid ${C.blue}40`, backdropFilter:"blur(8px)" }}>
              <span style={{ color:C.blue, fontSize:"0.82rem", fontFamily:BODY, fontWeight:600 }}>— Supuni Dilhara · PPW Portfolio 2024</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Career ─────────────────────────────────── */
function Career() {
  const steps = [
    { phase:"2025 – Present", goal:"Web Developer Trainee", details:"Currently working as a Web Developer Trainee at Eco Engineers (Pvt) Ltd, gaining hands-on experience in building web applications, improving UI/UX, and working with real-world development projects.", color:C.cyan, n:"1", progress:100 },
    { phase:"2025 – 2026 (Goal)", goal:"QA Intern", details:"Actively seeking a QA internship role to apply my analytical mindset in a professional software testing environment — writing test cases, reporting bugs, and ensuring product quality.", color:C.pink, n:"2", progress:40 },
    { phase:"2026+ (Vision)", goal:"Junior QA Engineer", details:"Grow into a full-time QA Engineer role with expertise in manual and automated testing, CI/CD pipelines, and Agile methodologies after completing my degree.", color:C.violet, n:"3", progress:10 },
  ];
  return (
    <section id="career" className="sec-fade" style={{ padding:"100px 8%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent,rgba(176,106,255,0.04) 50%,transparent)", pointerEvents:"none" }}/>
      <Reveal><SectionHeader label="Professional Development" title="Career Development Plan" color={C.violet}/></Reveal>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1.5rem" }}>
        {steps.map((s,i)=>(
          <Reveal key={i} delay={i*0.12}>
            <TiltCard color={s.color} style={{ padding:"2rem", position:"relative" }}>
              <div style={{ position:"absolute", top:"1.5rem", right:"1.5rem", fontFamily:DISPLAY, fontWeight:700, fontSize:"3rem", color:`${s.color}12`, lineHeight:1 }}>{s.n}</div>
              <p style={{ color:s.color, fontSize:"0.7rem", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"0.6rem", fontFamily:BODY, fontWeight:700 }}>{s.phase}</p>
              <h3 style={{ fontFamily:DISPLAY, fontWeight:600, fontSize:"1.05rem", color:"#fff", marginBottom:"0.85rem" }}>{s.goal}</h3>
              <p style={{ color:C.muted, fontSize:"0.85rem", lineHeight:1.75, fontFamily:BODY, marginBottom:"1.4rem" }}>{s.details}</p>
              <SkillBar name="Progress" pct={s.progress} color={s.color} delay={i*0.15}/>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Contact ────────────────────────────────── */
function Contact() {
  const contacts = [
    { icon:"📞", value:"+94 71 737 3138",                color:C.cyan,   href:"tel:+94717373138" },
    { icon:"✉️", value:"supunidilhara1@gmail.com",       color:C.pink,   href:"mailto:supunidilhara1@gmail.com" },
    { icon:"📍", value:"Kap-ela, Kandalama, Dambulla",   color:C.violet, href:"https://maps.google.com/?q=Kandalama,Dambulla" },
    { icon:"💼", value:"linkedin.com/in/supuni-dilhara",  color:C.blue,   href:"https://www.linkedin.com/in/supuni-dilhara" },
    { icon:"💻", value:"github.com/Supuni1",              color:C.green,  href:"https://github.com/Supuni1" },
  ];
  const refs = [
    { name:"Ms. H.M. Chathurika Rathnayake", role:"Asst. Manager Academic Affairs / Lecturer — SLIIT Kurunegala", contact:"0766042469 · chathurika.h@sliit.lk",  color:C.cyan },
    { name:"Mrs. K. R. C. Koswatte",         role:"Lecturer — Faculty of Computing, SLIIT Kandy",                  contact:"0718626264 · chathurika.ko@sliit.lk", color:C.pink },
  ];
  return (
    <section id="contact" className="sec-fade" style={{ padding:"100px 8%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent,rgba(0,240,255,0.04) 50%,transparent)", pointerEvents:"none" }}/>
      <Reveal><SectionHeader label="Get In Touch" title="Contact & References" color={C.cyan}/></Reveal>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", position:"relative", zIndex:1 }}>
        <Reveal delay={0.1}>
          <div>
            <p style={{ color:C.muted, marginBottom:"2rem", lineHeight:1.85, fontFamily:BODY }}>
              I am actively seeking a Software QA internship. Reach out through any of the channels below — I respond promptly and am always open to exciting opportunities.
            </p>
            <div className="glass" style={{ padding:"1rem 1.5rem", border:`1px solid rgba(0,240,255,0.12)` }}>
              {contacts.map((c,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"0.8rem 0.4rem", borderBottom:i<contacts.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:`${c.color}14`, border:`1px solid ${c.color}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0, backdropFilter:"blur(8px)" }}>{c.icon}</div>
                  {c.href ? (
                    <a href={c.href} style={{ color:C.muted, fontSize:"0.9rem", fontFamily:BODY, textDecoration:"none", transition:"color .2s" }} onMouseEnter={e=>e.currentTarget.style.color=c.color} onMouseLeave={e=>e.currentTarget.style.color=C.muted}>{c.value}</a>
                  ) : (
                    <span style={{ color:C.muted, fontSize:"0.9rem", fontFamily:BODY }}>{c.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div>
            <p style={{ color:C.muted, fontSize:"0.72rem", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"1rem", fontFamily:BODY, fontWeight:700 }}>References</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"1.2rem" }}>
              {refs.map((r,i)=>(
                <TiltCard key={i} color={r.color} style={{ padding:"1.6rem" }}>
                  <p style={{ color:"#fff", fontWeight:600, fontFamily:BODY, marginBottom:"0.3rem" }}>{r.name}</p>
                  <p style={{ color:C.muted, fontSize:"0.82rem", fontFamily:BODY, marginBottom:"0.45rem" }}>{r.role}</p>
                  <p style={{ color:r.color, fontSize:"0.82rem", fontFamily:BODY }}>{r.contact}</p>
                </TiltCard>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── App ────────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState("home");
  useSectionReveal();

  useEffect(()=>{
    const handler = ()=>{
      const secs = [...LINKS].reverse();
      for(const id of secs){
        const el = document.getElementById(id);
        if(el && window.scrollY >= el.offsetTop - 90){ setActive(id); break; }
      }
    };
    window.addEventListener("scroll", handler);
    return ()=>window.removeEventListener("scroll", handler);
  },[]);

  return (
    <div style={{ background:C.bg, minHeight:"100vh" }}>
      <GlobalStyles/>
      <Cursor/>
      <ParticleCanvas/>
      <Navbar active={active} setActive={setActive}/>
      <Hero/>
      <About/>
      <Education/>
      <Skills/>
      <Projects/>
      <Journal/>
      <Career/>
      <Contact/>
      <footer style={{ background:"rgba(2,3,8,0.95)", textAlign:"center", padding:"2.5rem", borderTop:"1px solid rgba(255,255,255,0.05)", backdropFilter:"blur(10px)" }}>
        <div style={{ fontFamily:LOGO_F, fontSize:"1.2rem", letterSpacing:"0.1em",
          background:`linear-gradient(90deg,${C.cyan},${C.pink})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:"0.6rem",
        }}>SD.</div>
        <p style={{ color:"rgba(255,255,255,0.22)", fontSize:"0.8rem", fontFamily:BODY }}>
          © 2024 Supuni Dilhara · IT22169044 · SLIIT 
        </p>
      </footer>
    </div>
  );
}
