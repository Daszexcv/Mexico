# 🌶 Мехико — Сайт ресторана мексиканской кухни

Статический сайт ресторана с меню, доставкой, корзиной заказов и админ-панелью.

---

## 📁 Структура файлов

```
Mexico/
├── index.html          — Главная страница
├── cart.html           — Страница корзины
├── admin.html          — Админ-панель (редактирование меню)
├── styles.css          — Стили сайта
├── script.js           — Скрипты главной страницы
├── cart.js             — Скрипты корзины
├── order-sender.js     — Отправка заказов в Telegram + Email
├── menu-data.js        — Данные меню (блюда, цены, фото)
├── logo.svg            — Логотип (полный)
├── logo-icon.svg       — Логотип (иконка)
├── .htaccess           — Настройки Apache (безопасность, GZIP, кеш)
├── nginx.conf          — Конфигурация Nginx (шаблон)
├── robots.txt          — Инструкции для поисковиков
└── README.md           — Этот файл
```

---

## 🚀 Деплой на российский хостинг

### Вариант 1: Виртуальный хостинг (Beget, REG.ru, TimeWeb, Sweb)

> Самый простой способ — в пару кликов.

1. **Купите хостинг** на [beget.com](https://beget.com), [reg.ru](https://reg.ru), [timeweb.com](https://timeweb.com) или [sweb.ru](https://sweb.ru)
2. **Привяжите домен** (например, `mexico-restaurant.ru`)
3. **Зайдите в файловый менеджер** хостинга (или подключитесь по FTP)
4. **Загрузите ВСЕ файлы** из этого репозитория в папку `public_html` (или `www`)
5. **Готово!** Сайт работает. `.htaccess` автоматически настроит безопасность, GZIP и HTTPS.

#### FTP-загрузка (если нужно):
```
Хост: ftp.ваш-домен.ru
Логин: (из панели хостинга)
Пароль: (из панели хостинга)
Папка: /public_html/
```

### Вариант 2: VPS / VDS (Timeweb Cloud, VDSina, FirstVDS)

1. **Арендуйте VPS** (от 200₽/мес) на [timeweb.com/cloud](https://timeweb.com/cloud), [vdsina.com](https://vdsina.com), [firstvds.ru](https://firstvds.ru)
2. **Установите Nginx** (обычно предустановлен):
   ```bash
   sudo apt update && sudo apt install nginx certbot python3-certbot-nginx -y
   ```
3. **Скопируйте файлы сайта**:
   ```bash
   sudo mkdir -p /var/www/mexico
   cd /var/www/mexico
   sudo git clone https://github.com/Daszexcv/Mexico.git .
   sudo chown -R www-data:www-data /var/www/mexico
   ```
4. **Настройте Nginx** — скопируйте `nginx.conf`:
   ```bash
   sudo cp /var/www/mexico/nginx.conf /etc/nginx/sites-available/mexico.conf
   sudo nano /etc/nginx/sites-available/mexico.conf
   # Замените "ваш-домен.ru" на реальный домен
   sudo ln -s /etc/nginx/sites-available/mexico.conf /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   sudo nginx -t && sudo systemctl reload nginx
   ```
5. **Получите SSL-сертификат** (бесплатно):
   ```bash
   sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
   ```
6. **Готово!** Сайт доступен по HTTPS.

### Вариант 3: GitHub Pages (бесплатно, без домена)

1. Зайдите в **Settings** → **Pages** в репозитории
2. Выберите ветку `initial-setup`, папку `/ (root)`
3. Нажмите **Save**
4. Сайт будет на `https://daszexcv.github.io/Mexico/`

---

## 🔒 Безопасность

Что включено:

| Защита | Что делает |
|--------|-----------|
| HTTPS-редирект | Автоматический переход на защищённое соединение |
| X-Frame-Options | Защита от встраивания сайта во вредоносные iframe |
| X-Content-Type-Options | Запрет подмены MIME-типов |
| X-XSS-Protection | Встроенная защита браузера от XSS |
| Content-Security-Policy | Ограничение источников загрузки скриптов/стилей/изображений |
| Strict-Transport-Security | Принудительный HTTPS на 1 год |
| Referrer-Policy | Ограничение передачи URL при переходах |
| Permissions-Policy | Запрет доступа к камере/микрофону/геолокации |
| GZIP-сжатие | Быстрая загрузка (HTML, CSS, JS сжимаются) |
| Кеширование | Статика кешируется на 30 дней / 1 год |
| Запрет листинга | Нельзя просмотреть содержимое папок |
| robots.txt | Запрет индексации admin.html и cart.html |
| Парольная защита | Админ-панель защищена паролем (SHA-256) |

---

## ⚙️ Админ-панель

**URL:** `/admin.html`
**Пароль по умолчанию:** `admin`

> ⚠️ Смените пароль сразу после первого входа!

### Возможности:
- Редактирование блюд (название, цена, описание, вес, фото)
- Добавление / удаление блюд
- Смена категории и метки (Хит, Новинка)
- Смена фото через ссылку (загрузите на [imgbb.com](https://imgbb.com))
- Скачивание файла `menu-data.js` для обновления на сервере
- Смена пароля

### Как обновить меню на сервере:
1. Зайдите в админку → отредактируйте меню
2. Нажмите **«Скачать файл меню»**
3. Загрузите скачанный `menu-data.js` на сервер (заменив старый)
4. Меню обновится для всех посетителей

---

## 📱 Уведомления о заказах

Заказы приходят в:
- **Telegram** — мгновенное уведомление в чат
- **Email** — дублирование на почту (через formsubmit.co)

---

## 🔧 Обновление сайта

### Через GitHub:
```bash
cd /var/www/mexico
sudo git pull origin initial-setup
```

### Через FTP:
Просто загрузите обновлённые файлы с заменой.

---

## 📋 Контрольный список деплоя

- [ ] Файлы загружены на хостинг
- [ ] Домен привязан
- [ ] HTTPS работает (зелёный замок в браузере)
- [ ] Сайт открывается
- [ ] Меню с фото отображается
- [ ] Корзина работает
- [ ] Заказ отправляется в Telegram
- [ ] Пароль админки изменён
- [ ] В `robots.txt` заменён `ваш-домен.ru` на реальный домен
- [ ] В `nginx.conf` заменён `ваш-домен.ru` на реальный домен (для VPS)
