// Netlify serverless function to handle contact form submissions.
// Dispatches notifications to Telegram and optional email without third-party form SaaS.

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let name = '';
  let email = '';
  let message = '';
  let gotcha = '';

  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await req.json().catch(() => ({}));
    name = data.name || '';
    email = data.email || '';
    message = data.message || '';
    gotcha = data._gotcha || '';
  } else {
    const formData = await req.formData().catch(() => null);
    if (formData) {
      name = formData.get('name') || '';
      email = formData.get('email') || '';
      message = formData.get('message') || '';
      gotcha = formData.get('_gotcha') || '';
    }
  }

  // Silent drop for automated spam bots filling the hidden honeypot.
  if (gotcha) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  name = String(name).trim();
  email = String(email).trim();
  message = String(message).trim();

  if (!name || !email || !message || name.length > 120 || email.length > 180 || message.length > 4000) {
    return new Response(JSON.stringify({ error: 'Validation failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const safeName = name.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
    const safeEmail = email.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
    const safeMessage = message.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');

    const text = `📬 *Nuevo mensaje en andres\\.dev*\n\n` +
      `👤 *Nombre:* ${safeName}\n` +
      `📧 *Correo:* ${safeEmail}\n\n` +
      `💬 *Mensaje:*\n${safeMessage}`;

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'MarkdownV2',
        }),
      });
    } catch (err) {
      console.error('Telegram dispatch error:', err);
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  const targetEmail = process.env.CONTACT_EMAIL || 'aandreslo14.dev@gmail.com';
  if (resendKey && targetEmail) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portafolio <onboarding@resend.dev>',
          to: [targetEmail],
          subject: `Nuevo contacto de ${name}`,
          text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
        }),
      });
    } catch (err) {
      console.error('Email dispatch error:', err);
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
