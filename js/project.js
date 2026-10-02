/* Project detail pages: contents highlight, share, screenshot lightbox, reveal */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Reveal on scroll ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      revealObs.unobserve(en.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((el) => revealObs.observe(el));

  /* ---------- Contents: highlight the section in view ---------- */
  const tocLinks = $$(".toc a");
  const setActive = (id) => tocLinks.forEach((a) => {
    const on = a.getAttribute("href") === "#" + id;
    a.classList.toggle("active", on);
    // keep the active chip visible in the horizontal mobile bar
    if (on && a.parentElement.parentElement.scrollWidth > a.parentElement.parentElement.clientWidth) {
      a.scrollIntoView({ block: "nearest", inline: "center" });
    }
  });
  const tocObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
  }, { rootMargin: "-30% 0px -60% 0px" });
  tocLinks.forEach((a) => { const s = $(a.getAttribute("href")); if (s) tocObs.observe(s); });

  /* ---------- Toast ---------- */
  const toast = $(".toast");
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  /* ---------- Share ---------- */
  $("#share")?.addEventListener("click", async () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* cancelled */ }
      return;
    }
    try { await navigator.clipboard.writeText(location.href); showToast("Link copied"); }
    catch { showToast("Copy the link from the address bar"); }
  });

  /* ---------- Screenshot lightbox ---------- */
  const box = $("#lightbox");
  if (box) {
    const img = $("img", box), cap = $("p", box);
    $$(".shot-btn").forEach((btn) => btn.addEventListener("click", () => {
      const src = $("img", btn);
      img.src = src.src; img.alt = src.alt;
      cap.textContent = btn.closest("figure")?.querySelector("figcaption")?.textContent || "";
      box.showModal ? box.showModal() : box.setAttribute("open", "");
    }));
    $("#lb-close").addEventListener("click", () => box.close());
    box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
  }

  /* ---------- Hide screenshots that fail to load ---------- */
  $$(".gallery img").forEach((im) => {
    const drop = () => im.closest("figure")?.remove();
    if (im.complete && im.naturalWidth === 0) drop(); else im.addEventListener("error", drop);
  });

  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
