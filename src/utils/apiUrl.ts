export function getApiUrl(): string {
  return import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'
}
