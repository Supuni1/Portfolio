import { useState, useEffect, useRef, useCallback } from "react";
import profilePic from "./assets/profile.jpg";

const C = {
  bg: "#03050d",
  bgCard: "rgba(255,255,255,0.04)",
  cyan: "#00f0ff",
  pink: "#ff2070",
  violet: "#b06aff",
  amber: "#ffb340",
  green: "#00e5a0",
  blue: "#4488ff",
  text: "#e2e8f0",
  muted: "#8896aa",
};

const DISPLAY = "'Cinzel', serif";
const BODY = "'Nunito', sans-serif";
const LOGO_F = "'Orbitron', sans-serif";
const LINKS = [
  "home",
  "about",
  "experience",
  "education",
  "skills",
  "projects",
  "journal",
  "career",
  "contact",
];
const LCOLS = [
  C.cyan,
  C.pink,
  C.green,
  C.violet,
  C.amber,
  C.blue,
  C.pink,
  C.cyan,
  C.green,
];

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Nunito:wght@300;400;500;600;700&family=Orbitron:wght@700;900&display=swap');

      @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes pulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
      @keyframes spinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes glow { 0%,100%{box-shadow:0 0 22px ${C.cyan}44,0 0 60px ${C.cyan}22} 50%{box-shadow:0 0 55px ${C.cyan}99,0 0 110px ${C.cyan}44} }
      @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(2deg)} }
      @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(-2deg)} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
      @keyframes rotate3d { 0%{transform:rotateX(0deg) rotateY(0deg)} 100%{transform:rotateX(360deg) rotateY(360deg)} }
      @keyframes float3d { 0%,100%{transform:translateZ(0) rotateX(0deg)} 50%{transform:translateZ(20px) rotateX(5deg)} }
      @keyframes glow3d { 0%,100%{filter:drop-shadow(0 0 8px ${C.cyan}44)} 50%{filter:drop-shadow(0 0 20px ${C.cyan}88)} }

      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      html { scroll-behavior:smooth; }
      body { background:${C.bg}; font-family:${BODY}; color:${C.text}; overflow-x:hidden; }
      ::-webkit-scrollbar { width:4px; }
      ::-webkit-scrollbar-track { background:${C.bg}; }
      ::-webkit-scrollbar-thumb { background:linear-gradient(${C.cyan},${C.pink}); border-radius:10px; }
      a { text-decoration:none; }

      .glass {
        background: rgba(255,255,255,0.05);
        backdrop-filter: blur(18px) saturate(1.5);
        -webkit-backdrop-filter: blur(18px) saturate(1.5);
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 20px;
      }

      .sec-fade { opacity:0; transform:translateY(48px); transition: opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); }
      .sec-fade.visible { opacity:1; transform:translateY(0); }

      .tilt-card { transition: transform .08s linear, box-shadow .3s; will-change:transform; }

      @media (max-width: 900px) {
        .hero-grid,
        .two-col,
        .skills-grid,
        .contact-grid {
          grid-template-columns: 1fr !important;
        }
        nav .nav-links {
          display: none !important;
        }
      }
    `}</style>
  );
}

function useSectionReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".sec-fade");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);

  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setV(true);
      },
      { threshold: 0.08 }
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(40px)",
        transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function TiltCard({ children, color = C.cyan, style = {} }) {
  const ref = useRef(null);

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -18;
      el.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
      el.style.boxShadow = `0 24px 60px ${color}28`;
    },
    [color]
  );

  const onLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform =
        "perspective(600px) rotateY(0) rotateX(0) translateY(0)";
      ref.current.style.boxShadow = "none";
    }
  }, []);

  return (
    <div
      ref={ref}
      className="tilt-card glass"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ border: `1px solid ${color}28`, ...style }}
    >
      {children}
    </div>
  );
}

/* ── 3D Cursor ──────────────────────────────── */
function Cursor3D() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
      if (ringRef.current) {
        ringRef.current.style.left = e.clientX + "px";
        ringRef.current.style.top = e.clientY + "px";
      }
    };

    const handleMouseOver = (e) => {
      if (
        (e.target.closest("a") ||
          e.target.closest("button") ||
          e.target.dataset.hover) &&
        ringRef.current
      ) {
        ringRef.current.style.width = "54px";
        ringRef.current.style.height = "54px";
        ringRef.current.style.borderColor = C.pink + "99";
        ringRef.current.style.background = C.pink + "11";
      }
    };

    const handleMouseOut = () => {
      if (ringRef.current) {
        ringRef.current.style.width = "36px";
        ringRef.current.style.height = "36px";
        ringRef.current.style.borderColor = C.cyan + "66";
        ringRef.current.style.background = "transparent";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          width: "8px",
          height: "8px",
          background: C.cyan,
          borderRadius: "50%",
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.1s",
          boxShadow: `0 0 12px ${C.cyan}`,
        }}
      />
      <div
        ref={ringRef}
        style={{
          width: "36px",
          height: "36px",
          border: `1.5px solid ${C.cyan}66`,
          borderRadius: "50%",
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "all 0.2s",
        }}
      />
    </>
  );
}

/* ── 3D Background ──────────────────────────── */
function Background3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      containerRef.current.style.perspective = "1000px";
      const children = containerRef.current.querySelectorAll("[data-depth]");
      children.forEach((el) => {
        const depth = parseFloat(el.dataset.depth);
        el.style.transform = `translate(${x * depth * 30}px, ${
          y * depth * 30
        }px) rotateX(${y * 5}deg) rotateY(${x * 5}deg)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        data-depth="0.1"
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.cyan}11 0%, transparent 70%)`,
          top: "-15%",
          left: "-10%",
          filter: "blur(40px)",
          transition: "transform 0.05s ease-out",
        }}
      />
      <div
        data-depth="0.2"
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.pink}0c 0%, transparent 70%)`,
          bottom: "-5%",
          right: "-5%",
          filter: "blur(50px)",
          transition: "transform 0.05s ease-out",
        }}
      />
      <div
        data-depth="0.15"
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.violet}0a 0%, transparent 70%)`,
          top: "35%",
          left: "40%",
          filter: "blur(45px)",
          transition: "transform 0.05s ease-out",
        }}
      />
    </div>
  );
}

/* ── 3D Particle Constellation Background ──────────── */
function ParticleConstellation3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 60;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let time = 0;

    // Particle class with 3D properties
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 300;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.vz = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 1.5 + 0.5;
        this.color = [C.cyan, C.pink, C.violet, C.blue].sort(
          () => Math.random() - 0.5
        )[0];
        this.baseOpacity = Math.random() * 0.3 + 0.15;
        this.angle = Math.random() * Math.PI * 2;
        this.orbitRadius = Math.random() * 100 + 50;
      }

      update(mouseX, mouseY) {
        // Orbital movement
        this.angle += 0.001;
        this.x += Math.cos(this.angle) * 0.5;
        this.y += Math.sin(this.angle) * 0.5;

        // Mouse attraction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          const force = (1 - distance / 200) * 0.02;
          this.vx += (dx / distance) * force;
          this.vy += (dy / distance) * force;
        }

        // Velocity damping
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vz *= 0.98;

        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        // Boundary wrapping
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
        if (this.z < 0) this.z = 300;
        if (this.z > 300) this.z = 0;
      }

      draw() {
        const scale = 300 / (300 + this.z);
        const opacity = this.baseOpacity * scale;

        ctx.fillStyle = this.color + Math.round(opacity * 255).toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * scale, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect for closer particles
        if (this.z < 100) {
          ctx.strokeStyle = this.color + Math.round((opacity * 100)).toString(16).padStart(2, "0");
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = "rgba(3, 5, 13, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      // Update particles
      particles.forEach((particle) => {
        particle.update(mouse.x, mouse.y);
        particle.draw();
      });

      // Draw constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const scale1 = 300 / (300 + particles[i].z);
            const scale2 = 300 / (300 + particles[j].z);
            const opacity = (1 - distance / 120) * 0.15 * (scale1 + scale2) * 0.5;

            const colorIndex = [C.cyan, C.pink, C.violet].indexOf(particles[i].color);
            const lineColor = [C.cyan, C.pink, C.violet][colorIndex];

            ctx.strokeStyle = lineColor + Math.round(opacity * 255).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.35,
      }}
    />
  );
}

function Navbar({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(3,5,13,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 6%",
        height: 66,
        transition: "all .4s",
      }}
    >
      <span
        style={{
          fontFamily: LOGO_F,
          fontSize: "1.15rem",
          letterSpacing: "0.1em",
          background: `linear-gradient(90deg,${C.cyan},${C.pink})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        SD.
      </span>

      <div className="nav-links" style={{ display: "flex", gap: "1.2rem" }}>
        {LINKS.map((l, i) => (
          <a
            key={l}
            href={`#${l}`}
            onClick={() => setActive(l)}
            style={{
              color: active === l ? LCOLS[i] : C.muted,
              fontFamily: BODY,
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 700,
              transition: "all .25s",
              borderBottom:
                active === l ? `1px solid ${LCOLS[i]}` : "1px solid transparent",
              paddingBottom: 2,
            }}
          >
            {l}
          </a>
        ))}
      </div>
    </nav>
  );
}

function SectionHeader({ label, title, color = C.cyan }) {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "0.9rem",
        }}
      >
        <span
          style={{
            width: 34,
            height: 2,
            background: color,
            display: "block",
            borderRadius: 2,
          }}
        />
        <span
          style={{
            color,
            fontSize: "0.72rem",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            fontFamily: BODY,
            fontWeight: 700,
          }}
        >
          {label}
        </span>
      </div>
      <h2
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: "clamp(2rem,4.5vw,3rem)",
          color: "#fff",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function Hero() {
  const [typed, setTyped] = useState("");
  const roles = [
    "QA Enthusiast",
    "Web Developer Trainee",
    "IT Undergraduate",
    "Future QA Engineer",
  ];
  const [ri, setRi] = useState(0);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    let i = 0;
    let adding = true;
    const role = roles[ri];
    const iv = setInterval(() => {
      if (adding) {
        setTyped(role.slice(0, i + 1));
        i++;
        if (i >= role.length) adding = false;
      } else {
        setTyped(role.slice(0, i - 1));
        i--;
        if (i <= 0) {
          adding = true;
          setRi((r) => (r + 1) % roles.length);
        }
      }
    }, 80);
    return () => clearInterval(iv);
  }, [ri]);

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "100px 8% 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(0,240,255,0.12), transparent 30%), radial-gradient(circle at 80% 70%, rgba(255,32,112,0.12), transparent 30%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="hero-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "3rem",
          alignItems: "center",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ animation: "fadeUp .9s ease both" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 20px",
              borderRadius: 50,
              marginBottom: "2rem",
              background: "rgba(0,240,255,0.07)",
              border: `1px solid ${C.cyan}44`,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.cyan,
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{
                color: C.cyan,
                fontSize: "0.78rem",
                letterSpacing: "0.1em",
                fontWeight: 600,
                fontFamily: BODY,
              }}
            >
              Open for QA Internship & Web Development Roles
            </span>
          </div>

          <h1
            style={{
              fontFamily: DISPLAY,
              fontWeight: 900,
              fontSize: "clamp(2.8rem,6.5vw,5.4rem)",
              lineHeight: 1.08,
              marginBottom: "0.7rem",
              background: `linear-gradient(135deg,#fff 25%,${C.cyan} 58%,${C.pink})`,
              backgroundSize: "220% 220%",
              animation: "shimmer 6s ease infinite",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Supuni
            <br />
            Dilhara
          </h1>

          <div
            style={{
              fontSize: "clamp(1rem,2.4vw,1.4rem)",
              fontFamily: BODY,
              color: C.muted,
              marginBottom: "1.7rem",
              minHeight: "2.4rem",
            }}
          >
            <span style={{ color: C.pink, fontWeight: 700 }}>{"< "}</span>
            <span style={{ color: C.amber, fontWeight: 600 }}>{typed}</span>
            <span style={{ color: C.cyan, animation: "blink 1s infinite" }}>
              |
            </span>
            <span style={{ color: C.pink, fontWeight: 700 }}>{" />"}</span>
          </div>

          <p
            style={{
              color: C.muted,
              fontSize: "1rem",
              lineHeight: 1.9,
              maxWidth: 560,
              marginBottom: "2.6rem",
              fontFamily: BODY,
            }}
          >
            IT undergraduate at SLIIT with hands-on industry experience as a Web
            Developer Trainee at Eco Engineers (Pvt) Ltd. Passionate about
            Software Quality Assurance, modern web development, and building
            reliable, user-friendly digital products.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="#projects"
              style={{
                padding: "0.82rem 2.4rem",
                borderRadius: 50,
                background: `linear-gradient(135deg,${C.cyan},${C.blue})`,
                color: "#000",
                fontWeight: 700,
              }}
            >
              View Projects
            </a>
            <a
              href="/cv.pdf"
              download
              style={{
                padding: "0.82rem 2.4rem",
                borderRadius: 50,
                background: `linear-gradient(135deg,${C.pink},${C.violet})`,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Download CV
            </a>
            <a
              href="#contact"
              style={{
                padding: "0.82rem 2.4rem",
                borderRadius: 50,
                background: "rgba(0,240,255,0.07)",
                color: C.cyan,
                border: `1px solid ${C.cyan}55`,
                fontWeight: 700,
              }}
            >
              Get In Touch
            </a>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            animation: "fadeUp 1.1s .15s ease both",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 360,
              height: 360,
              borderRadius: "50%",
              border: `2px dashed ${C.cyan}30`,
              animation: "spinRing 22s linear infinite",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />
          <div
            style={{
              width: 278,
              height: 278,
              borderRadius: "50%",
              border: `3px solid ${C.cyan}66`,
              animation: "glow 3.5s ease-in-out infinite",
              overflow: "hidden",
              background: "#0b0e1a",
            }}
          >
            {!imgErr ? (
              <img
                src={profilePic}
                alt="Supuni Dilhara"
                onError={() => setImgErr(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.cyan,
                  fontFamily: DISPLAY,
                  fontSize: "3rem",
                }}
              >
                SD
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const infos = [
    { k: "Full Name", v: "W.M.P.G. Supuni Dilhara" },
    { k: "Date of Birth", v: "28 February 2001" },
    { k: "Address", v: "Kap-ela, Kandalama, Dambulla" },
    { k: "Phone", v: "+94 71 737 3138" },
    { k: "Email", v: "supunidilhara1@gmail.com" },
    { k: "Languages", v: "Sinhala · English" },
    { k: "Reg. No.", v: "IT22169044" },
  ];

  return (
    <section id="about" className="sec-fade" style={{ padding: "100px 8%" }}>
      <Reveal>
        <SectionHeader label="Who I Am" title="About Me" color={C.pink} />
      </Reveal>

      <div
        className="two-col"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}
      >
        <Reveal delay={0.1}>
          <div>
            {[
              "I am an IT undergraduate at SLIIT with a strong passion for Software Quality Assurance and Web Development. I focus on building reliable, user-friendly applications while ensuring software quality through effective testing and continuous improvement.",
              "I have developed multiple academic and practical projects using technologies such as React, Node.js, Java, PHP, MySQL, and MongoDB. These experiences strengthened both my technical foundation and my problem-solving ability.",
              "Currently, I am working as a Web Developer Trainee at Eco Engineers (Pvt) Ltd, gaining real-world industry experience while actively preparing to grow into a professional QA role.",
            ].map((p, i) => (
              <p
                key={i}
                style={{
                  color: C.muted,
                  lineHeight: 1.95,
                  marginBottom: "1.2rem",
                  fontFamily: BODY,
                  fontSize: "0.97rem",
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass" style={{ padding: "2rem" }}>
            {infos.map((info, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "1rem",
                  padding: "0.8rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span
                  style={{
                    color: C.muted,
                    minWidth: 112,
                    fontSize: "0.85rem",
                    fontFamily: BODY,
                  }}
                >
                  {info.k}
                </span>
                <span
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    fontFamily: BODY,
                  }}
                >
                  {info.v}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Experience() {
  const items = [
    {
      period: "2025 – Present",
      title: "Web Developer Trainee",
      company: "Eco Engineers (Pvt) Ltd",
      detail:
        "Building and improving web applications, supporting UI development, and gaining practical experience with real-world software workflows.",
      color: C.green,
      icon: "💼",
    },
    {
      period: "Current Career Focus",
      title: "Software Quality Assurance Path",
      company: "Professional Development",
      detail:
        "Developing my skills in manual testing, bug reporting, quality-focused thinking, and software reliability to begin my career in QA.",
      color: C.cyan,
      icon: "🧪",
    },
  ];

  return (
    <section
      id="experience"
      className="sec-fade"
      style={{ padding: "100px 8%" }}
    >
      <Reveal>
        <SectionHeader
          label="Industry Experience"
          title="Professional Experience"
          color={C.green}
        />
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "1.5rem",
        }}
      >
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 0.12}>
            <TiltCard color={item.color} style={{ padding: "1.9rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: `${item.color}18`,
                    border: `2px solid ${item.color}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p
                    style={{
                      color: item.color,
                      fontSize: "0.72rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontFamily: BODY,
                      fontWeight: 700,
                    }}
                  >
                    {item.period}
                  </p>
                  <h3
                    style={{
                      color: "#fff",
                      fontFamily: DISPLAY,
                      fontWeight: 600,
                      fontSize: "1.03rem",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
              </div>
              <p
                style={{
                  color: C.text,
                  fontFamily: BODY,
                  fontWeight: 600,
                  marginBottom: "0.55rem",
                }}
              >
                {item.company}
              </p>
              <p
                style={{
                  color: C.muted,
                  lineHeight: 1.8,
                  fontFamily: BODY,
                  fontSize: "0.9rem",
                }}
              >
                {item.detail}
              </p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Education() {
  const items = [
    {
      year: "2022–Present",
      degree: "BSc (Hons) Information Technology",
      school: "SLIIT — Faculty of Computing",
      detail: "Reg. No. IT22169044",
      color: C.cyan,
      icon: "🎓",
    },
    {
      year: "2021",
      degree: "G.C.E. Advanced Level — Commerce Stream",
      school: "Rangiri Dambulla Central College",
      detail: "Accounting · Business · Economics",
      color: C.pink,
      icon: "📚",
    },
    {
      year: "2017",
      degree: "G.C.E. Ordinary Level",
      school: "Rangiri Dambulla Central College",
      detail: "3 A's · 1 B · 4 C's · 1 S",
      color: C.violet,
      icon: "📖",
    },
    {
      year: "Extra",
      degree: "English Diploma — ICBT · NVQ Level 4",
      school: "Information Technology",
      detail: "Vocational Training Authority",
      color: C.amber,
      icon: "📜",
    },
  ];

  return (
    <section
      id="education"
      className="sec-fade"
      style={{ padding: "100px 8%" }}
    >
      <Reveal>
        <SectionHeader
          label="Academic Background"
          title="Education"
          color={C.violet}
        />
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "1.5rem",
        }}
      >
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 0.12}>
            <TiltCard color={item.color} style={{ padding: "1.6rem 2rem" }}>
              <p
                style={{
                  color: item.color,
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.4rem",
                  fontFamily: BODY,
                  fontWeight: 700,
                }}
              >
                {item.year}
              </p>
              <h3
                style={{
                  color: "#fff",
                  fontFamily: DISPLAY,
                  fontWeight: 600,
                  fontSize: "1.02rem",
                  marginBottom: "0.3rem",
                }}
              >
                {item.degree}
              </h3>
              <p
                style={{
                  color: C.muted,
                  fontSize: "0.88rem",
                  marginBottom: "0.4rem",
                  fontFamily: BODY,
                }}
              >
                {item.school}
              </p>
              <p
                style={{
                  color: item.color,
                  fontSize: "0.82rem",
                  fontFamily: BODY,
                }}
              >
                {item.detail}
              </p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  const cats = [
    {
      title: "QA Skills",
      color: C.green,
      tags: [
        "Manual Testing",
        "Test Case Writing",
        "Bug Reporting",
        "SDLC",
        "Agile Basics",
      ],
    },
    {
      title: "Programming",
      color: C.cyan,
      tags: ["Java", "C", "C++", "PHP", "Kotlin"],
    },
    {
      title: "Web Development",
      color: C.pink,
      tags: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js"],
    },
    {
      title: "Databases",
      color: C.violet,
      tags: ["MySQL", "MongoDB"],
    },
    {
      title: "Tools",
      color: C.amber,
      tags: ["GitHub", "Visual Studio", "Android Studio", "NetBeans"],
    },
  ];

  return (
    <section id="skills" className="sec-fade" style={{ padding: "100px 8%" }}>
      <Reveal>
        <SectionHeader
          label="Competencies"
          title="Skills & Expertise"
          color={C.amber}
        />
      </Reveal>

      <div
        className="skills-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(255px,1fr))",
          gap: "1.4rem",
        }}
      >
        {cats.map((cat, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <TiltCard color={cat.color} style={{ padding: "1.6rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 18,
                    borderRadius: 2,
                    background: cat.color,
                  }}
                />
                <p
                  style={{
                    color: cat.color,
                    fontSize: "0.72rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontFamily: BODY,
                    fontWeight: 700,
                  }}
                >
                  {cat.title}
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {cat.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: `${cat.color}12`,
                      border: `1px solid ${cat.color}36`,
                      borderRadius: 50,
                      padding: "0.3rem 0.9rem",
                      color: cat.color,
                      fontSize: "0.8rem",
                      fontFamily: BODY,
                      fontWeight: 500,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const projects = [
    {
      n: "01",
      name: "Taxi Management System",
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      desc: "Developed a transport management system to organize bookings, records, and workflow operations efficiently.",
      color: C.cyan,
    },
    {
      n: "02",
      name: "Online Food Delivery System",
      tech: ["MongoDB", "Express.js", "React.js", "Node.js"],
      desc: "Built a full-stack food ordering platform with a modern frontend, backend integration, and database support.",
      color: C.pink,
    },
    {
      n: "03",
      name: "Customer Care Service",
      tech: ["Java", "JavaScript", "MySQL"],
      desc: "Created a service-oriented system to support customer communication, issue handling, and response tracking.",
      color: C.violet,
    },
    {
      n: "04",
      name: "Solar Monitoring System",
      tech: ["MongoDB", "Express.js", "React.js", "Node.js", "CSS"],
      desc: "Designed a monitoring platform to view and manage solar-related data and system performance effectively.",
      color: C.amber,
    },
    {
      n: "05",
      name: "Age Calculator Mobile App",
      tech: ["Kotlin", "Android Studio"],
      desc: "Built a simple mobile application for fast and accurate age calculation with a clean user experience.",
      color: C.green,
    },
    {
      n: "06",
      name: "Learning Platform with Social Features",
      tech: ["Java", "JavaScript", "MongoDB"],
      desc: "Developed an educational platform integrating learning content with user interaction and engagement features.",
      color: C.blue,
    },
    {
      n: "07",
      name: "Grocery Shop Billing System",
      tech: ["Java", "MySQL"],
      desc: "Created a billing and record management solution for grocery operations with efficient data handling.",
      color: C.pink,
    },
  ];

  return (
    <section id="projects" className="sec-fade" style={{ padding: "100px 8%" }}>
      <Reveal>
        <SectionHeader label="My Work" title="Projects" color={C.blue} />
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(295px,1fr))",
          gap: "1.5rem",
        }}
      >
        {projects.map((p, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <TiltCard color={p.color} style={{ padding: "1.85rem", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  right: 10,
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: "2.6rem",
                  color: `${p.color}15`,
                }}
              >
                {p.n}
              </div>
              <h3
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 600,
                  fontSize: "0.99rem",
                  color: "#fff",
                  marginBottom: "0.75rem",
                  lineHeight: 1.4,
                  paddingRight: "2rem",
                }}
              >
                {p.name}
              </h3>
              <p
                style={{
                  color: C.muted,
                  fontSize: "0.84rem",
                  lineHeight: 1.75,
                  marginBottom: "1rem",
                  fontFamily: BODY,
                }}
              >
                {p.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {p.tech.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: `${p.color}10`,
                      border: `1px solid ${p.color}36`,
                      borderRadius: 50,
                      padding: "0.25rem 0.7rem",
                      color: p.color,
                      fontSize: "0.72rem",
                      fontFamily: BODY,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section id="journal" className="sec-fade" style={{ padding: "100px 8%" }}>
      <Reveal>
        <SectionHeader
          label="PPW Module Reflection"
          title="Reflective Journal"
          color={C.pink}
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="glass" style={{ padding: "3rem 3.5rem" }}>
          {[
            "The Professional Practice in the Workplace module helped me understand how technical knowledge, communication, teamwork, and professionalism work together in the real IT industry.",
            "It improved my confidence in presenting myself professionally, planning my career, and identifying the skills I need to grow in Software Quality Assurance.",
            "Through this learning process, I became more focused on building a career where I can contribute to software quality, reliability, and user satisfaction.",
          ].map((p, i) => (
            <p
              key={i}
              style={{
                color: C.muted,
                lineHeight: 1.95,
                fontFamily: BODY,
                fontSize: "0.97rem",
                marginBottom: "1.2rem",
                fontStyle: "italic",
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Career() {
  const steps = [
    {
      phase: "2025 – Present",
      goal: "Web Developer Trainee",
      details:
        "Currently working at Eco Engineers (Pvt) Ltd and gaining practical experience in web application development and real-world software workflows.",
      color: C.cyan,
      n: "1",
    },
    {
      phase: "2025 – 2026 Goal",
      goal: "QA Internship",
      details:
        "Seeking an internship opportunity to apply testing knowledge, write test cases, report issues clearly, and contribute to product quality.",
      color: C.pink,
      n: "2",
    },
    {
      phase: "Long-Term Vision",
      goal: "QA Engineer",
      details:
        "Grow into a professional QA Engineer role with strong manual testing, automation, and quality assurance capabilities.",
      color: C.violet,
      n: "3",
    },
  ];

  return (
    <section id="career" className="sec-fade" style={{ padding: "100px 8%" }}>
      <Reveal>
        <SectionHeader
          label="Professional Development"
          title="Career Development Plan"
          color={C.cyan}
        />
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "1.5rem",
        }}
      >
        {steps.map((s, i) => (
          <Reveal key={i} delay={i * 0.12}>
            <TiltCard color={s.color} style={{ padding: "2rem", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: "3rem",
                  color: `${s.color}12`,
                }}
              >
                {s.n}
              </div>
              <p
                style={{
                  color: s.color,
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "0.6rem",
                  fontFamily: BODY,
                  fontWeight: 700,
                }}
              >
                {s.phase}
              </p>
              <h3
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  color: "#fff",
                  marginBottom: "0.85rem",
                }}
              >
                {s.goal}
              </h3>
              <p
                style={{
                  color: C.muted,
                  fontSize: "0.85rem",
                  lineHeight: 1.75,
                  fontFamily: BODY,
                }}
              >
                {s.details}
              </p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const contacts = [
    { icon: "📞", value: "+94 71 737 3138", color: C.cyan, href: "tel:+94717373138" },
    {
      icon: "✉️",
      value: "supunidilhara1@gmail.com",
      color: C.pink,
      href: "mailto:supunidilhara1@gmail.com",
    },
    {
      icon: "💼",
      value: "linkedin.com/in/supuni-dilhara",
      color: C.blue,
      href: "https://www.linkedin.com/in/supuni-dilhara",
    },
    {
      icon: "💻",
      value: "github.com/Supuni1",
      color: C.green,
      href: "https://github.com/Supuni1",
    },
  ];

  return (
    <section id="contact" className="sec-fade" style={{ padding: "100px 8%" }}>
      <Reveal>
        <SectionHeader
          label="Get In Touch"
          title="Contact"
          color={C.green}
        />
      </Reveal>

      <div
        className="contact-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}
      >
        <Reveal delay={0.1}>
          <div>
            <p
              style={{
                color: C.muted,
                marginBottom: "2rem",
                lineHeight: 1.85,
                fontFamily: BODY,
              }}
            >
              I am actively seeking QA Internship opportunities while continuing
              my work in web development. Feel free to contact me through email,
              LinkedIn, or GitHub for collaboration, internship opportunities,
              or professional networking.
            </p>
            <div className="glass" style={{ padding: "1rem 1.5rem" }}>
              {contacts.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.8rem 0.4rem",
                    borderBottom:
                      i < contacts.length - 1
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `${c.color}14`,
                      border: `1px solid ${c.color}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {c.icon}
                  </div>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: C.muted, fontSize: "0.9rem", fontFamily: BODY }}
                  >
                    {c.value}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <TiltCard color={C.cyan} style={{ padding: "2rem" }}>
            <h3
              style={{
                color: "#fff",
                fontFamily: DISPLAY,
                marginBottom: "1rem",
              }}
            >
              Quick Summary
            </h3>
            <p style={{ color: C.muted, lineHeight: 1.9 }}>
              IT undergraduate, Web Developer Trainee, and future QA Engineer
              with hands-on project work, growing industry exposure, and a strong
              interest in software quality and modern web technologies.
            </p>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState("home");
  useSectionReveal();

  useEffect(() => {
    const handler = () => {
      const secs = [...LINKS].reverse();
      for (const id of secs) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 90) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <GlobalStyles />
      <Cursor3D />
      <Background3D />
      <ParticleConstellation3D />
      <Navbar active={active} setActive={setActive} />
      <Hero />
      <About />
      <Experience />
      <Education />
      <Skills />
      <Projects />
      <Journal />
      <Career />
      <Contact />

      <footer
        style={{
          background: "rgba(2,3,8,0.95)",
          textAlign: "center",
          padding: "2.5rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            fontFamily: LOGO_F,
            fontSize: "1.2rem",
            letterSpacing: "0.1em",
            background: `linear-gradient(90deg,${C.cyan},${C.pink})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.6rem",
          }}
        >
          SD.
        </div>
        <p
          style={{
            color: "rgba(255,255,255,0.22)",
            fontSize: "0.8rem",
            fontFamily: BODY,
          }}
        >
          © 2025 Supuni Dilhara · Portfolio · Software QA & Web Development
        </p>
      </footer>
    </div>
  );
}