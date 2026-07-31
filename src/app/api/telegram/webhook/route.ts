import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TELEGRAM_API = "https://api.telegram.org";

const BOT_USERNAME = "autokad_report_bot";
const BOT_TAG = `@${BOT_USERNAME}`;

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  return token;
}

async function sendTelegramMessage(
  chatId: number | string,
  text: string
): Promise<void> {
  try {
    await fetch(`${TELEGRAM_API}/bot${getBotToken()}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.error("Telegram sendMessage error:", err);
  }
}

const WELCOME_TEXT = `📝 <b>به ربات گزارش روزانه خوش آمدید!</b>

لطفاً گزارش روزانه خود را با این ساختار ارسال کنید:

<b>نام:</b> [نام و نام خانوادگی]
<b>کارهای دیروز:</b>
- [مورد اول]
- [مورد دوم]

<b>کارهای امروز:</b>
- [برنامه یا تسک‌های امروز]

<b>موانع و چالش‌ها:</b>
- [در صورت وجود بنویسید، در غیر این صورت «ندارد»]`;

const RECEIVED_TEXT = `✅ <b>گزارش شما دریافت شد.</b>

گزارش شما برای بازبینی ذخیره شد و در صورت تأیید، وارد چرخه‌ی تحلیل می‌شود.`;

export async function POST(request: NextRequest) {
  const secret = process.env.TELEGRAM_BOT_SECRET_TOKEN?.trim();
  if (secret) {
    const header = request.headers.get("x-telegram-bot-api-secret-token")?.trim();
    if (header !== secret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  try {
    const body = await request.json();

    const message = body.message;
    if (!message || typeof message.text !== "string") {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat?.id;
    const messageId = message.message_id ?? null;
    const fromUser =
      message.from?.username ||
      message.from?.first_name ||
      "Unknown";
    const text = message.text;

    if (!chatId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (text === "/start" || text === "start") {
      await sendTelegramMessage(chatId, WELCOME_TEXT);
      return NextResponse.json({ ok: true });
    }

    const normalized = text.trimStart();
    if (!normalized.toLowerCase().startsWith(BOT_TAG.toLowerCase())) {
      return NextResponse.json({ ok: true });
    }

    const reportText = normalized
      .slice(BOT_TAG.length)
      .replace(/^[\s:،:.]*/, "")
      .trim();

    if (!reportText) {
      await sendTelegramMessage(
        chatId,
        "⚠️ لطفاً بعد از تگ ربات، متن گزارش را ارسال کنید."
      );
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabase();
    const { error } = await supabase.from("telegram_messages").insert({
      chat_id: chatId,
      message_id: messageId,
      from_user: fromUser,
      raw_text: reportText,
      received_at: new Date().toISOString(),
      is_processed: false,
    });

    if (error) {
      console.error("telegram_messages insert error:", error);
      return NextResponse.json(
        { ok: false, error: "Database insert failed" },
        { status: 500 }
      );
    }

    await sendTelegramMessage(chatId, RECEIVED_TEXT);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Telegram Webhook is active." });
}
