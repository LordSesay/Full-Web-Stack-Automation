async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

const api = {
  getStats: () => request('/api/encounters/stats'),
  getOptions: () => request('/api/encounters/options'),
  getEncounters: (params = '') => request(`/api/encounters${params ? `?${params}` : ''}`),
  getEncounter: (id) => request(`/api/encounters/${id}`),
  createEncounter: (data) => request('/api/encounters', { method: 'POST', body: JSON.stringify(data) }),
  advanceStatus: (id) => request(`/api/encounters/${id}/status`, { method: 'PATCH' }),
  updateEncounter: (id, data) => request(`/api/encounters/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteEncounter: (id) => request(`/api/encounters/${id}`, { method: 'DELETE' }),
  getHealth: () => request('/health')
};

export default api;
