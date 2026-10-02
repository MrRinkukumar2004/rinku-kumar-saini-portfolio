// Light/dark theme: loaded in <head> so the saved choice (or system setting) applies before first paint
(() => {
  const root = document.documentElement;
  const KEY = "theme";
  const media = window.matchMedia("(prefers-color-scheme: light)");

  const saved = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const store = (t) => { try { localStorage.setItem(KEY, t); } catch { /* private mode */ } };

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#FAFAF8" : "#0D0E11");
    document.querySelectorAll(".theme-btn").forEach((b) => {
      const next = theme === "light" ? "dark" : "light";
      b.setAttribute("aria-label", `Switch to ${next} theme`);
      b.setAttribute("title", `Switch to ${next} theme`);
    });
    root.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  }

  apply(saved() || (media.matches ? "light" : "dark"));

  // Follow the system setting until the visitor picks a theme themselves
  media.addEventListener?.("change", (e) => { if (!saved()) apply(e.matches ? "light" : "dark"); });

  document.addEventListener("DOMContentLoaded", () => {
    apply(root.getAttribute("data-theme")); // refresh button labels + meta now that they exist
    document.querySelectorAll(".theme-btn").forEach((btn) => btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.classList.add("theme-anim");
      apply(next);
      store(next);
      setTimeout(() => root.classList.remove("theme-anim"), 400);
    }));
  });
})();
