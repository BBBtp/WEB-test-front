# 🔐 Настройка HTTPS для лабораторной работы 6

## ✅ Что сделано

### 1. Установлены зависимости
- ✅ `vite-plugin-mkcert` - плагин для автоматической работы с сертификатами
- ✅ `@types/node` - уже был установлен

### 2. Созданы сертификаты
- ✅ `ca.crt` и `ca.key` - сертификат Authority
- ✅ `cert.crt` и `cert.key` - сертификат для приложения

**⚠️ ВАЖНО:** Приватные ключи (`.key` файлы) добавлены в `.gitignore` и НЕ должны попадать в репозиторий!

### 3. Настроен vite.config.ts

#### Для ветки `lab_6` (веб-версия):
```typescript
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs'
import path from 'path'

plugins: [react(), mkcert()],
server: {
  https: {
    key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
  },
}
```

#### Для ветки `lab_6_tauri` (Tauri приложение):
- ✅ HTTPS настроен для dev сервера
- ✅ HTTPS настроен для preview режима
- ✅ Сохранена логика определения Tauri окружения

---

## 🚀 Как использовать

### Для веб-версии (ветка `lab_6`):

1. **Запустите dev сервер:**
   ```bash
   npm run dev
   ```

2. **Откройте в браузере:**
   ```
   https://localhost:5173
   ```
   или
   ```
   https://<ваш-ip>:5173
   ```

3. **Браузер покажет предупреждение о сертификате** - это нормально для самоподписанного сертификата. Нажмите "Продолжить" или "Дополнительно" → "Перейти на сайт".

### Для Tauri (ветка `lab_6_tauri`):

1. **Запустите Tauri dev:**
   ```bash
   npm run tauri:dev
   ```

2. **Dev сервер будет доступен по HTTPS:**
   ```
   https://localhost:5173
   ```

3. **Для доступа с телефона:**
   - Убедитесь, что `host: '0.0.0.0'` в конфигурации
   - Откройте на телефоне: `https://<ваш-zerotier-ip>:5173`

---

## 📱 Доступ с телефона через ZeroTier

1. **Убедитесь, что сервер слушает на всех интерфейсах:**
   - В `vite.config.ts` должно быть: `host: '0.0.0.0'`

2. **Узнайте ваш ZeroTier IP:**
   - В приложении ZeroTier или на сайте my.zerotier.com

3. **Откройте на телефоне:**
   ```
   https://<ваш-zerotier-ip>:5173
   ```

4. **Примите предупреждение о сертификате** на телефоне

---

## 🔍 Проверка работы

### Проверка 1: Dev сервер запускается
```bash
npm run dev
```
Должно быть:
```
➜  Local:   https://localhost:5173/
```

### Проверка 2: Service Worker работает
1. Откройте DevTools (F12)
2. Перейдите в Application → Service Workers
3. Должен быть зарегистрирован Service Worker

### Проверка 3: HTTPS активен
- В адресной строке должен быть 🔒 (замок)
- URL должен начинаться с `https://`

---

## ⚠️ Важные замечания

1. **Сертификаты работают только локально** - для продакшена нужны реальные сертификаты от CA

2. **Приватные ключи НЕ в репозитории** - файлы `*.key` добавлены в `.gitignore`

3. **Для разных устройств** - каждый раз при первом подключении нужно принять сертификат

4. **Порт 443** - для preview режима используется порт 443 (стандартный HTTPS порт)

---

## 🐛 Решение проблем

### Проблема: "Cannot find module 'vite-plugin-mkcert'"
**Решение:** Установите плагин:
```bash
npm install -D vite-plugin-mkcert
```

### Проблема: "ENOENT: no such file or directory, open 'cert.key'"
**Решение:** Создайте сертификаты:
```bash
npx mkcert create-ca
npx mkcert create-cert
```

### Проблема: "Port 5173 is already in use"
**Решение:** Остановите другой процесс на этом порту или измените порт в `vite.config.ts`

### Проблема: Браузер не принимает сертификат
**Решение:** 
- Убедитесь, что используете `https://`, а не `http://`
- Нажмите "Продолжить" или "Дополнительно" → "Перейти на сайт"
- Для Chrome: нажмите "Advanced" → "Proceed to localhost (unsafe)"

---

## 📚 Дополнительная информация

- [Документация vite-plugin-mkcert](https://github.com/liuweiGL/vite-plugin-mkcert)
- [Документация mkcert](https://github.com/FiloSottile/mkcert)

