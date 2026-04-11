import "dotenv/config";
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);
const distDir = path.join(__dirname, 'dist');
const openRouterApiKeys = (process.env.OPENROUTER_KEYS || '')
  .split(/[\n,;]+/)
  .map((key) => key.trim())
  .filter(Boolean);
const openRouterModel = process.env.OPENROUTER_MODEL;
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

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.static(distDir, { index: 'index.html' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
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

      return res.status(200).json({ reply: content || 'No response received.' });
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
});
