// Конфигурация API для Tauri приложения
// Используется ZeroTier IP адрес вместо localhost

// TODO: Замените на реальный IP адрес из вашей ZeroTier сети
// Для build режима используется HTTP (порт 8000)
// Для dev режима используется HTTPS через прокси Vite
export const API_BASE_URL = "https://10.174.203.183:8443";

export const isTauri = typeof window !== 'undefined' && (
  '__TAURI__' in (window as Window) || 
  (window as any).__TAURI_INTERNALS__ !== undefined ||
  (window as any).__TAURI_METADATA__ !== undefined ||
  (typeof navigator !== 'undefined' && navigator.userAgent.includes('Tauri')) ||
  // Проверка через переменную окружения Vite
  (import.meta.env && (import.meta.env as any).TAURI_PLATFORM !== undefined)
);

// Логирование для отладки
if (typeof window !== 'undefined') {
  const win = window as Window & {
    __TAURI__?: any;
    __TAURI_INTERNALS__?: any;
    __TAURI_METADATA__?: any;
  };
  
  console.log('🔍 Tauri Detection:', {
    isTauri,
    hasTauri: '__TAURI__' in win,
    hasInternals: win.__TAURI_INTERNALS__ !== undefined,
    hasMetadata: win.__TAURI_METADATA__ !== undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
    API_BASE_URL,
  });
}

