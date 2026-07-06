// /app/lib.js/api.js
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
  getMe: () => request("/stores/me"),
};

export const productApi = {
  getDashboard: () => request("/products/dashboard"),
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/products${q ? `?${q}` : ""}`);
  },
  get: (id) => request(`/products/${id}`),
  getCompetitors: (id) => request(`/products/${id}/competitors`),
  analyse: (id) => request(`/products/${id}/analyse`, { method: "POST" }),
  analyseBulk: () => request("/products/analyse-bulk", { method: "POST" }),
  getAnalyses: (id) => request(`/products/${id}/analysis`),
  optimise: (id) => request(`/products/${id}/optimise`, { method: "POST" }),
  rollback: (id, analysisId) =>
    request(`/products/${id}/rollback`, {
      method: "POST",
      body: JSON.stringify({ analysisId }),
    }),
  sync: () => request("/products/sync", { method: "POST" }),
  jobStatus: (jobId) => request(`/products/jobs/${jobId}`),
};

export const promptApi = {
  dashboard: ({ params = {} }) => {
    const q = new URLSearchParams(params).toString();
    return request(`/prompts/win-dashboard${q ? `?${q}` : ""}`);
  },
  simulate: (prompt, productId) =>
    request("/prompts/simulate", {
      method: "POST",
      body: JSON.stringify({ prompt, productId }),
    }),
  analyse: (prompt) =>
    request("/prompts/analyse", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    }),
  score: (prompt, productId) =>
    request("/prompts/score", {
      method: "POST",
      body: JSON.stringify({ prompt, productId }),
    }),
  history: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/prompts/history${q ? `?${q}` : ""}`);
  },
  getProductPrompts: (productId, params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/prompts/products/${productId}${q ? `?${q}` : ""}`);
  },
  generateProductPrompts: (productId, prompts = []) =>
    request(`/prompts/products/${productId}/generate`, {
      method: "POST",
      body: JSON.stringify({ prompts }),
    }),
  getPromptFix: (promptId) => request(`/prompts/${promptId}/fix`),
  getPrompt: (promptId) => request(`/prompts/${promptId}`),
};

export const reportApi = {
  summary: () => request("/reports/summary"),
  llmsTxt: async () => {
    const res = await fetch(`${BASE}/reports/llms-txt`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Failed to generate llms.txt");
    return res.text();
  },
  auditLog: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/reports/audit-log${q ? `?${q}` : ""}`);
  },
};
