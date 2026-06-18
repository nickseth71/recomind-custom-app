// /app/lib/api.js
// Central API client — all calls to the RecoMind Express backend

const BASE = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

function getToken() {
  return localStorage.getItem("recomind_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const storeApi = {
  getMe: () => request("/api/stores/me"),
};

export const productApi = {
  getDashboard: () => request("/api/products/dashboard"),
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/products${q ? `?${q}` : ""}`);
  },
  get: (id) => request(`/api/products/${id}`),
  analyse: (id) => request(`/api/products/${id}/analyse`, { method: "POST" }),
  analyseBulk: () => request("/api/products/analyse-bulk", { method: "POST" }),
  getAnalyses: (id) => request(`/api/products/${id}/analysis`),
  optimise: (id) => request(`/api/products/${id}/optimise`, { method: "POST" }),
  rollback: (id, analysisId) =>
    request(`/api/products/${id}/rollback`, {
      method: "POST",
      body: JSON.stringify({ analysisId }),
    }),
  sync: () => request("/api/products/sync", { method: "POST" }),
  jobStatus: (jobId) => request(`/api/products/jobs/${jobId}`),
};

export const promptApi = {
  simulate: (prompt, productId) =>
    request("/api/prompts/simulate", {
      method: "POST",
      body: JSON.stringify({ prompt, productId }),
    }),
  analyse: (prompt) =>
    request("/api/prompts/analyse", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    }),
  history: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/prompts/history${q ? `?${q}` : ""}`);
  },
};

export const reportApi = {
  summary: () => request("/api/reports/summary"),
  llmsTxt: async () => {
    const res = await fetch(`${BASE}/api/reports/llms-txt`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Failed to generate llms.txt");
    return res.text();
  },
  auditLog: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/reports/audit-log${q ? `?${q}` : ""}`);
  },
};
