# 📱 Как открыть сайт на телефоне через ZeroTier

## Быстрый способ (для разработки)

### Вариант 1: Vite Dev Server

1. **Соберите проект:**
   ```bash
   npm run build
   ```

2. **Запустите Vite preview с доступом из сети:**
   ```bash
   npm run preview -- --host 0.0.0.0 --port 443
   ```

3. **Откройте на телефоне:**
   ```
   http://10.174.203.183:443
   ```
   (замените на ваш ZeroTier IP)

### Вариант 2: Vite Dev Server (для разработки)

1. **Запустите dev сервер с доступом из сети:**
   ```bash
   npm run dev -- --host 0.0.0.0
   ```

2. **Откройте на телефоне:**
   ```
   http://10.174.203.183:5173
   ```

⚠️ **Важно:** Для HTTPS нужно настроить сертификаты или использовать nginx.

---

## Производственный способ (nginx)

### 1. Соберите проект

```bash
npm run build
```

### 2. Установите nginx

**Windows:**
- Скачайте с https://nginx.org/en/download.html
- Распакуйте в папку (например, `C:\nginx`)

**Linux:**
```bash
sudo apt-get install nginx
```

### 3. Создайте SSL сертификат

```bash
# Создайте самоподписанный сертификат
openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365 -subj "/CN=10.174.203.183"
```

### 4. Настройте nginx

Создайте файл конфигурации (например, `nginx.conf`):

```nginx
server {
    listen 443 ssl;
    server_name 10.174.203.183;  # Ваш ZeroTier IP
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Путь к собранному фронтенду
    root /path/to/WEB-test-front/dist;
    index index.html;
    
    # Отдача статических файлов
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Проксирование API запросов на бэкенд
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. Запустите nginx

**Windows:**
```bash
cd C:\nginx
nginx.exe
```

**Linux:**
```bash
sudo nginx -t  # Проверка конфигурации
sudo systemctl start nginx
sudo systemctl enable nginx  # Автозапуск
```

### 6. Откройте на телефоне

```
https://10.174.203.183:443
```

---

## Простой способ (Python HTTP Server)

Для быстрого тестирования без HTTPS:

```bash
cd dist
python -m http.server 8000 --bind 0.0.0.0
```

Откройте на телефоне:
```
http://10.174.203.183:8000
```

⚠️ **Не используйте для продакшена!** Только для тестирования.

---

## Проверка

После настройки проверьте:

1. ✅ Сайт открывается на компьютере по ZeroTier IP
2. ✅ Сайт открывается на телефоне по ZeroTier IP
3. ✅ API запросы работают
4. ✅ Роутинг работает (можно переходить между страницами)

---

## Решение проблем

**Проблема: "Сайт не открывается"**
- Проверьте firewall - порт должен быть открыт
- Убедитесь, что сервер слушает на `0.0.0.0`, а не на `127.0.0.1`
- Проверьте, что ZeroTier подключен на обоих устройствах

**Проблема: "CORS ошибка"**
- Настройте CORS на бэкенде
- Или используйте nginx для проксирования API

**Проблема: "Предупреждение о сертификате"**
- Это нормально для самоподписанного сертификата
- Нажмите "Продолжить" или "Дополнительно" → "Перейти на сайт"


