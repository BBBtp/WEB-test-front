# Инструкция по настройке Tauri с бэкендом

## Как это работает

### Dev режим (`npm run tauri:dev`)
1. Запускается Vite dev server на порту 5173
2. Tauri подключается к Vite dev server через `devUrl` в `tauri.conf.json`
3. Запросы к API идут через **прокси Vite** (настроен в `vite.config.ts`)
4. Прокси перенаправляет `/api/*` на бэкенд (`http://10.174.203.183:8000`)

### Production билд (`npm run tauri:build`)
1. Собирается статический фронтенд в папку `dist`
2. Tauri использует собранные файлы из `dist`
3. Запросы к API идут **напрямую** к бэкенду (`http://10.174.203.183:8000`)
4. Прокси Vite не работает, так как Vite dev server не запущен

## Текущая конфигурация

### 1. `vite.config.ts` - Прокси для dev режима
```typescript
proxy: {
  '/api': {
    target: 'http://10.174.203.183:8000',  // Ваш бэкенд
    changeOrigin: true,
    secure: false,
  },
}
```
✅ Это работает только в dev режиме, когда запущен Vite dev server

### 2. `tauri.conf.json` - Настройки Tauri
```json
{
  "build": {
    "devUrl": "http://10.174.203.183:5173",  // Vite dev server
    "beforeBuildCommand": "npm run build"
  },
  "app": {
    "security": {
      "csp": "connect-src 'self' http://10.174.203.183:8000 ..."
    }
  }
}
```
✅ `devUrl` - адрес Vite dev server для dev режима
✅ CSP разрешает запросы к бэкенду (`http://10.174.203.183:8000`)

### 3. `src/config/api.ts` - Базовый URL API
```typescript
export const API_BASE_URL = "http://10.174.203.183:8000";
```
✅ Используется в production билде для прямых запросов

### 4. `src/api/symptoms.ts` - Логика определения режима
```typescript
// Проверяем, что это Vite dev server (порт 5173)
const isViteDevServer = (window.location.protocol === 'https:' || window.location.protocol === 'http:') 
  && (window.location.port === '5173' || window.location.hostname.includes('5173'));

// В dev используем прокси (пустой baseUrl = '/api')
// В production используем прямой URL (API_BASE_URL)
const baseUrl = isViteDevServer ? '' : API_BASE_URL;
```

## Проверка работы

### Dev режим
1. Запустите: `npm run tauri:dev`
2. В консоли должно быть:
   ```
   🔍 API Debug: {
     isViteDevServer: true,
     baseUrl: "",
     fullUrl: "/api/symptoms/"
   }
   ```
3. Запрос идет через прокси Vite → бэкенд

### Production билд
1. Соберите: `npm run tauri:build`
2. Запустите собранное приложение
3. Откройте консоль (F12)
4. В консоли должно быть:
   ```
   🔍 API Debug: {
     isViteDevServer: false,
     baseUrl: "http://10.174.203.183:8000",
     fullUrl: "http://10.174.203.183:8000/api/symptoms/"
   }
   ```
5. Запрос идет напрямую к бэкенду

## Важно!

1. **В dev режиме** - прокси работает автоматически через Vite
2. **В production билде** - нужен прямой доступ к бэкенду по IP адресу
3. **CORS должен быть настроен** на бэкенде для разрешения запросов от Tauri (см. `CORS_SETUP.md`)
4. **Бэкенд должен быть доступен** по адресу `http://10.174.203.183:8000` из сети ZeroTier

## Если не работает

1. Проверьте, что бэкенд запущен и доступен по `http://10.174.203.183:8000`
2. Проверьте настройки CORS на бэкенде (см. `CORS_SETUP.md`)
3. Откройте консоль в Tauri (F12) и посмотрите логи
4. Проверьте, что IP адрес правильный в:
   - `src/config/api.ts` (API_BASE_URL)
   - `vite.config.ts` (proxy target)
   - `tauri.conf.json` (CSP)
