export default async function handler(req, res) {
  const allowedOrigins = [
    "https://pish-ulsu.vercel.app",
    "http://localhost:3000",
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: "Метод не поддерживается" });
  }

  try {
    const { name, phone, comment = "" } = req.body;
    if (!name || !phone) {
      return res
        .status(400)
        .json({ ok: false, error: "Имя и телефон обязательны" });
    }

    const TELEGRAM_BOT_TOKEN = "8818678558:AAFevqXfYE9tuA88EQRRW4yGjl5_HuIbbsg";
    const TELEGRAM_CHAT_ID = "-1004415494329";
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Не заданы TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
      return res
        .status(500)
        .json({ ok: false, error: "Ошибка конфигурации сервера" });
    }

    const message = `🟢 *Новая заявка!*\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n`;

    const tgResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      },
    );

    const tgData = await tgResponse.json();
    if (!tgData.ok) {
      console.error("Telegram API error:", tgData);
    }

    if (GOOGLE_SCRIPT_URL) {
      try {
        const googleResponse = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            comment,
            timestamp: new Date().toISOString(),
          }),
        });
        if (!googleResponse.ok) {
          console.error("Google Script error:", await googleResponse.text());
        }
      } catch (err) {
        console.error("Ошибка отправки в Google Таблицу:", err);
      }
    }

    if (tgData && tgData.ok) {
      return res.status(200).json({ ok: true });
    } else {
      return res
        .status(500)
        .json({ ok: false, error: "Не удалось отправить заявку" });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ ok: false, error: "Внутренняя ошибка сервера" });
  }
}
