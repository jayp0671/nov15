import React, { useEffect, useRef, useState } from "react";

export default function App() {
  // ——— Personalize here ———
  const NAME = "Suhani";
  const EVENT_NAME = "Marine Corps Ball";
  const EVENT_DATE_ISO = "2025-11-15T19:00:00-05:00"; // Nov 15, 2025 @ 7PM EST
  const LOCATION = "New York Marriott at the Brooklyn Bridge";
  const DRESS_CODE = "Formal";
  const PHONE_FOR_SMS = "8482347433"; // digits only
  // ————————————————

  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState({ top: 70, left: 240 });
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(EVENT_DATE_ISO));

  // NEW: dodge counter + lock after 10
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noLocked, setNoLocked] = useState(false);

  const heartsRef = useRef(null);
  const detailsRef = useRef(null);
  const fxRef = useRef(null);

  // countdown
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(EVENT_DATE_ISO)), 1000);
    return () => clearInterval(id);
  }, []);

  function getTimeLeft(dateStr) {
    const t = new Date(dateStr).getTime();
    if (isNaN(t)) return null;
    const diff = t - Date.now();
    if (diff <= 0) return null;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);
    return { d, h, m, s };
  }

  function sayYes() {
    setAccepted(true);
    popHearts();
    launchFireworks(2400);
    setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: "smooth" }), 240);
  }

  function popHearts() {
    const container = heartsRef.current;
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const span = document.createElement("span");
      span.className = "heart-pop";
      span.style.left = Math.random() * 100 + "%";
      span.style.animationDuration = 2 + Math.random() * 1.8 + "s";
      span.style.fontSize = 14 + Math.random() * 28 + "px";
      span.style.setProperty("--xdrift", (Math.random() * 120 - 60) + "px");
      container.appendChild(span);
      setTimeout(() => container.removeChild(span), 3800);
    }
  }

  // Dodge “No :(” until 10, then transform into a “yes” button
  function dodgeButton() {
    if (noLocked) return; // stop dodging after 10
    const area = document.querySelector(".cta-area");
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const padding = 12;
    const maxLeft = rect.width - 160;
    const maxTop = rect.height - 52;
    const left = Math.max(padding, Math.min(maxLeft, Math.random() * rect.width));
    const top = Math.max(padding, Math.min(maxTop, Math.random() * rect.height));
    setNoPos({ top, left });

    setDodgeCount(prev => {
      const next = prev + 1;
      if (next >= 10) {
        setNoLocked(true);
        // little celebratory tease
        popHearts();
        launchFireworks(900);
      }
      return next;
    });
  }

  // fireworks
  function launchFireworks(duration = 2000) {
    const canvas = fxRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles = [];
    const gravity = 0.12;
    const colors = ["#FFD700", "#FF364D", "#FF6A00", "#FFFFFF", "#C0002E"];

    function burst(x, y) {
      const count = 40 + Math.floor(Math.random() * 25);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const speed = 2 + Math.random() * 3.2;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          life: 50 + Math.random() * 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 2 + Math.random() * 2.4
        });
      }
    }

    const bounds = canvas.getBoundingClientRect();
    [0.22, 0.5, 0.78].forEach((p, i) => {
      setTimeout(() => burst(bounds.width * p, bounds.height - 12 - Math.random()*20), i * 180);
    });

    let running = true;
    const endAt = performance.now() + duration;

    function tick() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      particles.forEach((p) => {
        p.life -= 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].life <= 0) particles.splice(i, 1);
      }

      if (performance.now() < endAt && Math.random() < 0.06) {
        burst(Math.random() * bounds.width, bounds.height * (0.35 + Math.random() * 0.4));
      }

      ctx.globalCompositeOperation = "source-over";
      if (running && (particles.length > 0 || performance.now() < endAt)) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }
    tick();
    setTimeout(() => (running = false), duration + 1200);
  }

  return (
    <main className="page">
      <style>{css}</style>
      <div className="sparkle-layer" aria-hidden="true" />

      <header className="topbar">
        <div className="badge">✦ 2025</div>
        <div className="title">Marine Corps Ball Invite</div>
      </header>

      <section className="hero">
        <h1 className="shimmer">
          {NAME}, will you be my date to the <span className="gold">{EVENT_NAME}</span>?
        </h1>
        <p className="sub">
          Dinner, dancing, and way too many photos. I’ll wear my dress blues if you wear that smile. 💫
        </p>
        <div className="wave-sep" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,40 C320,100 560,0 900,60 C1150,105 1300,80 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      <section className="cta-block">
        {timeLeft && (
          <div className="countdown flip">
            <FlipUnit label="days" value={timeLeft.d} />
            <FlipUnit label="hrs" value={timeLeft.h} />
            <FlipUnit label="mins" value={timeLeft.m} />
            <FlipUnit label="secs" value={timeLeft.s} />
          </div>
        )}

        <div className="cta-area">
          <button className="btn yes with-sheen" onClick={sayYes}>Yes, obviously</button>

          <button
            className={`btn no ${noLocked ? "nolocked" : ""}`}
            style={{ top: noPos.top, left: noPos.left }}
            onMouseEnter={dodgeButton}
            onFocus={dodgeButton}
            onClick={() => noLocked && sayYes()}
          >
            {noLocked ? "ugh fine yes" : "No :("}
          </button>

          <div className="dodge-counter">dodge {dodgeCount}/10</div>
        </div>

        <div className="fx-wrap">
          <div className="hearts" ref={heartsRef} aria-hidden="true" />
          <canvas className="fireworks" ref={fxRef} />
        </div>

        <div className="wave-sep invert" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,40 C320,100 560,0 900,60 C1150,105 1300,80 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {accepted && (
        <section className="reveal" ref={detailsRef}>
          <div className="card glow">
            <h2>YAY! 🥂</h2>
            <p>You just made my week. Here are the details:</p>
            <ul className="details">
              <li><span>Date/Time</span>{new Date(EVENT_DATE_ISO).toLocaleString("en-US", { timeZone: "America/New_York" })}</li>
              <li><span>Location</span>{LOCATION}</li>
              <li><span>Dress</span>{DRESS_CODE}</li>
            </ul>
            <div className="actions">
              <a className="btn outline" href={`sms:${PHONE_FOR_SMS}?&body=YES%20to%20the%20${encodeURIComponent(EVENT_NAME)}!`}>Text me “YES”</a>
              <button className="btn ghost" onClick={() => { popHearts(); launchFireworks(1400); }}>More sparkles</button>
            </div>
            <p className="tiny">I’ll handle rides, photos, and the late‑night food run 🍕</p>
          </div>
        </section>
      )}

      <footer className="footer">Made with love by your Jayu</footer>
    </main>
  );
}

function FlipUnit({ label, value }) {
  return (
    <div className="flip-unit">
      <div className="flip-card" data-value={value} />
      <span className="flip-label">{label}</span>
    </div>
  );
}

/* CSS (inline) */
const css = `
:root{
  --black:#000000;
  --navy:#0B1B32;
  --navy2:#132b4f;
  --scarlet:#C0002E;
  --gold:#FFD700;
  --white:#FFFFFF;
  --ivory:#F8F7F3;
  --muted:#9aa6b2;
}

/* Reset & base */
*{box-sizing:border-box}
html,body,#root{height:100%}
body{
  margin:0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
  color:var(--ivory);
  background:
    radial-gradient(1200px 800px at 70% -20%, rgba(255,215,0,0.10), transparent 60%),
    radial-gradient(900px 600px at 10% -10%, rgba(192,0,46,0.18), transparent 60%),
    linear-gradient(180deg, var(--black), var(--navy) 65%, #000 130%);
  overflow-x:hidden;
}
.page{position:relative; min-height:100%}

/* tiny sparkle field */
.sparkle-layer{
  pointer-events:none; position:fixed; inset:0; z-index:0;
  background:
    radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.35), transparent 35%),
    radial-gradient(2px 2px at 70% 20%, rgba(255,255,255,.3), transparent 35%),
    radial-gradient(2px 2px at 40% 80%, rgba(255,215,0,.35), transparent 35%),
    radial-gradient(1.5px 1.5px at 85% 70%, rgba(255,255,255,.28), transparent 40%);
  animation: twinkle 6s linear infinite;
  opacity:.75;
}
@keyframes twinkle {
  0% { filter:brightness(1); transform:translateY(0) }
  50% { filter:brightness(1.25); transform:translateY(-4px) }
  100% { filter:brightness(1); transform:translateY(0) }
}

/* Top bar */
.topbar{
  position:sticky; top:0; z-index:10;
  display:flex; justify-content:center; align-items:center; gap:12px;
  padding:14px 18px; backdrop-filter:blur(10px);
  background:linear-gradient(180deg, rgba(0,0,0,.65), rgba(0,0,0,0));
  border-bottom:1px solid rgba(255,255,255,.06);
}
.topbar .badge{
  font-size:12px; letter-spacing:.2em; color:var(--white);
  border:1px solid rgba(255,255,255,.25); padding:6px 10px; border-radius:999px;
  background: linear-gradient(180deg, rgba(255,215,0,.1), rgba(255,215,0,.02));
}
.topbar .title{font-weight:600; color:#d6dbe1; opacity:.95}

/* HERO */
.hero{
  position:relative; z-index:1;
  max-width:980px; margin:0 auto; padding:74px 20px 38px; text-align:center;
  background: linear-gradient(180deg, #000000, var(--navy));
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.hero h1{
  font-size: clamp(34px, 5vw, 62px);
  line-height:1.06; margin:0 0 10px; font-weight:900; letter-spacing:.3px;
}
.shimmer{
  background: linear-gradient(92deg, var(--white) 0%, #FFE08A 20%, var(--gold) 40%, var(--white) 60%, #FFE08A 80%, var(--gold) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine 3.2s linear infinite;
  text-shadow: 0 0 22px rgba(255,215,0,.12);
}
@keyframes shine { 0% { background-position:0% 50% } 100% { background-position:200% 50% } }
.gold{color:var(--gold)}
.sub{ margin:10px auto 6px; max-width:700px; color:#e4e8ee; }

/* waves */
.wave-sep{ height:56px; margin-top:24px; opacity:.8 }
.wave-sep svg path{ fill: rgba(192,0,46,.12) }
.wave-sep.invert svg path{ fill: rgba(255,215,0,.12) }

/* CTA BLOCK */
.cta-block{
  position:relative; z-index:1;
  background: linear-gradient(180deg, var(--navy), var(--navy2));
  padding: 24px 0 70px;
  border-top: 1px solid rgba(255,255,255,.08);
  border-bottom: 1px solid rgba(255,255,255,.08);
}

/* Countdown */
.countdown{
  margin:6px auto 20px; display:flex; gap:16px; justify-content:center; flex-wrap:wrap;
}
.flip-unit{ text-align:center }
.flip-label{ font-size:12px; color:var(--muted); letter-spacing:.08em }
.flip-card{
  position:relative; width:92px; height:64px; margin:0 auto 6px; perspective:600px;
}
.flip-card::after{
  content:attr(data-value);
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center;
  font-weight:900; font-size:26px;
  background:linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.04));
  border:1px solid rgba(255,255,255,.18);
  border-radius:12px;
  box-shadow:0 8px 22px rgba(0,0,0,.35);
  animation: flipIn .8s ease;
}
@keyframes flipIn { 0% { transform: rotateX(90deg); opacity:0 } 100% { transform: rotateX(0deg); opacity:1 } }

/* Buttons */
.cta-area{
  position:relative; height:180px; margin-top:10px;
  display:flex; justify-content:center; align-items:center; gap:16px;
}
.btn{
  appearance:none; border:none; cursor:pointer; font-weight:900; letter-spacing:.2px;
  padding:15px 22px; border-radius:16px;
  transition:transform .12s ease, box-shadow .2s, background .2s, color .2s;
  position:relative; overflow:hidden;
}
.btn:active{transform:translateY(1px)}
.with-sheen::before{
  content:""; position:absolute; top:-100%; left:-30%; width:60%; height:300%;
  transform:rotate(25deg);
  background:linear-gradient(90deg, rgba(255,255,255,.0), rgba(255,255,255,.65), rgba(255,255,255,0));
  filter:blur(4px); animation: sheen 2.4s linear infinite;
}
@keyframes sheen { 0% { transform:translateX(-120%) rotate(25deg) } 100% { transform:translateX(220%) rotate(25deg) } }
.btn.yes{
  background: linear-gradient(180deg, var(--gold), #e4c600);
  color:#201a00; box-shadow:0 10px 26px rgba(255,215,0,.35), inset 0 0 0 2px rgba(255,255,255,.12);
}
.btn.yes:hover{ transform:translateY(-1px) scale(1.02); box-shadow:0 14px 34px rgba(255,215,0,.45) }
.btn.no{
  position:absolute; background:linear-gradient(180deg, #2b0b15, #16060a);
  color:#ffd9e0; border:1px solid rgba(192,0,46,.6); box-shadow:0 10px 22px rgba(192,0,46,.32);
}
.btn.no:hover{transform:translate(0,0)} /* JS moves it */
.btn.no.nolocked{
  position:static; /* stop absolute positioning when locked */
  background:linear-gradient(180deg, #FFE08A, var(--gold));
  color:#1a1400; border:1px solid rgba(255,255,255,.18);
  box-shadow:0 10px 26px rgba(255,215,0,.35);
  animation: bop .6s ease;
}
@keyframes bop {
  0%{ transform: scale(0.98) }
  70%{ transform: scale(1.04) }
  100%{ transform: scale(1) }
}
.dodge-counter{
  position:absolute; bottom:8px; right:8px;
  font-size:12px; color:#e3e8f0; opacity:.8;
}

/* FX layers */
.fx-wrap{ position:relative; width:100%; height:0; }
.hearts{ position:relative; height:0; }
.heart-pop{
  position:absolute; bottom:-8px; animation: rise linear forwards;
  opacity:.95; filter:drop-shadow(0 4px 12px rgba(255,0,70,.35));
}
.heart-pop::before{ content:"❤"; }
@keyframes rise {
  0% { transform: translate(0,0) scale(.9) rotate(0deg); opacity:.95; color:#ff6b87; }
  50%{ color:#FF364D; transform: translate(var(--xdrift), -120px) scale(1.2) rotate(10deg); }
  100%{ color:#FF1133; transform: translate(calc(var(--xdrift) * 1.2), -240px) scale(1.45) rotate(18deg); opacity:0; }
}
.fireworks{
  position:absolute; left:0; right:0; margin:0 auto;
  width:min(1000px, 92vw); height:240px; pointer-events:none; display:block;
}

/* REVEAL */
.reveal{ background: linear-gradient(180deg, rgba(255,215,0,.12), rgba(255,215,0,.05));
  padding: 64px 20px 90px; display:flex; justify-content:center; }
.card{
  width:min(820px, 92vw); background:linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.03));
  border:1px solid rgba(255,255,255,.2); border-radius:18px; padding:28px 22px;
  box-shadow:0 24px 60px rgba(0,0,0,.48); text-align:center;
}
.card.glow{ box-shadow: 0 0 0 1px rgba(255,215,0,.28), 0 18px 60px rgba(0,0,0,.55), 0 0 26px rgba(255,215,0,.15) inset; }
.card h2{margin:0 0 10px 0; font-size:28px}
.details{ list-style:none; padding:0; margin:18px auto 14px; text-align:left; max-width:560px; }
.details li{
  display:flex; justify-content:space-between; gap:12px; padding:12px 0;
  border-bottom:1px dashed rgba(255,255,255,.18);
}
.details li span{color:#ccd3da}
.actions{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:18px; }
.btn.outline{ background:transparent; color:var(--gold); border:1.5px solid var(--gold); }
.btn.outline:hover{background:rgba(255,215,0,.08)}
.btn.ghost{ background:transparent; color:#e9eef5; border:1px solid rgba(255,255,255,.22) }
.btn.ghost:hover{background:rgba(255,255,255,.08)}
.tiny{color:#cdd3da; font-size:13px; margin-top:14px}

/* Footer */
.footer{ background:#000; padding:26px; text-align:center; font-size:12px; color:#c4cbd3; opacity:.9; }

.dodge-counter {
  display: none;
}
`;
