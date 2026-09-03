// /app/lib.js/api.js
// Central API client — all calls to the RecoMind Express backend

const BASE =
  import.meta.env.VITE_BASE_URL ||
  "https://staging-recomind-api.onrender.com/recomind/v1";

let currentToken = null;

export function setAuthToken(token) {
  currentToken = token;
}

function getToken() {
  return currentToken;
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
  rollback: (id, analysisId) =>
    request(`/products/${id}/rollback`, {
      method: "POST",
      body: JSON.stringify({ analysisId }),
    }),
  sync: () => request("/products/sync", { method: "POST" }),
  searchShopify: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/products/shopify-search${q ? `?${q}` : ""}`);
  },
  searchShopifyCollections: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/products/shopify-collections${q ? `?${q}` : ""}`);
  },
  syncSelected: (shopifyProductIds) =>
    request("/products/sync-selected", {
      method: "POST",
      body: JSON.stringify({ shopifyProductIds }),
    }),
  removeFromSync: (id) => request(`/products/${id}/sync`, { method: "DELETE" }),
  jobStatus: (jobId) => request(`/products/jobs/${jobId}`),
};

export const promptApi = {
  dashboard: ({ params = {} }) => {
    const q = new URLSearchParams(params).toString();
    return request(`/prompts/win-dashboard${q ? `?${q}` : ""}`);
  },
  dashboardPrompts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/prompts/win-dashboard/prompts${q ? `?${q}` : ""}`);
  },
  simulate: (prompt, productId) =>
    request("/prompts/simulate", {
      method: "POST",
      body: JSON.stringify({ prompt, productId }),
    }),
  simulateCsv: (csv, productId) =>
    request("/prompts/simulate/csv", {
      method: "POST",
      body: JSON.stringify({ csv, productId }),
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
  getSimulation: (id) => request(`/prompts/simulations/${id}`),
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
  competitorGap: async () => {
    const res = await fetch(`${BASE}/reports/competitor-gap`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(
        body?.error || "Failed to generate competitor gap report",
      );
    }
    return res.blob();
  },
  auditLog: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/reports/audit-log${q ? `?${q}` : ""}`);
  },
};

export const impactApi = {
  dashboard: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/impact${q ? `?${q}` : ""}`);
  },
  summary: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/impact/summary${q ? `?${q}` : ""}`);
  },
  products: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/impact/products${q ? `?${q}` : ""}`);
  },
  opportunities: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/impact/opportunities${q ? `?${q}` : ""}`);
  },
};
export const billingApi = {
  getPlans: () => request("/stores/plans"),
  getBilling: () => request("/stores/billing"),
  purchaseTokens: (amount) =>
    request("/stores/billing/tokens", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
};

export const llmFilesApi = {
  get: () => request("/llm-files"),
  generate: () => request("/llm-files/generate", { method: "POST" }),
  publish: () => request("/llm-files/publish", { method: "POST" }),
};
