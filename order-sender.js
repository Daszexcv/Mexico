/* ============================================================
   Мехико — Order Sender (Telegram + Email)
   ============================================================ */

const ORDER_CONFIG = {
  telegramBotToken: '8697787590:AAHVL8daDCiF6vX6_KKb4k0ngrIpK-iSiLs',
  telegramChatId: '7235641814',
  emailTo: 'ivan_bulychev@inbox.ru',
  formsubmitUrl: 'https://formsubmit.co/ajax/ivan_bulychev@inbox.ru'
};

function formatTelegramMessage(order) {
  const items = order.items.map(it =>
    `  • ${it.name} × ${it.qty} = ${it.price * it.qty} ₽`
  ).join('\n');

  const now = new Date();
  const date = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  let msg = `🆕 НОВЫЙ ЗАКАЗ — ${date}\n\n`;
  msg += `👤 ${order.name}\n`;
  msg += `📞 ${order.phone}\n`;
  msg += `📍 ${order.address}\n`;
  if (order.entrance) msg += `🚪 Подъезд: ${order.entrance}\n`;
  if (order.apartment) msg += `🏠 Кв./офис: ${order.apartment}\n`;
  msg += `\n🛒 Заказ:\n${items}\n\n`;
  msg += `💰 Блюда: ${order.total} ₽\n`;
  msg += `🚗 Доставка: ${order.deliveryFee === 0 ? 'Бесплатно' : order.deliveryFee + ' ₽'}\n`;
  msg += `💵 К оплате: ${order.grandTotal} ₽\n\n`;
  msg += `💳 Оплата: ${order.payment}\n`;
  if (order.comment) msg += `💬 ${order.comment}\n`;

  return msg;
}

async function sendToTelegram(order) {
  const text = formatTelegramMessage(order);
  try {
    const resp = await fetch(
      `https://api.telegram.org/bot${ORDER_CONFIG.telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: ORDER_CONFIG.telegramChatId, text: text })
      }
    );
    return resp.ok;
  } catch (e) {
    console.error('Telegram error:', e);
    return false;
  }
}

async function sendToEmail(order) {
  const items = order.items.map(it =>
    `${it.name} × ${it.qty} = ${it.price * it.qty} ₽`
  ).join('\n');

  const delivery = order.deliveryFee === 0 ? 'Бесплатно' : order.deliveryFee + ' ₽';

  try {
    // Use hidden iframe + form submission to bypass CORS/Cloudflare
    const iframeName = 'emailFrame_' + Date.now();
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://formsubmit.co/' + ORDER_CONFIG.emailTo;
    form.target = iframeName;
    form.style.display = 'none';

    const fields = {
      _subject: `Новый заказ — ${order.name}, ${order.grandTotal} ₽`,
      _template: 'table',
      _captcha: 'false',
      'Имя': order.name,
      'Телефон': order.phone,
      'Адрес': order.address,
      'Подъезд': order.entrance || '—',
      'Кв./офис': order.apartment || '—',
      'Заказ': items,
      'Блюда': order.total + ' ₽',
      'Доставка': delivery,
      'К оплате': order.grandTotal + ' ₽',
      'Оплата': order.payment,
      'Комментарий': order.comment || '—'
    };

    for (const [key, val] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = val;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();

    // Cleanup after a delay
    setTimeout(() => {
      form.remove();
      iframe.remove();
    }, 5000);

    return true;
  } catch (e) {
    console.error('Email error:', e);
    return false;
  }
}

async function sendOrder(order) {
  const [tg, email] = await Promise.all([
    sendToTelegram(order),
    sendToEmail(order)
  ]);
  return { telegram: tg, email: email };
}
