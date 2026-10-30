/*
  All HTTP calls live here so pages do not repeat fetch() details.
  Paths start with /api. Vite proxies them to Express on port 3000.
*/

export async function listIssues() {
  const res = await fetch("/api/issues");
  if (!res.ok) throw new Error(`GET failed: ${res.status}`);
  return res.json();
}

export async function createIssue(body) {
  const res = await fetch("/api/issues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((payload.errors && payload.errors.join(", ")) || payload.error || `POST failed: ${res.status}`);
  }
  return payload;
}

export async function updateIssue(id, body) {
  const res = await fetch(`/api/issues/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((payload.errors && payload.errors.join(", ")) || payload.error || `PUT failed: ${res.status}`);
  }
  return payload;
}

export async function deleteIssue(id) {
  const res = await fetch(`/api/issues/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    throw new Error(`DELETE failed: ${res.status}`);
  }
}
