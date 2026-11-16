/**
 * Mehmon javobini Telegram orqali FAQAT kuyovga yuboradi.
 *
 * POST /api/rsvp
 * Muhit o'zgaruvchilari (.env.local yoki Vercel → Settings → Environment Variables):
 *   TELEGRAM_BOT_TOKEN  — @BotFather bergan token
 *   GROOM_CHAT_ID       — kuyovning Telegram chat ID si (xabar faqat shu chatga boradi)
 *
 * Token faqat serverda turadi va brauzerga chiqmaydi.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 daqiqa
const MAX_PER_WINDOW = 5; // bitta IP dan shu vaqt ichida eng ko'pi bilan 5 ta javob
const MAX_GUESTS = 10;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return false;
}

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const clean = (value: unknown, max: number) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

const json = (data: { ok: boolean; error?: string }, status = 200) =>
  Response.json(data, { status });

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.GROOM_CHAT_ID;
  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN yoki GROOM_CHAT_ID sozlanmagan");
    return json({ ok: false, error: "config" }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "body" }, 400);
  }
  if (!body || typeof body !== "object") return json({ ok: false, error: "body" }, 400);

  // Botlar to'ldiradigan yashirin maydon: jimgina "ok" qaytaramiz, xabar yubormaymiz
  if (body.website) return json({ ok: true });

  const name = clean(body.name, 60);
  const message = clean(body.message, 500);
  const attending = body.attending === true || body.attending === "yes";
  const guests = Math.max(1, Math.min(MAX_GUESTS, parseInt(String(body.guests), 10) || 1));
  if (name.length < 2) return json({ ok: false, error: "name" }, 400);

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return json({ ok: false, error: "rate" }, 429);

  const when = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const lines = [
    "💌 <b>Taklifnomaga yangi javob</b>",
    "",
    `👤 <b>Mehmon:</b> ${esc(name)}`,
    attending ? `✅ <b>Keladi</b>, ${guests} kishi` : "❌ <b>Kela olmaydi</b>",
  ];
  if (message) lines.push(`💬 <b>Tilak:</b> ${esc(message)}`);
  lines.push("", `🕒 ${when} (Toshkent)`);

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    const data = (await tg.json().catch(() => ({}))) as { ok?: boolean; description?: string };
    if (!tg.ok || !data.ok) {
      console.error("Telegram xatosi:", tg.status, data.description);
      return json({ ok: false, error: "telegram" }, 502);
    }
    return json({ ok: true });
  } catch (err) {
    console.error("Telegramga ulanib bo‘lmadi:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "network" }, 502);
  }
}
