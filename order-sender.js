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
    const resp = await fetch(ORDER_CONFIG.formsubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `Новый заказ — ${order.name}, ${order.grandTotal} ₽`,
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
        'Комментарий': order.comment || '—',
        _template: 'table'
      })
    });
    return resp.ok;
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
