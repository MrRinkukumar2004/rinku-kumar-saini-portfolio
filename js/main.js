/* Rinku Kumar Saini – Portfolio interactions */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Header state, scroll progress, back-to-top ---------- */
  const header = $("#header");
  const bar = $(".progress span");
  const toTop = $(".to-top");
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    toTop.classList.toggle("show", y > 600);
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    updateTimeline();
    checkReveals();
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuBtn = $("#menu-btn");
  const links = $("#nav-links");
  function setMenu(open) {
    links.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    $("use", menuBtn).setAttribute("href", open ? "#i-x" : "#i-menu");
  }
  menuBtn.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav-links a");
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => navObs.observe(s));

  /* ---------- Reveal on scroll + count-up ---------- */
  function countUp(el) {
    const to = Number(el.dataset.to);
    if (reduce || !to) { el.textContent = to; return; }
    const dur = 1400, start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  // Checked on every scroll, so fast jumps (nav links, scrollbar drags) never skip an element
  let pending = $$(".reveal");
  $$(".count").forEach((el) => (el.textContent = "0"));
  function checkReveals() {
    if (!pending.length) return;
    const limit = innerHeight * 0.92;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top > limit) return true;
      el.classList.add("in");
      $$(".count", el).forEach(countUp);
      return false;
    });
  }

  /* ---------- Typing roles ---------- */
  const typed = $("#typed");
  const roles = ["Full Stack Developer", "Backend Developer", "Node.js Developer", "FinTech Engineer"];
  if (typed && !reduce) {
    let r = 0, i = roles[0].length, deleting = true;
    const step = () => {
      const word = roles[r];
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      let wait = deleting ? 40 : 80;
      if (!deleting && i === word.length) { deleting = true; wait = 2200; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; wait = 350; }
      setTimeout(step, wait);
    };
    setTimeout(step, 2600);
  }

  /* ---------- Hero network canvas (microservices-style nodes) ---------- */
  const canvas = $("#network");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes = [], mouse = { x: -999, y: -999 };
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      const link = 130;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < link) {
            ctx.strokeStyle = `rgba(90,162,255,${(1 - d / link) * 0.35})`;
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 170) {
          ctx.strokeStyle = `rgba(120,180,255,${(1 - md / 170) * 0.6})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = md < 170 ? "#9CC6FF" : "rgba(120,170,255,0.8)";
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    function move() {
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });
    }
    let running = true;
    function loop() { if (!running) return; move(); draw(); requestAnimationFrame(loop); }
    size();
    addEventListener("resize", () => { size(); if (reduce) draw(); });
    const hero = $(".hero");
    hero.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      if (reduce) draw();
    });
    hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -999; if (reduce) draw(); });
    if (reduce) draw();
    else {
      // pause when hero is off-screen
      new IntersectionObserver(([en]) => {
        const was = running; running = en.isIntersecting;
        if (running && !was) loop();
      }).observe(hero);
      loop();
    }
  }

  /* ---------- Photo tilt ---------- */
  const visual = $("#hero-visual");
  if (visual && finePointer && !reduce) {
    const hero = $(".hero");
    hero.addEventListener("pointermove", (e) => {
      const r = visual.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / innerWidth;
      const y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      visual.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    hero.addEventListener("pointerleave", () => (visual.style.transform = ""));
  }

  /* ---------- Card spotlight follows the cursor ---------- */
  if (finePointer) {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".spot");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  }

  /* ---------- Skill icon fallback (letter tile if a logo fails to load) ---------- */
  $$(".skill-card li img").forEach((img) => {
    const swap = () => {
      const s = document.createElement("span");
      s.className = "letter"; s.setAttribute("aria-hidden", "true");
      s.textContent = img.parentElement.textContent.trim().slice(0, 2);
      img.replaceWith(s);
    };
    if (img.complete && img.naturalWidth === 0) swap();
    else img.addEventListener("error", swap);
  });

  // Stagger index for the skill chips' pop-in animation
  $$(".skill-card, .t-card").forEach((card) => $$("li", card).forEach((li, i) => li.style.setProperty("--i", i)));

  /* ---------- Timeline progress line ---------- */
  const tl = $("#timeline");
  const tlFill = $(".t-line span");
  function updateTimeline() {
    if (!tl || !tlFill) return;
    const r = tl.getBoundingClientRect();
    const p = Math.min(Math.max((innerHeight * 0.65 - r.top) / r.height, 0), 1);
    tlFill.style.height = p * 100 + "%";
  }

  /* ---------- Project filter ---------- */
  const filters = $$(".filter");
  const cards = $$(".project");
  const pill = $(".filter-pill");
  function movePill() {
    const on = $(".filter.is-on");
    if (!pill || !on) return;
    pill.style.width = on.offsetWidth + "px";
    pill.style.height = on.offsetHeight + "px";
    pill.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`;
  }
  if (pill) {
    movePill();
    requestAnimationFrame(() => pill.parentElement.classList.add("has-pill"));
    addEventListener("resize", movePill);
    document.fonts?.ready.then(movePill);
  }
  filters.forEach((btn) => btn.addEventListener("click", () => {
    filters.forEach((b) => { b.classList.toggle("is-on", b === btn); b.setAttribute("aria-selected", String(b === btn)); });
    movePill();
    const f = btn.dataset.filter;
    cards.forEach((c) => {
      const show = f === "all" || c.dataset.cat === f;
      c.classList.toggle("is-hidden", !show);
      if (show && !reduce) c.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 350, easing: "ease-out" });
    });
  }));

  /* ---------- Project details modal ---------- */
  const PROJECTS = {
    agcx: {
      title: "AGCX – Arab Global Crypto Exchange",
      url: "https://arabglobal.ae", urlText: "arabglobal.ae", img: "images/agcx.jpg",
      role: "Full Stack Developer (backend focus) at WrathCode Technology · Jun 2026 – Present",
      about: "A regulated, microservices-based crypto exchange for UAE and global markets. Users deposit in AED, buy, sell and hold digital assets, with KYC and a full back office.",
      did: [
        "Built services for buy/sell, wallets, deposits, withdrawals, transfers, currency management, referral, KYC and admin",
        "Designed the transaction lifecycle: state handling, validation, provider status tracking and failure recovery",
        "Implemented fiat-to-crypto and crypto-to-fiat flows with Zand Bank and CryptoSwift",
        "Integrated Fireblocks (custody), Chainalysis (screening), Binance and Didit KYC",
        "Built Passkeys, Google OAuth 2.0/OIDC, Apple sign-in and API key management",
        "Implemented RBAC, ABAC and PBAC for sensitive financial operations",
        "Designed PostgreSQL and MongoDB schemas; gRPC between services; Redis caching; Docker and Kubernetes",
      ],
      stack: ["Node.js", "TypeScript", "PostgreSQL", "MongoDB", "Redis", "gRPC", "REST", "DDD", "Docker", "Kubernetes"],
    },
    walker: {
      title: "Walker Red Blue – CRM & Work Order Platform",
      url: "https://wbhubs.walker-blue.com", urlText: "wbhubs.walker-blue.com (admin panel, login required)", img: "images/walker.jpg",
      role: "Full Stack Developer at Octodo Solutions · Jun 2024 – May 2026",
      about: "Internal operations platform for Design2Occupancy, a green building and energy-efficiency consultancy. It connects sales, project delivery and accounts in one system.",
      did: [
        "Developed 400+ REST APIs and gRPC services across CRM, projects, reporting and notifications",
        "Built domain services: Project Dashboard, Feasibility, EnergyQC, RepGenX, Notification, Support & Communication",
        "Built work order and payment management",
        "Integrated Tally ERP for accounts and marketing, with automated payment reminders and deadline follow-ups",
        "Integrated Google OAuth, Google Drive, HubSpot CRM and Insightly CRM",
        "Implemented RBAC/ABAC/PBAC, WebSocket notifications and background processing",
        "Tuned PostgreSQL and MS SQL Server queries and indexes for ~25% faster performance",
      ],
      stack: ["Node.js", "TypeScript", "React.js", "PostgreSQL", "MS SQL Server", "Sequelize", "gRPC", "WebSockets"],
    },
    d2o: {
      title: "Design2Occupancy – Website, CMS & Portfolio",
      url: "https://www.design2occupancy.com", urlText: "design2occupancy.com", img: "images/d2o.jpg",
      role: "Full Stack Developer at Octodo Solutions · Jun 2024 – May 2026",
      about: "The public website for Design2Occupancy, plus the content and portfolio tools behind it.",
      did: [
        "Built the company website",
        "Built a custom CMS so the team can update content without a developer",
        "Built automated company and project profile generation, cutting manual profile preparation",
        "Built a ranked project showcase so clients see the most relevant projects first",
      ],
      stack: ["Website", "CMS", "Portfolio automation"],
    },
  };
  const modal = $("#modal");
  const mContent = $("#m-content");
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function openProject(id) {
    const p = PROJECTS[id];
    if (!p || !modal) return;
    mContent.innerHTML = `
      <div class="shot m-hero" data-label="${esc(p.title.split(" – ")[0])}"><img src="${p.img}" alt="" onerror="this.remove()"></div>
      <div class="m-body">
        <h3 id="m-title">${esc(p.title)}</h3>
        <a class="p-url" href="${p.url}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-external"/></svg>${esc(p.urlText)}</a>
        <p><strong>${esc(p.role)}</strong></p>
        <p>${esc(p.about)}</p>
        <h4>What I built</h4>
        <ul class="points">${p.did.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
        <h4>Tech stack</h4>
        <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      </div>`;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (modal.open) { modal.close ? modal.close() : modal.removeAttribute("open"); }
  }
  $$("[data-open]").forEach((b) => b.addEventListener("click", () => openProject(b.dataset.open)));
  $("#m-close")?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  modal?.addEventListener("close", () => (document.body.style.overflow = ""));

  /* ---------- Copy buttons ---------- */
  $$(".copy").forEach((btn) => btn.addEventListener("click", async () => {
    const use = $("use", btn);
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.classList.add("done"); use.setAttribute("href", "#i-check");
      setTimeout(() => { btn.classList.remove("done"); use.setAttribute("href", "#i-copy"); }, 1600);
    } catch {
      const sel = getSelection(), range = document.createRange();
      range.selectNodeContents(btn.previousElementSibling.lastElementChild);
      sel.removeAllRanges(); sel.addRange(range);
    }
  }));

  /* ---------- Contact form ----------
     Default: opens the visitor's email app with the message filled in.
     To receive messages directly, create a free form at formspree.io and add
     data-endpoint="https://formspree.io/f/XXXXXXX" to the <form> tag. */
  const form = $("#contact-form");
  const status = $("#form-status");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = $$("input, textarea", form);
      let ok = true;
      fields.forEach((f) => {
        const valid = f.value.trim() && (f.type !== "email" || /^\S+@\S+\.\S+$/.test(f.value.trim()));
        f.closest(".field").classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) { status.className = "form-status err"; status.textContent = "Fill in your name, a valid email and a message."; return; }

      const data = Object.fromEntries(new FormData(form));
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        status.className = "form-status"; status.textContent = "Sending…";
        try {
          const res = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(data) });
          if (!res.ok) throw new Error();
          form.reset(); status.className = "form-status ok"; status.textContent = "Message sent. I'll reply within a day or two.";
        } catch {
          status.className = "form-status err"; status.textContent = "Couldn't send right now. Email me at sainirinku1604@gmail.com.";
        }
        return;
      }
      const subject = encodeURIComponent(`Portfolio enquiry from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`);
      location.href = `mailto:sainirinku1604@gmail.com?subject=${subject}&body=${body}`;
      status.className = "form-status ok";
      status.textContent = "Your email app should open with the message ready to send.";
    });
    $$("input, textarea", form).forEach((f) => f.addEventListener("input", () => f.closest(".field").classList.remove("invalid")));
  }

  /* ---------- Footer year ---------- */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  onScroll();
})();
