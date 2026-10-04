/* Rinku Kumar Saini – Portfolio interactions */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Header background once the page scrolls ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["#home", ...navLinks.map((a) => a.getAttribute("href"))].forEach((id) => { const s = $(id); if (s) navObs.observe(s); });

  /* ---------- Share menu ---------- */
  const shareBtn = $("#share-btn");
  const shareMenu = $("#share-menu");
  if (shareBtn && shareMenu) {
    // Share the live site even when the page is opened from a local file
    const url = $('link[rel="canonical"]')?.href || location.href;
    const text = "Rinku Kumar Saini – Full Stack Developer (Node.js, TypeScript, microservices)";
    const enc = encodeURIComponent;
    const links = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      whatsapp: `https://wa.me/?text=${enc(text + " " + url)}`,
      x: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`,
      email: `mailto:?subject=${enc("Portfolio: Rinku Kumar Saini")}&body=${enc(text + "\n" + url)}`,
    };
    Object.entries(links).forEach(([k, href]) => { const a = $(`[data-share="${k}"]`, shareMenu); if (a) a.href = href; });

    const native = $('[data-share="native"]', shareMenu);
    if (navigator.share) native.hidden = false;

    const setShare = (open) => {
      shareMenu.hidden = !open;
      shareBtn.setAttribute("aria-expanded", String(open));
      if (open) $("button, a", shareMenu).focus();
    };
    shareBtn.addEventListener("click", (e) => { e.stopPropagation(); setShare(shareMenu.hidden); });
    document.addEventListener("click", (e) => { if (!shareMenu.hidden && !e.target.closest(".share")) setShare(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !shareMenu.hidden) { setShare(false); shareBtn.focus(); } });
    $$("a", shareMenu).forEach((a) => a.addEventListener("click", () => setShare(false)));

    const copyBtn = $('[data-share="copy"]', shareMenu);
    copyBtn.addEventListener("click", async () => {
      const label = $(".share-copy-label", copyBtn), use = $("use", copyBtn);
      try { await navigator.clipboard.writeText(url); label.textContent = "Link copied"; }
      catch { label.textContent = url; }
      copyBtn.classList.add("done"); use.setAttribute("href", "#i-check");
      setTimeout(() => { copyBtn.classList.remove("done"); use.setAttribute("href", "#i-copy"); label.textContent = "Copy link"; setShare(false); }, 1400);
    });
    native.addEventListener("click", async () => {
      setShare(false);
      try { await navigator.share({ title: document.title, text, url }); } catch { /* cancelled */ }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      revealObs.unobserve(en.target);
    });
  }, { rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach((el) => revealObs.observe(el));

  /* ---------- Copy email ---------- */
  $$(".copy").forEach((btn) => btn.addEventListener("click", async () => {
    const use = $("use", btn), label = $(".copy-label", btn);
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.classList.add("done"); use.setAttribute("href", "#i-check");
      if (label) label.textContent = "Copied";
      setTimeout(() => {
        btn.classList.remove("done"); use.setAttribute("href", "#i-copy");
        if (label) label.textContent = "Copy";
      }, 1600);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(btn.previousElementSibling);
      getSelection().removeAllRanges(); getSelection().addRange(range);
    }
  }));

  /* ---------- Contact form ---------- */
  // Posts to /api/contact (Vercel function that emails me); falls back to the visitor's mail app if that isn't available
  const form = $("#contact-form");
  const status = $("#form-status");
  if (form) {
    const controls = $$(".field input, .field textarea", form);
    const submitBtn = $('button[type="submit"]', form);
    const say = (cls, msg) => { status.className = "form-status" + (cls ? " " + cls : ""); status.textContent = msg; };
    const openMailApp = (data) => {
      const subject = encodeURIComponent(`${data.topic}: message from ${data.name}`);
      const body = encodeURIComponent(data.message + "\n\n" + data.name + "\n" + data.email);
      location.href = `mailto:sainirinku1604@gmail.com?subject=${subject}&body=${body}`;
      say("ok", "Your email app should open with the message ready to send.");
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let ok = true;
      controls.forEach((f) => {
        const valid = f.value.trim() && (f.type !== "email" || /^\S+@\S+\.\S+$/.test(f.value.trim()));
        f.closest(".field").classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) return say("err", "Add your name, a valid email and a message.");

      const data = Object.fromEntries(new FormData(form));
      const endpoint = form.dataset.endpoint;
      // The API only exists on the deployed site, not when the page is opened as a local file
      if (!endpoint || location.protocol === "file:") return openMailApp(data);

      submitBtn.disabled = true;
      say("", "Sending…");
      try {
        const res = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(data) });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || !out.ok) throw new Error(out.error);
        form.reset();
        say("ok", "Thanks, your message is on its way. I'll reply soon.");
      } catch {
        say("err", "Couldn't send right now. Please email me at sainirinku1604@gmail.com.");
      } finally {
        submitBtn.disabled = false;
      }
    });
    controls.forEach((f) => f.addEventListener("input", () => f.closest(".field").classList.remove("invalid")));
  }

  /* ---------- Experience, always counted from the start date ---------- */
  // <span data-from="2024-06" data-format="years|words|short"> is rewritten on load, so the numbers never go stale
  const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  const monthsSince = (ym) => {
    const [y, m] = ym.split("-").map(Number), now = new Date();
    return Math.max(0, (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m));
  };
  const formatSpan = (months, format) => {
    const y = Math.floor(months / 12), r = months % 12;
    const word = (n) => WORDS[n] || String(n);
    const plural = (n, unit) => `${n} ${unit}${n === 1 ? "" : "s"}`;
    if (format === "short") {
      if (months < 12) return `${Math.max(months, 1)} mo${months === 1 ? "" : "s"}`;
      return r ? `${y} yr${y === 1 ? "" : "s"} ${r} mo${r === 1 ? "" : "s"}` : `${y} yr${y === 1 ? "" : "s"}`;
    }
    if (format === "words") {
      if (months < 12) return months <= 1 ? "the past month" : `the past ${word(months)} months`;
      if (r === 0) return plural(word(y), "year");
      if (r <= 5) return `a little over ${plural(word(y), "year")}`;
      return `nearly ${plural(word(y + 1), "year")}`;
    }
    if (format === "num") return String(y);
    if (months < 12) return plural(Math.max(months, 1), "month");
    return r ? `${y}+ years` : plural(y, "year");
  };
  $$("[data-from]").forEach((el) => { el.textContent = formatSpan(monthsSince(el.dataset.from), el.dataset.format); });

  /* ---------- Hero stats count up when they come into view ---------- */
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const countUp = (el) => {
    const to = Number(el.textContent);
    if (reduceMotion || !to) return;
    const start = performance.now(), dur = 1200;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { countUp(en.target); countObs.unobserve(en.target); } });
  });
  $$(".count").forEach((el) => countObs.observe(el));

  /* ---------- Hero: animated request flow through the microservices ---------- */
  const arch = $(".arch");
  if (arch) {
    const NS = "http://www.w3.org/2000/svg";
    const svg = $(".arch-svg", arch), layer = $("#pkts", svg);
    const statusEl = $("#arch-status", arch);
    const node = (id) => $("#n-" + id, svg);
    const edge = (id) => $("#e-" + id, svg);
    const SERVICES = ["auth", "kyc", "wallet", "trading", "ledger"];
    const CONSUMERS = ["email", "notify", "audit"];
    const setStatus = (text, cls) => { statusEl.textContent = text; statusEl.className = "arch-status" + (cls ? " " + cls : ""); };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let visible = false;
    const whenVisible = () => new Promise((resolve) => {
      const check = () => (visible && !document.hidden ? resolve() : setTimeout(check, 300));
      check();
    });

    // Send a packet along an SVG path; kind: "req" (blue), "res" (green) or "evt" (orange)
    const travel = (path, { back = false, dur = 600, kind = "req" } = {}) => new Promise((resolve) => {
      const halo = document.createElementNS(NS, "circle"), dot = document.createElementNS(NS, "circle");
      halo.setAttribute("r", 8); halo.setAttribute("class", "pkt-halo " + kind);
      dot.setAttribute("r", 3.6); dot.setAttribute("class", "pkt " + kind);
      layer.append(halo, dot);
      const len = path.getTotalLength(), t0 = performance.now(), cls = kind === "evt" ? "evt" : back ? "back" : "active";
      path.classList.add(cls);
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const pt = path.getPointAtLength(len * (back ? 1 - e : e));
        [halo, dot].forEach((c) => { c.setAttribute("cx", pt.x); c.setAttribute("cy", pt.y); });
        if (p < 1) return requestAnimationFrame(step);
        path.classList.remove(cls); halo.remove(); dot.remove(); resolve();
      };
      requestAnimationFrame(step);
    });
    const reset = () => {
      $$(".node", svg).forEach((n) => n.classList.remove("on", "done"));
      arch.classList.remove("answered", "evented"); arch.classList.add("waiting", "no-event");
    };

    async function cycle() {
      reset();
      setStatus("sending", "busy"); arch.classList.add("sending");
      await sleep(400);
      await travel(edge("client"), { dur: 550 });
      arch.classList.remove("sending");
      node("gateway").classList.add("on"); setStatus("→ gateway", "busy");
      await sleep(200);
      for (const id of SERVICES) {
        await whenVisible();
        await travel(edge(id), { dur: 460 });
        node(id).classList.add("on"); setStatus(id + "-svc", "busy");
        await sleep(220);
        node(id).classList.replace("on", "done");
        await travel(edge(id), { back: true, dur: 380 });
      }
      node("gateway").classList.replace("on", "done");
      // The response and the async event fan-out happen at the same time
      const respond = (async () => {
        await travel(edge("client"), { back: true, dur: 600, kind: "res" });
        node("client").classList.add("done");
        arch.classList.replace("waiting", "answered"); setStatus("201 Created", "ok");
      })();
      const publish = (async () => {
        await travel(edge("pub"), { dur: 420, kind: "evt" });
        node("kafka").classList.add("on");
        arch.classList.replace("no-event", "evented");
        await sleep(200);
        await Promise.all(CONSUMERS.map(async (id, i) => {
          await sleep(i * 120);
          await travel(edge(id), { dur: 420, kind: "evt" });
          node(id).classList.add("on");
          await sleep(300);
          node(id).classList.replace("on", "done");
        }));
        node("kafka").classList.remove("on");
      })();
      await Promise.all([respond, publish]);
      setStatus("201 · order.filled", "ok");
      await sleep(2600);
    }

    if (reduceMotion) {
      [...SERVICES, ...CONSUMERS, "gateway", "client"].forEach((id) => node(id).classList.add("done"));
      arch.classList.add("answered", "evented"); setStatus("201 Created", "ok");
    } else {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(arch);
      (async () => { await sleep(900); for (;;) { await whenVisible(); await cycle(); } })();
    }
  }

  /* ---------- Footer year ---------- */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
