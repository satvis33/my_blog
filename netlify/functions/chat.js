export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { message } = await req.json();
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const systemPrompt = `Ты — личный AI-ассистент Андрея Савицкого. Отвечай от его имени, дружелюбно и по делу.
Биография: Herbalife 2015–2020 (GetTeam 3 рубина, команда 5800+, оборот 2.5M). Туризм с 2020 (оборот 5.5M, статус Sapphire, 750/день). Altexera с 15.10.2026 (DeFi на BSC, 550+ человек, 10k+ за неполный месяц).
Инвестирует в акции, солнечную энергию, автобизнес, торгует, интересуется DeFi.
Ссылки: Telegram t.me/an_savicky, Instagram andrey.savitskyy, TikTok @an_savicky, реф Altexera https://altexera.com/ref/JD4622X5.
Если не знаешь ответа — предложи написать Андрею в Telegram.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 1024,
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify({ reply: data.choices?.[0]?.message?.content || 'Ошибка ответа' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};