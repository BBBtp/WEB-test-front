// Конфигурация API для Tauri приложения
// Используется ZeroTier IP адрес вместо localhost

// TODO: Замените на реальный IP адрес из вашей ZeroTier сети
// Пример: const API_BASE_URL = "https://10.147.17.5:443";
export const API_BASE_URL = "https://10.147.17.5:443";

// Проверка, запущено ли приложение в Tauri
export const isTauri = typeof window !== 'undefined' && (
  '__TAURI__' in window || 
  (window as any).__TAURI_INTERNALS__ !== undefined ||
  navigator.userAgent.includes('Tauri')
);

