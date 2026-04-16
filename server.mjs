import "dotenv/config";
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);
const distDir = path.join(__dirname, 'dist');
const cvFileName = 'Maksym_Prysyazhnikov_CV.pdf';
const cvFilePath = path.join(__dirname, 'CV', cvFileName);
const openRouterApiKeys = (process.env.OPENROUTER_KEYS || '')
  .split(/[\n,;]+/)
  .map((key) => key.trim())
  .filter(Boolean);
const openRouterModel = process.env.OPENROUTER_MODEL;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;
const supportSessions = new Map();
const telegramMessageSessions = new Map();
const supportOnlineWindowMs = 45_000;
const supportAutoReplyDelayMs = Number(process.env.SUPPORT_AUTO_REPLY_DELAY_MS || 120_000);
let telegramPollingOffset = 0;
let telegramPollingActive = false;
const portfolioFacts = `
Maksym Prysiazhnikov (Ukrainian: Максим Присяжніков) is a Junior DevOps / Cloud Engineer from Ukraine.
Core stack shown in the portfolio: Linux, Docker, Kubernetes, Azure, Terraform, CI/CD, GitHub Actions, Python, MySQL, PostgreSQL, Liquibase, Bash, SIEM, IDS/IPS.
Learning background in the portfolio: Mate academy DevOps program, Google Cybersecurity Certificate, Beetroot Academy Project Management in IT, English course at 12 Project.
Projects shown in the portfolio: AI Crypto CAT Bot, KROK Worldbuilder Bot, DevOps AI Agent.
Languages shown in the portfolio: Ukrainian native, English B2.
Do not claim experience, tools, employers, certifications, or skills that are not present in this portfolio context.
If asked about general topics, you may answer helpfully, but clearly note that your main specialization is Maksym's portfolio and use portfolio facts as the primary context whenever relevant.
`;

const shuffle = (items) => {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
};

const sendTelegramNotification = async (message, options = {}) => {
  if (!telegramBotToken || !telegramChatId) {
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        ...(options.parseMode ? { parse_mode: options.parseMode } : {}),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram notification failed:', errorText);
    }
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
};

const escapeTelegramHtml = (text) => String(text || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const truncateForTelegram = (text, maxLength = 1400) => {
  const value = String(text || '').trim();

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 20)}\n...[truncated]`;
};

const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];

  return Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0]?.trim() || req.ip || 'unknown';
};

const createSupportMessage = (role, text) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  text: String(text || '').trim(),
  createdAt: new Date().toISOString(),
});

const getSupportSession = (sessionId) => {
  const key = String(sessionId || '').trim();

  if (!key) {
    return null;
  }

  if (!supportSessions.has(key)) {
    supportSessions.set(key, {
      messages: [],
      lastSeen: 0,
      language: 'uk',
      awaitingOperatorReply: false,
      autoReplyTimer: null,
    });
  }

  return supportSessions.get(key);
};

const isSupportSessionOnline = (session) => Date.now() - Number(session?.lastSeen || 0) <= supportOnlineWindowMs;

const getSupportAutoReplyText = (language) => language === 'en'
  ? 'I cannot reply right now. Please leave your contact details, and I will get back to you later.'
  : 'Наразі я не можу швидко відповісти. Залиште, будь ласка, контакти, і я відповім вам пізніше.';

const clearSupportAutoReplyTimer = (session) => {
  if (session?.autoReplyTimer) {
    clearTimeout(session.autoReplyTimer);
    session.autoReplyTimer = null;
  }
};

const scheduleSupportAutoReply = (sessionId, session) => {
  clearSupportAutoReplyTimer(session);

  session.awaitingOperatorReply = true;

  const timer = setTimeout(() => {
    const currentSession = getSupportSession(sessionId);

    if (!currentSession?.awaitingOperatorReply) {
      return;
    }

    currentSession.messages.push(createSupportMessage('operator', getSupportAutoReplyText(currentSession.language)));
    currentSession.awaitingOperatorReply = false;
    currentSession.autoReplyTimer = null;
  }, supportAutoReplyDelayMs);

  if (typeof timer.unref === 'function') {
    timer.unref();
  }

  session.autoReplyTimer = timer;
};

const formatSupportMessageForTelegram = ({ req, sessionId, language, text }) => {
  const timestamp = new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: process.env.TZ || 'Europe/Kiev',
  }).format(new Date());

  return [
    '<b>Live-звʼязок із сайту</b>',
    '',
    `<b>Час:</b> ${escapeTelegramHtml(timestamp)}`,
    `<b>Мова:</b> ${language === 'en' ? 'EN' : 'UK'}`,
    `<b>Session:</b> <code>${escapeTelegramHtml(sessionId)}</code>`,
    `<b>IP:</b> <code>${escapeTelegramHtml(getClientIp(req))}</code>`,
    '',
    '<b>Повідомлення користувача</b>',
    `<pre>${escapeTelegramHtml(truncateForTelegram(text, 1200))}</pre>`,
    '',
    '<i>Відповідай reply на це повідомлення, і відповідь зʼявиться в чаті користувача на сайті.</i>',
  ].join('\n');
};

const formatSupportContactForTelegram = ({ req, sessionId, language, name, email, phone, message }) => {
  const timestamp = new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: process.env.TZ || 'Europe/Kiev',
  }).format(new Date());

  return [
    '<b>Контакти для зворотного звʼязку</b>',
    '',
    `<b>Час:</b> ${escapeTelegramHtml(timestamp)}`,
    `<b>Мова:</b> ${language === 'en' ? 'EN' : 'UK'}`,
    `<b>Session:</b> <code>${escapeTelegramHtml(sessionId)}</code>`,
    `<b>IP:</b> <code>${escapeTelegramHtml(getClientIp(req))}</code>`,
    '',
    `<b>Імʼя:</b> ${escapeTelegramHtml(name)}`,
    `<b>Email:</b> ${email ? escapeTelegramHtml(email) : 'не вказано'}`,
    `<b>Телефон:</b> ${phone ? escapeTelegramHtml(phone) : 'не вказано'}`,
    '',
    '<b>Повідомлення</b>',
    `<pre>${escapeTelegramHtml(truncateForTelegram(message || 'не вказано', 900))}</pre>`,
  ].join('\n');
};

const sendSupportMessageToTelegram = async ({ req, sessionId, language, text }) => {
  if (!telegramBotToken || !telegramChatId) {
    return null;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: formatSupportMessageForTelegram({ req, sessionId, language, text }),
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Telegram support message failed:', data);
      return null;
    }

    const messageId = data?.result?.message_id;

    if (messageId) {
      telegramMessageSessions.set(String(messageId), sessionId);
    }

    return messageId || null;
  } catch (error) {
    console.error('Telegram support message error:', error);
    return null;
  }
};

const handleTelegramSupportReply = async (telegramMessage) => {
  const chatId = telegramMessage?.chat?.id;
  const replyToMessageId = telegramMessage?.reply_to_message?.message_id;
  const text = String(telegramMessage?.text || '').trim();

  if (telegramChatId && String(chatId) !== String(telegramChatId)) {
    return;
  }

  if (!replyToMessageId || !text) {
    return;
  }

  const sessionId = telegramMessageSessions.get(String(replyToMessageId));
  const session = getSupportSession(sessionId);

  if (!session) {
    await sendTelegramNotification('Не знайшов web-сесію для цього reply. Відповідай саме на повідомлення, яке бот надіслав із сайту.');
    return;
  }

  session.messages.push(createSupportMessage('operator', text.slice(0, 1200)));
  session.awaitingOperatorReply = false;
  clearSupportAutoReplyTimer(session);

  if (!isSupportSessionOnline(session)) {
    await sendTelegramNotification(
      [
        '<b>Користувач не в мережі</b>',
        '',
        `<b>Session:</b> <code>${escapeTelegramHtml(sessionId)}</code>`,
        'Відповідь збережена. Користувач побачить її, якщо повернеться на сайт із цієї ж сесії.',
      ].join('\n'),
      { parseMode: 'HTML' },
    );
  }
};

const startTelegramPolling = () => {
  if (!telegramBotToken || telegramPollingActive || process.env.NODE_ENV === 'production') {
    return;
  }

  telegramPollingActive = true;

  const poll = async () => {
    if (!telegramPollingActive) return;

    try {
      const url = new URL(`https://api.telegram.org/bot${telegramBotToken}/getUpdates`);
      url.searchParams.set('timeout', '25');
      url.searchParams.set('allowed_updates', JSON.stringify(['message']));
      if (telegramPollingOffset) {
        url.searchParams.set('offset', String(telegramPollingOffset));
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        const description = String(data?.description || '');

        if (description.includes('webhook')) {
          console.error('Telegram polling is blocked because a webhook is already set. Delete the webhook or use the production webhook endpoint.');
          telegramPollingActive = false;
          return;
        }

        console.error('Telegram polling failed:', data);
        setTimeout(poll, 5000);
        return;
      }

      for (const update of data?.result || []) {
        telegramPollingOffset = Math.max(telegramPollingOffset, Number(update.update_id || 0) + 1);
        await handleTelegramSupportReply(update.message);
      }
    } catch (error) {
      console.error('Telegram polling error:', error);
    }

    setTimeout(poll, 750);
  };

  void poll();
};

const notifyTelegramAboutChat = async ({ req, language, userMessage, aiReply }) => {
  const timestamp = new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: process.env.TZ || 'Europe/Kiev',
  }).format(new Date());

  await sendTelegramNotification(
    [
      '<b>AI-чат портфоліо</b>',
      '',
      `<b>Час:</b> ${escapeTelegramHtml(timestamp)}`,
      `<b>Мова:</b> ${language === 'en' ? 'EN' : 'UK'}`,
      `<b>IP:</b> <code>${escapeTelegramHtml(getClientIp(req))}</code>`,
      '',
      '<b>Користувач</b>',
      `<pre>${escapeTelegramHtml(truncateForTelegram(userMessage))}</pre>`,
      '',
      '<b>Відповідь AI</b>',
      `<pre>${escapeTelegramHtml(truncateForTelegram(aiReply))}</pre>`,
    ].join('\n'),
    { parseMode: 'HTML' },
  );
};

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.static(distDir, { index: 'index.html' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/download/cv', (req, res) => {
  if (!fs.existsSync(cvFilePath)) {
    return res.status(404).json({ error: 'CV file was not found on the server.' });
  }

  res.download(cvFilePath, cvFileName, async (error) => {
    if (error) {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download CV.' });
      }

      console.error('CV download error:', error);
      return;
    }

    const timestamp = new Intl.DateTimeFormat('uk-UA', {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: process.env.TZ || 'Europe/Kiev',
    }).format(new Date());
    const ipAddress = getClientIp(req);

    await sendTelegramNotification(
      `Ваше резюме було завантажене.\nФайл: ${cvFileName}\nЧас: ${timestamp}\nIP: ${ipAddress}`,
    );
  });
});

app.post('/api/support/heartbeat', (req, res) => {
  const { sessionId, language } = req.body ?? {};
  const session = getSupportSession(sessionId);

  if (!session) {
    return res.status(400).json({ error: 'sessionId is required.' });
  }

  session.lastSeen = Date.now();
  session.language = language === 'en' ? 'en' : 'uk';

  return res.status(200).json({ ok: true });
});

app.get('/api/support/messages', (req, res) => {
  const session = getSupportSession(req.query.sessionId);

  if (!session) {
    return res.status(400).json({ error: 'sessionId is required.' });
  }

  session.lastSeen = Date.now();

  return res.status(200).json({
    messages: session.messages,
    online: isSupportSessionOnline(session),
  });
});

app.post('/api/support/messages', async (req, res) => {
  const { sessionId, text, language } = req.body ?? {};
  const cleanSessionId = String(sessionId || '').trim();
  const cleanText = String(text || '').trim();
  const session = getSupportSession(cleanSessionId);

  if (!session) {
    return res.status(400).json({ error: 'sessionId is required.' });
  }

  if (!cleanText) {
    return res.status(400).json({ error: 'text is required.' });
  }

  session.lastSeen = Date.now();
  session.language = language === 'en' ? 'en' : 'uk';
  session.messages.push(createSupportMessage('user', cleanText.slice(0, 1200)));
  scheduleSupportAutoReply(cleanSessionId, session);

  await sendSupportMessageToTelegram({
    req,
    sessionId: cleanSessionId,
    language: session.language,
    text: cleanText,
  });

  return res.status(200).json({ ok: true, messages: session.messages });
});

app.post('/api/support/contact', async (req, res) => {
  const { sessionId, name, email, phone, message, language } = req.body ?? {};
  const cleanSessionId = String(sessionId || '').trim();
  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim();
  const cleanPhone = String(phone || '').trim();
  const cleanMessage = String(message || '').trim();
  const session = getSupportSession(cleanSessionId);

  if (!session) {
    return res.status(400).json({ error: 'sessionId is required.' });
  }

  if (!cleanName) {
    return res.status(400).json({ error: 'name is required.' });
  }

  if (!cleanEmail && !cleanPhone) {
    return res.status(400).json({ error: 'email or phone is required.' });
  }

  session.lastSeen = Date.now();
  session.language = language === 'en' ? 'en' : 'uk';
  session.awaitingOperatorReply = false;
  clearSupportAutoReplyTimer(session);

  await sendTelegramNotification(
    formatSupportContactForTelegram({
      req,
      sessionId: cleanSessionId,
      language: session.language,
      name: cleanName.slice(0, 120),
      email: cleanEmail.slice(0, 160),
      phone: cleanPhone.slice(0, 80),
      message: cleanMessage.slice(0, 1200),
    }),
    { parseMode: 'HTML' },
  );

  return res.status(200).json({ ok: true });
});

app.post('/api/telegram/webhook', async (req, res) => {
  await handleTelegramSupportReply(req.body?.message);
  return res.status(200).json({ ok: true });
});

app.post('/api/chat', async (req, res) => {
  if (openRouterApiKeys.length === 0) {
    return res.status(500).json({ error: 'OpenRouter keys are not configured on the server.' });
  }

  if (!openRouterModel) {
    return res.status(500).json({ error: 'OpenRouter model is not configured on the server.' });
  }

  const { messages, language } = req.body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array.' });
  }

  const latestUserMessage = [...messages].reverse().find((message) => message?.role === 'user')?.content || '';

  const systemPrompt = language === 'en'
    ? `You are the AI assistant of Maksym Prysiazhnikov's portfolio website. Reply in English. Your primary knowledge base is the portfolio context below.

${portfolioFacts}

Rules:
- Be concise, warm, and factual.
- When the user asks about Maksym, his skills, projects, learning path, or technologies from the site, answer strictly from the portfolio facts.
- Do not invent extra employers, cloud providers, tools, or achievements.
- If the user asks about a general topic, you can still answer, but mention when helpful that you are primarily tailored to Maksym's portfolio and relate the answer back to his stack when possible.`
    : `Ти AI-помічник сайту-портфоліо Максима Присяжнікова. Відповідай українською. Твоя основна база знань — контекст портфоліо нижче.

${portfolioFacts}

Правила:
- Відповідай доброзичливо, коротко і по суті.
- Якщо запит про Максима, його стек, проєкти, навчання або технології із сайту, відповідай строго на основі фактів з портфоліо.
- Українською завжди пиши прізвище як "Присяжніков".
- Не вигадуй зайві місця роботи, інструменти, сертифікати чи досягнення, яких немає у портфоліо.
- Якщо користувач питає про довільну тему, ти можеш відповісти, але доречно зазначай, що ти заточений під це портфоліо, і коли можливо пов'язуй відповідь із реальним стеком Максима.`;

  const requestBody = {
    model: openRouterModel,
    max_tokens: 400,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
  };

  const shuffledKeys = shuffle(openRouterApiKeys);
  let lastError = 'OpenRouter request failed.';

  for (const apiKey of shuffledKeys) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'Maksym Prysiazhnikov Portfolio',
      },
      body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        lastError = data?.error?.message || 'OpenRouter request failed.';

        if ([401, 402, 403, 429].includes(response.status)) {
          continue;
        }

        return res.status(response.status).json({ error: lastError });
      }

      const reply = data?.choices?.[0]?.message?.content;
      const content = Array.isArray(reply)
        ? reply.map((item) => item?.text || '').join('\n').trim()
        : String(reply || '').trim();
      const finalReply = content || 'No response received.';

      await notifyTelegramAboutChat({
        req,
        language,
        userMessage: latestUserMessage,
        aiReply: finalReply,
      });

      return res.status(200).json({ reply: finalReply });
    } catch (error) {
      console.error('OpenRouter chat error:', error);
      lastError = 'Failed to reach OpenRouter.';
    }
  }

  return res.status(502).json({ error: lastError });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Portfolio is running on port ${port}`);
  startTelegramPolling();
});
