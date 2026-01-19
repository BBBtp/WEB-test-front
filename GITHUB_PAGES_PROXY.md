# Настройка прокси для GitHub Pages

## Проблема

GitHub Pages работает по HTTPS, а ваш ZeroTier бэкенд по HTTP. Это вызывает ошибку Mixed Content.

## Решение: Относительные пути + GitHub Actions прокси

Для GitHub Pages нужно использовать **относительные пути** для API запросов, которые будут проксироваться через GitHub Actions.

## Вариант 1: GitHub Actions с прокси-функцией

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Вариант 2: Использование _redirects файла (Netlify-стиль)

GitHub Pages не поддерживает _redirects напрямую, но можно использовать:

1. **404.html с JavaScript редиректом** - создайте файл `public/404.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <script>
        // Проксирование API запросов через относительные пути
        if (window.location.pathname.startsWith('/api/')) {
            // Редирект на ZeroTier бэкенд
            const backendUrl = 'http://10.174.203.183:8000' + window.location.pathname + window.location.search;
            fetch(backendUrl)
                .then(response => response.json())
                .then(data => {
                    document.body.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                });
        }
    </script>
</head>
<body>
    <p>Redirecting...</p>
</body>
</html>
```

## Вариант 3: Использование публичного прокси-сервера (рекомендуется)

Это самое надежное решение:

1. Настройте прокси на публичном сервере (см. `PROXY_SETUP.md`)
2. Обновите `src/config/api.ts`:

```typescript
export const API_BASE_URL = "https://your-proxy-domain.com";
```

3. На GitHub Pages запросы будут идти на `https://your-proxy-domain.com/api/...`

## Вариант 4: Cloudflare Workers (бесплатно)

1. Создайте Cloudflare Worker:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  if (url.pathname.startsWith('/api/')) {
    // Проксирование на ZeroTier бэкенд
    const backendUrl = 'http://10.174.203.183:8000' + url.pathname + url.search
    return fetch(backendUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
  }
  
  return fetch(request)
}
```

2. Настройте домен в Cloudflare
3. Обновите `API_BASE_URL` на адрес Worker

## Текущая реализация

В текущей конфигурации используется функция `getApiBaseUrl()`, которая:
- В dev режиме: возвращает пустую строку (прокси через Vite)
- На GitHub Pages: возвращает пустую строку (относительный путь)
- В Tauri: возвращает прямой URL к ZeroTier бэкенду

**ВАЖНО**: Для работы на GitHub Pages с относительными путями нужен один из вариантов выше!
