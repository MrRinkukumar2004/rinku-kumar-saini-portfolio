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
  // Opens the visitor's mail app; add data-endpoint="https://formspree.io/f/…" to the form to send directly
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
      if (!ok) { status.className = "form-status err"; status.textContent = "Add your name, a valid email and a message."; return; }

      const data = Object.fromEntries(new FormData(form));
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        status.className = "form-status"; status.textContent = "Sending…";
        try {
          const res = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(data) });
          if (!res.ok) throw new Error();
          form.reset(); status.className = "form-status ok"; status.textContent = "Sent. Thanks, I'll get back to you soon.";
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
})();
