# Настройка CORS для Tauri приложения

## Проблема
Tauri приложение делает HTTP запросы к бэкенду, и бэкенд должен разрешить эти запросы через CORS (Cross-Origin Resource Sharing).

## Как открыть консоль разработчика в Tauri

В production билде консоль разработчика включена через настройку `"devtools": true` в `tauri.conf.json`.

**Способы открыть консоль:**
1. **Горячие клавиши:**
   - Windows/Linux: `Ctrl + Shift + I` или `F12`
   - macOS: `Cmd + Option + I` или `F12`

2. **Через меню:** Правый клик на окне → "Inspect Element" (если доступно)

3. **Программно:** Можно добавить кнопку в приложении для открытия консоли (требует дополнительной настройки)

## Решение

### Для Django (Python)

В файле `settings.py` добавьте:

```python
# Настройки CORS
CORS_ALLOWED_ORIGINS = [
    "http://10.174.203.183:8000",  # Ваш бэкенд
    "http://localhost:8000",
    "tauri://localhost",  # Tauri приложение
    "http://tauri.localhost",
]

# Или разрешить все локальные запросы (для разработки)
CORS_ALLOW_ALL_ORIGINS = True  # ⚠️ Только для разработки!

# Разрешить все методы
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Разрешить все заголовки
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Разрешить отправку cookies
CORS_ALLOW_CREDENTIALS = True
```

Установите пакет `django-cors-headers`:
```bash
pip install django-cors-headers
```

В `settings.py` добавьте в `INSTALLED_APPS`:
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]
```

И в `MIDDLEWARE`:
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Должно быть в начале
    'django.middleware.common.CommonMiddleware',
    # ...
]
```

### Для FastAPI (Python)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Настройки CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://10.174.203.183:8000",
        "http://localhost:8000",
        "tauri://localhost",
        "http://tauri.localhost",
        "*",  # ⚠️ Для разработки - разрешить все
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Для Express.js (Node.js)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Настройки CORS
app.use(cors({
  origin: [
    'http://10.174.203.183:8000',
    'http://localhost:8000',
    'tauri://localhost',
    'http://tauri.localhost',
    '*' // ⚠️ Для разработки
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Для Flask (Python)

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Настройки CORS
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://10.174.203.183:8000",
            "http://localhost:8000",
            "tauri://localhost",
            "http://tauri.localhost",
            "*"  # ⚠️ Для разработки
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

## Важные замечания

1. **Tauri не отправляет Origin заголовок** - некоторые бэкенды могут требовать явного указания `tauri://localhost` или `null` в списке разрешенных origins.

2. **Для production** - не используйте `*` (wildcard), укажите конкретные origins.

3. **Проверьте User-Agent** - Tauri приложения отправляют запросы с User-Agent, содержащим "Tauri", вы можете использовать это для дополнительной проверки.

4. **Проверьте логи бэкенда** - если запросы не проходят, проверьте логи бэкенда, чтобы увидеть, какой Origin приходит в запросах.

## Тестирование

После настройки CORS проверьте:

1. Запустите бэкенд
2. Запустите Tauri приложение
3. Откройте консоль разработчика в Tauri (F12 или через меню)
4. Проверьте, что запросы к API проходят успешно

## Альтернативное решение

Если CORS не работает, можно использовать прокси на бэкенде или настроить бэкенд так, чтобы он не проверял CORS для запросов от Tauri приложений (по User-Agent или другим признакам).
