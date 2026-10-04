// POST /api/contact - emails me the contact form through Resend
// env: RESEND_API_KEY, CONTACT_TO_EMAIL, and optionally CONTACT_FROM_EMAIL

const TOPICS = ["Job opportunity", "Freelance project", "Something else"];
const LIMITS = { name: 100, email: 200, message: 5000 };

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? safeJson(req.body) : req.body || {};

  // honeypot: people never see the "company" field, bots fill it in
  if (body.company) return res.status(200).json({ ok: true });

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const message = clean(body.message, LIMITS.message);
  const topic = TOPICS.includes(body.topic) ? body.topic : "Something else";

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "Please add your name, a valid email and a message." });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return res.status(500).json({ ok: false, error: "Email is not configured yet." });
  }

  const subject = `[Portfolio] ${topic} – ${name}`;
  const text = `${topic}\n\nFrom: ${name} <${email}>\n\n${message}\n\n— Sent from the contact form on rinku-kumar-saini-portfolio.vercel.app`;
  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.6;color:#17181B">
      <p style="margin:0 0 4px;font-size:12px;color:#5E626A;text-transform:uppercase;letter-spacing:.06em">${esc(topic)}</p>
      <p style="margin:0 0 16px"><strong>${esc(name)}</strong> &lt;<a href="mailto:${esc(email)}">${esc(email)}</a>&gt;</p>
      <div style="white-space:pre-wrap;padding:16px;border:1px solid #E6E4DE;border-radius:8px;background:#FAFAF8">${esc(message)}</div>
      <p style="margin:16px 0 0;font-size:12px;color:#8B8F97">Reply to this email to answer ${esc(name)} directly.</p>
    </div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>",
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });
    if (!r.ok) {
      console.error("Resend error", r.status, await r.text());
      return res.status(502).json({ ok: false, error: "Couldn't send right now." });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact form failed", err);
    return res.status(502).json({ ok: false, error: "Couldn't send right now." });
  }
};

function safeJson(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
