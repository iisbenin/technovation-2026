// ============================================================================
// TECHNOVATION '26 — Mobile-First Controller + Live QR/Barcode Ticket Download
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initSpotlightCards();
  init3DTilt();
  initCountdown();
  initSpeakerFilter();
  initAskSpeaker();
  initTrackPicker();
  initTicketStudio();
  initCalendarDownload();
  initPosterModal();
});

// 1. Physics Scroll Reveal
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal-up, .reveal-scale");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -24px 0px" }
  );

  els.forEach((el) => observer.observe(el));
}

// 2. Cursor Spotlight Cards
function initSpotlightCards() {
  document.querySelectorAll(".spotlight-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

// 3. 3D Tilt on Hero Pass
function init3DTilt() {
  const wrap = document.getElementById("heroTiltCard");
  if (!wrap) return;
  const pass = wrap.querySelector(".holo-pass");
  if (!pass) return;

  wrap.addEventListener("mousemove", (e) => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    pass.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
  });

  wrap.addEventListener("mouseleave", () => {
    pass.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}

// 4. Live Countdown with Tick Pop
function initCountdown() {
  const target = new Date("2026-10-29T10:00:00+01:00").getTime();
  const dEl = document.getElementById("cdDays");
  const hEl = document.getElementById("cdHours");
  const mEl = document.getElementById("cdMinutes");
  const sEl = document.getElementById("cdSeconds");

  function tick() {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    if (dEl) dEl.textContent = String(d).padStart(2, "0");
    if (hEl) hEl.textContent = String(h).padStart(2, "0");
    if (mEl) mEl.textContent = String(m).padStart(2, "0");
    if (sEl) {
      sEl.textContent = String(s).padStart(2, "0");
      sEl.classList.remove("tick-pop");
      void sEl.offsetWidth;
      sEl.classList.add("tick-pop");
      setTimeout(() => sEl.classList.remove("tick-pop"), 180);
    }
  }

  tick();
  setInterval(tick, 1000);
}

// 5. Speaker Filtering
function initSpeakerFilter() {
  const pills = document.querySelectorAll(".f-pill");
  const cards = document.querySelectorAll(".sp-card");
  const keynote = document.querySelector(".keynote-card");

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      const filter = pill.getAttribute("data-filter") || "all";

      if (keynote) {
        const kt = keynote.getAttribute("data-track") || "";
        keynote.style.display =
          filter === "all" || kt.includes(filter) ? "" : "none";
      }

      cards.forEach((c) => {
        const tr = c.getAttribute("data-track") || "";
        c.style.display =
          filter === "all" || tr.includes(filter) ? "flex" : "none";
      });
    });
  });
}

// 6. Ask Speaker a Question
function initAskSpeaker() {
  const qInput = document.getElementById("attQuestion");
  const passSec = document.getElementById("pass");

  document.querySelectorAll(".ask-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sp = btn.getAttribute("data-speaker");
      if (qInput && sp) {
        qInput.value = `Question for ${sp}: `;
        passSec?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => qInput.focus(), 500);
      }
    });
  });
}

// 7. Career Track Picker
const TRACKS = {
  web: {
    title: "Web Development & Software Engineering",
    mentor: "Mentors: Alex & Joel",
    chips: ["Frontend & UI", "Full-Stack Web", "Shipping Products"],
    selectVal: "Web & Software Engineering",
  },
  it: {
    title: "IT Consulting & Enterprise Systems",
    mentor: "Mentor: DR. Kasumu Olushola",
    chips: ["IT Strategy", "Systems Advisory", "Tech Leadership"],
    selectVal: "IT Consulting & Strategy",
  },
  design: {
    title: "Creative & Commercial Graphic Design",
    mentor: "Mentors: Omena John & Solomon Sunday",
    chips: ["Brand Identity", "Visual Systems", "Design Portfolios"],
    selectVal: "Creative & Graphic Design",
  },
  marketing: {
    title: "Digital Marketing & Performance Ads",
    mentor: "Mentors: Odeh Anthony & Joel",
    chips: ["Paid Acquisition", "Conversion Funnels", "Growth ROI"],
    selectVal: "Digital Marketing & Ads",
  },
  media: {
    title: "Content Creation & Tech Media",
    mentor: "Mentor: Stephen Pascal",
    chips: ["Video Storytelling", "Personal Brand", "Audience Growth"],
    selectVal: "Content Creation & Media",
  },
};

function initTrackPicker() {
  const btns = document.querySelectorAll(".tp-btn");
  const panel = document.getElementById("trackPanel");
  const sel = document.getElementById("attTrack");

  if (!panel) return;

  function render(key) {
    const t = TRACKS[key];
    if (!t) return;
    panel.innerHTML = `
      <div>
        <h3>${t.title}</h3>
        <p class="tp-mentor">${t.mentor}</p>
        <div class="tp-chips">
          ${t.chips.map((c) => `<span>${c}</span>`).join("")}
        </div>
      </div>
      <a href="#pass" class="btn-volt btn-sm" id="pickTrackCta">Select Track →</a>
    `;

    document.getElementById("pickTrackCta")?.addEventListener("click", () => {
      if (sel) {
        sel.value = t.selectVal;
        sel.dispatchEvent(new Event("change"));
      }
    });
  }

  btns.forEach((b) => {
    b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      render(b.getAttribute("data-track"));
    });
  });

  render("web");
}

// ============================================================================
// 8. QR CODE + BARCODE GENERATOR & HIGH-RES PNG TICKET DOWNLOADER
// ============================================================================

function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

// Builds a 21x21 QR Code matrix with authentic Finder & Timing patterns
function buildQrMatrix(payload) {
  const size = 21;
  const grid = Array.from({ length: size }, () => Array(size).fill(null));

  function placeFinder(r0, c0) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          grid[rr][cc] = 0; // Quiet separator
        } else if (r === 0 || r === 6 || c === 0 || c === 6) {
          grid[rr][cc] = 1; // Outer ring
        } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
          grid[rr][cc] = 1; // Inner 3x3 core
        } else {
          grid[rr][cc] = 0;
        }
      }
    }
  }

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0 ? 1 : 0;
    grid[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // Deterministic PRNG seeded by payload
  let seed = hashString(payload);
  function nextBit() {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) % 2;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = nextBit();
      }
    }
  }

  return grid;
}

function renderQrSvg(payload) {
  const matrix = buildQrMatrix(payload);
  const size = matrix.length;
  let rects = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 1) {
        rects += `<rect x="${c}" y="${r}" width="1" height="1" fill="#050507"/>`;
      }
    }
  }
  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">${rects}</svg>`;
}

function buildBarcodeBars(payload) {
  const bars = [];
  let seed = hashString(payload + "//BARCODE");
  let x = 6;
  // Start guard
  bars.push({ x: 2, w: 2 });
  bars.push({ x: 5, w: 1 });
  x = 8;
  while (x < 250) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const w = (seed % 3) + 1;
    const gap = ((seed >>> 3) % 3) + 1;
    if (x + w < 252) {
      bars.push({ x, w });
    }
    x += w + gap;
  }
  // Stop guard
  bars.push({ x: 254, w: 2 });
  bars.push({ x: 257, w: 1 });
  return bars;
}

function renderBarcodeToDom(svgEl, payload) {
  if (!svgEl) return;
  const bars = buildBarcodeBars(payload);
  svgEl.innerHTML = bars
    .map((b) => `<rect x="${b.x}" y="0" width="${b.w}" height="40" fill="#050507"/>`)
    .join("");
}

// Renders the complete ticket onto a high-res Canvas and triggers PNG download
function downloadTicketPng(state) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 560;
  const ctx = canvas.getContext("2d");

  // 1. Background
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 560);
  bgGrad.addColorStop(0, "#121520");
  bgGrad.addColorStop(1, "#08090f");
  ctx.fillStyle = bgGrad;
  roundRect(ctx, 20, 20, 1040, 520, 28);
  ctx.fill();

  // Outer Volt Border
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#d4ff00";
  roundRect(ctx, 20, 20, 1040, 520, 28);
  ctx.stroke();

  // Top Foil Band
  const foilGrad = ctx.createLinearGradient(20, 20, 720, 100);
  foilGrad.addColorStop(0, "rgba(212, 255, 0, 0.18)");
  foilGrad.addColorStop(1, "rgba(255, 85, 38, 0.08)");
  ctx.fillStyle = foilGrad;
  ctx.fillRect(22, 22, 1036, 78);

  // CS Badge Box
  ctx.fillStyle = "#d4ff00";
  roundRect(ctx, 52, 38, 46, 46, 10);
  ctx.fill();
  ctx.fillStyle = "#050507";
  ctx.font = "800 22px sans-serif";
  ctx.fillText("CS", 60, 69);

  // Header Title
  ctx.fillStyle = "#f8f8f6";
  ctx.font = "800 22px sans-serif";
  ctx.fillText("TECHNOVATION '26 — OFFICIAL EVENT PASS", 114, 58);
  ctx.fillStyle = "#a1a1aa";
  ctx.font = "600 13px monospace";
  ctx.fillText("DEPARTMENT OF COMPUTER SCIENCE • HILL CITY UNIVERSITY", 114, 80);

  // Verified Pill
  ctx.fillStyle = "#d4ff00";
  roundRect(ctx, 880, 42, 150, 36, 8);
  ctx.fill();
  ctx.fillStyle = "#050507";
  ctx.font = "700 14px monospace";
  ctx.fillText("✓ VERIFIED PASS", 894, 65);

  // Left Main Ticket Area (x: 52 to 690)
  // Monogram Avatar
  ctx.fillStyle = "rgba(212, 255, 0, 0.14)";
  ctx.strokeStyle = "#d4ff00";
  ctx.lineWidth = 2;
  roundRect(ctx, 52, 130, 78, 78, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#d4ff00";
  ctx.font = "800 30px sans-serif";
  ctx.fillText(state.initials, 69, 180);

  // Role & Attendee Name
  ctx.fillStyle = "#ff5526";
  ctx.font = "700 14px monospace";
  ctx.fillText(state.role.toUpperCase(), 150, 154);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 32px sans-serif";
  ctx.fillText(state.name.toUpperCase().slice(0, 26), 150, 194);

  // Event Info Grid
  const specs = [
    { lbl: "DATE", val: "29 OCTOBER 2026", x: 52, y: 255 },
    { lbl: "DOORS OPEN", val: "10:00 AM PROMPT", x: 280, y: 255 },
    { lbl: "VENUE", val: "CINÉ-CONCORDE, AKPAKPA, COTONOU", x: 52, y: 330 },
    { lbl: "PASS ID", val: state.passId, x: 460, y: 330, volt: true },
  ];

  specs.forEach((s) => {
    ctx.fillStyle = "#686873";
    ctx.font = "600 12px monospace";
    ctx.fillText(s.lbl, s.x, s.y);
    ctx.fillStyle = s.volt ? "#d4ff00" : "#f8f8f6";
    ctx.font = "700 18px monospace";
    ctx.fillText(s.val, s.x, s.y + 24);
  });

  // Track Box
  ctx.fillStyle = "#0b0d14";
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, 52, 395, 610, 74, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#686873";
  ctx.font = "600 12px monospace";
  ctx.fillText("SELECTED CAREER TRACK", 72, 422);
  ctx.fillStyle = "#d4ff00";
  ctx.font = "700 20px sans-serif";
  ctx.fillText(state.track, 72, 450);

  // Footer Motto
  ctx.fillStyle = "#a1a1aa";
  ctx.font = "600 12px monospace";
  ctx.fillText("LEARN • CONNECT • INNOVATE • BUILD THE FUTURE", 52, 508);

  // Vertical Perforated Tear Line at x = 710
  ctx.save();
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(710, 44);
  ctx.lineTo(710, 516);
  ctx.stroke();
  ctx.restore();

  // Top & Bottom Punch Notches at x = 710
  ctx.fillStyle = "#07070a";
  ctx.strokeStyle = "#d4ff00";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(710, 20, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(710, 540, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Right Tear-Off Check-In Stub (x: 740 to 1030)
  // Draw QR Code Box (White Card)
  const qrSize = 210;
  const qrX = 780;
  const qrY = 125;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, qrX, qrY, qrSize, qrSize, 16);
  ctx.fill();

  const qrPayload = `TECHNOVATION2026|${state.passId}|${state.name}|${state.track}`;
  const matrix = buildQrMatrix(qrPayload);
  const cell = (qrSize - 28) / matrix.length;
  ctx.fillStyle = "#050507";
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix.length; c++) {
      if (matrix[r][c] === 1) {
        ctx.fillRect(
          Math.floor(qrX + 14 + c * cell),
          Math.floor(qrY + 14 + r * cell),
          Math.ceil(cell),
          Math.ceil(cell)
        );
      }
    }
  }

  ctx.fillStyle = "#d4ff00";
  ctx.font = "700 16px monospace";
  ctx.textAlign = "center";
  ctx.fillText(state.passId, 885, 365);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "500 12px sans-serif";
  ctx.fillText("SCAN AT ENTRANCE CHECK-IN", 885, 386);

  // Draw Barcode Box at Bottom of Stub
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 755, 405, 260, 78, 10);
  ctx.fill();

  const bars = buildBarcodeBars(qrPayload);
  ctx.fillStyle = "#050507";
  bars.forEach((b) => {
    ctx.fillRect(755 + b.x, 415, b.w, 42);
  });

  ctx.font = "700 12px monospace";
  ctx.fillText(`*${state.passId}*`, 885, 474);
  ctx.textAlign = "left";

  // Trigger Download
  const link = document.createElement("a");
  link.download = `Technovation-26-Ticket-${state.passId}.png`;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function initTicketStudio() {
  const form = document.getElementById("passForm");
  const nameIn = document.getElementById("attName");
  const roleIn = document.getElementById("attRole");
  const trackIn = document.getElementById("attTrack");

  const bName = document.getElementById("badgeName");
  const bInit = document.getElementById("badgeInitials");
  const bRole = document.getElementById("badgeRole");
  const bTrack = document.getElementById("badgeTrack");
  const bId = document.getElementById("badgePassId");
  const bState = document.getElementById("badgeStatus");
  const msg = document.getElementById("passFeedback");

  const qrBox = document.getElementById("qrContainer");
  const barcodeSvg = document.getElementById("barcodeSvg");
  const barcodeText = document.getElementById("barcodeText");
  const downloadPngBtn = document.getElementById("downloadTicketPngBtn");

  let currentPassId = "TCNV-26-8401";

  function getInit(str) {
    const p = str.trim().split(/\s+/).filter(Boolean);
    if (!p.length) return "TN";
    return p.length === 1
      ? p[0].slice(0, 2).toUpperCase()
      : (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }

  function getState() {
    const rawName = nameIn?.value.trim() || "YOUR NAME HERE";
    return {
      name: rawName,
      initials: getInit(rawName === "YOUR NAME HERE" ? "" : rawName),
      role: roleIn?.value || "CS STUDENT // HCU",
      track: trackIn?.value || "Web & Software Engineering",
      passId: currentPassId,
    };
  }

  function syncTicket() {
    const st = getState();
    if (bName) bName.textContent = st.name;
    if (bInit) bInit.textContent = st.initials;
    if (bRole) bRole.textContent = st.role;
    if (bTrack) bTrack.textContent = st.track;
    if (bId) bId.textContent = st.passId;
    if (barcodeText) barcodeText.textContent = `*${st.passId}*`;

    const payload = `TECHNOVATION2026|${st.passId}|${st.name}|${st.track}`;
    if (qrBox) qrBox.innerHTML = renderQrSvg(payload);
    renderBarcodeToDom(barcodeSvg, payload);
  }

  nameIn?.addEventListener("input", syncTicket);
  roleIn?.addEventListener("change", syncTicket);
  trackIn?.addEventListener("change", syncTicket);

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    currentPassId = `TCNV-26-${Math.floor(1000 + Math.random() * 9000)}`;
    syncTicket();

    if (bState) {
      bState.textContent = "✓ VERIFIED PASS";
      bState.classList.add("verified");
    }
    if (msg) {
      msg.textContent = `✓ Ticket ${currentPassId} ready! Click "Download Ticket (PNG)" below to save to your phone.`;
    }

    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        passId: currentPassId,
        name: nameIn?.value.trim(),
        email: document.getElementById("attEmail")?.value.trim(),
        phone: document.getElementById("attPhone")?.value.trim(),
        role: roleIn?.value,
        track: trackIn?.value,
        question: document.getElementById("attQuestion")?.value.trim(),
      }),
    }).catch(() => {});
  });

  downloadPngBtn?.addEventListener("click", () => {
    downloadTicketPng(getState());
  });

  document
    .getElementById("printBadgeBtn")
    ?.addEventListener("click", () => window.print());

  // Initial render of QR & Barcode
  syncTicket();
}

// 9. Calendar .ICS Download
function initCalendarDownload() {
  document.getElementById("icsDownloadBtn")?.addEventListener("click", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:20261029T090000Z",
      "DTEND:20261029T133000Z",
      "SUMMARY:TECHNOVATION '26 — Dept. of Computer Science (HCU)",
      "DESCRIPTION:Beyond the Classroom: Building Skills, Careers & Innovations. Ciné-Concorde, Akpakpa, Cotonou.",
      "LOCATION:Ciné-Concorde, Von Sokodo, Akpakpa, Cotonou, Benin Republic",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Technovation-26.ics";
    a.click();
  });
}

// 10. Poster Modal Lightbox
function initPosterModal() {
  const modal = document.getElementById("posterModal");
  const open1 = document.getElementById("viewPosterBtn");
  const open2 = document.getElementById("openPosterFromHero");
  const open3 = document.getElementById("mobileFlyerBtn");
  const close = document.getElementById("closePosterBtn");

  if (!modal) return;
  const show = () => (modal.hidden = false);
  const hide = () => (modal.hidden = true);

  open1?.addEventListener("click", show);
  open2?.addEventListener("click", show);
  open3?.addEventListener("click", show);
  close?.addEventListener("click", hide);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) hide();
  });
}
