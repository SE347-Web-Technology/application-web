interface AppConfig {
  API_BASE_URL: string;
}

interface RuntimeConfigWindow extends Window {
  _env_?: {
    API_BASE_URL?: string;
  };
}

const runtimeApiBaseUrl = (window as RuntimeConfigWindow)._env_?.API_BASE_URL;

// Gán biến từ đối tượng window._env_ do entrypoint script tạo ra.
// Nếu không có, dùng biến VITE_API_BASE_URL từ .env (dành cho lúc dev local).
const config: AppConfig = {
  API_BASE_URL:
    (runtimeApiBaseUrl && runtimeApiBaseUrl !== "__API_BASE_URL__"
      ? runtimeApiBaseUrl
      : undefined) ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:3000",
};

export default config;
