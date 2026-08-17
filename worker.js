function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

async function submitContact(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const { name, email, company, phone, propertyAddress, serviceNeeded, message, website, formStartedAt } = payload ?? {};
  if (website) return new Response(null, { status: 204 });
  if (!formStartedAt || Date.now() - Number(formStartedAt) < 3000) return new Response(null, { status: 204 });
  if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return json({ error: "Please provide a name, valid email address, and message." }, 400);
  }
  if (!env.RESEND_API_KEY || !env.RESEND_FROM || !env.QUOTE_TO) {
    console.error("Missing RESEND_API_KEY, RESEND_FROM, or QUOTE_TO runtime secret.");
    return json({ error: "Contact service is not configured." }, 503);
  }

  const fields = [
    ["Name", name],
    ["Email", email],
    ["Company", company],
    ["Phone", phone],
    ["Property address", propertyAddress],
    ["Service requested", serviceNeeded],
    ["Message", message],
  ].filter(([, value]) => value);
  const html = `<h2>New IronPin Aerial quote request</h2><table>${fields.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`).join("")}</table>`;
  const text = fields.map(([label, value]) => `${label}: ${value}`).join("\n\n");
  const resend = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: [env.QUOTE_TO],
      reply_to: email,
      subject: `Quote request from ${name}`,
      html,
      text,
    }),
  });

  if (!resend.ok) {
    console.error("Resend request failed:", await resend.text());
    return json({ error: "Unable to send message." }, 502);
  }
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: { Allow: "POST, OPTIONS" } });
      }
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST, OPTIONS" } });
      return submitContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
