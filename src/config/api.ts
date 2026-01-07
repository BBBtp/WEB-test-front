// Конфигурация API для Tauri приложения
// Используется ZeroTier IP адрес вместо localhost
// ВАЖНО: По требованиям лабораторной работы должен использоваться HTTPS-сервер

// TODO: Замените на реальный IP адрес из вашей ZeroTier сети
// Для HTTPS используйте порт 443, для HTTP - порт 8000
export const API_BASE_URL = "https://10.174.203.183:443";

// Проверка, запущено ли приложение в Tauri
// В dev режиме Tauri может загружаться через localhost, но все равно определяется как Tauri
export const isTauri = typeof window !== 'undefined' && (
  '__TAURI__' in window || 
  (window as any).__TAURI_INTERNALS__ !== undefined ||
  (window as any).__TAURI_METADATA__ !== undefined ||
  navigator.userAgent.includes('Tauri') ||
  // Проверка через переменную окружения Vite
  import.meta.env.TAURI_PLATFORM !== undefined
);

// Логирование для отладки
if (typeof window !== 'undefined') {
  console.log('🔍 Tauri Detection:', {
    isTauri,
    hasTauri: '__TAURI__' in window,
    hasInternals: (window as any).__TAURI_INTERNALS__ !== undefined,
    hasMetadata: (window as any).__TAURI_METADATA__ !== undefined,
    userAgent: navigator.userAgent,
    API_BASE_URL,
  });
}

