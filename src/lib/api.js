// Thin API client for the WMS backend.
// CRA's dev server proxies "/api/*" to http://localhost:3001 (see package.json
// "proxy"), so relative paths work in development and in production behind one
// origin.
//
// A few DB field names differ from what the UI historically used
// (movementRef ↔ movementId, inspectionRef ↔ inspectionId, defectRef ↔
// defectId). The mapping helpers below translate at the boundary so the React
// components keep their original field names.

const TOKEN_KEY = "wms_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request(path, { method = "GET", body } = {}) {
  const token = tokenStore.get();
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Session expired/invalid: clear it and let the app fall back to login.
  if (res.status === 401) {
    tokenStore.clear();
    window.dispatchEvent(new Event("wms:unauthorized"));
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  register: (name, email, password, organizationName) =>
    request("/auth/register", {
      method: "POST",
      body: { name, email, password, organizationName },
    }),
  me: () => request("/auth/me"),
};

// "None"/empty → null, otherwise the value. Forms use "None" for optional links.
const orNull = (v) => (v && v !== "None" ? v : null);

// ── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  list: () => request("/products"),
  create: (data) => request("/products", { method: "POST", body: data }),
  update: (id, data) => request(`/products/${id}`, { method: "PUT", body: data }),
  remove: (id) => request(`/products/${id}`, { method: "DELETE" }),
};

// ── Movements ────────────────────────────────────────────────────────────────
export const movementsApi = {
  list: () => request("/movements"),
  create: (data) => request("/movements", { method: "POST", body: data }),
  remove: (id) => request(`/movements/${id}`, { method: "DELETE" }),
};

// ── Inspections ──────────────────────────────────────────────────────────────
const inspectionFromServer = (i) => ({ ...i, movementId: i.movementRef ?? null });
const inspectionToServer = ({ movementId, criteria, ...rest }) => ({
  ...rest,
  movementRef: orNull(movementId),
  criteria: criteria?.map((c) => ({ label: c.label, result: c.result })),
});

export const inspectionsApi = {
  list: async () => (await request("/inspections")).map(inspectionFromServer),
  create: async (data) =>
    inspectionFromServer(
      await request("/inspections", { method: "POST", body: inspectionToServer(data) })
    ),
  update: async (id, data) =>
    inspectionFromServer(
      await request(`/inspections/${id}`, { method: "PUT", body: inspectionToServer(data) })
    ),
  remove: (id) => request(`/inspections/${id}`, { method: "DELETE" }),
};

// ── Defects ──────────────────────────────────────────────────────────────────
const defectFromServer = (d) => ({ ...d, inspectionId: d.inspectionRef ?? null });
const defectToServer = ({ inspectionId, ...rest }) => ({
  ...rest,
  inspectionRef: orNull(inspectionId),
});

export const defectsApi = {
  list: async () => (await request("/defects")).map(defectFromServer),
  create: async (data) =>
    defectFromServer(
      await request("/defects", { method: "POST", body: defectToServer(data) })
    ),
  update: async (id, data) =>
    defectFromServer(
      await request(`/defects/${id}`, { method: "PUT", body: defectToServer(data) })
    ),
  remove: (id) => request(`/defects/${id}`, { method: "DELETE" }),
};

// ── NCRs + CAPAs ─────────────────────────────────────────────────────────────
const ncrFromServer = (n) => ({ ...n, defectId: n.defectRef ?? null });
const ncrToServer = ({ defectId, capas, ...rest }) => ({
  ...rest,
  defectRef: orNull(defectId),
});

export const ncrsApi = {
  list: async () => (await request("/ncrs")).map(ncrFromServer),
  create: async (data) =>
    ncrFromServer(await request("/ncrs", { method: "POST", body: ncrToServer(data) })),
  update: async (id, data) =>
    ncrFromServer(
      await request(`/ncrs/${id}`, { method: "PUT", body: ncrToServer(data) })
    ),
  remove: (id) => request(`/ncrs/${id}`, { method: "DELETE" }),

  // CAPAs are addressed by their business ids (NCR-0001 / CAPA-0001), matching
  // what the UI passes around.
  addCapa: (ncrId, data) =>
    request(`/ncrs/${ncrId}/capas`, { method: "POST", body: data }),
  updateCapa: (ncrId, capaId, data) =>
    request(`/ncrs/${ncrId}/capas/${capaId}`, { method: "PUT", body: data }),
  removeCapa: (ncrId, capaId) =>
    request(`/ncrs/${ncrId}/capas/${capaId}`, { method: "DELETE" }),
};
