const BASE = "https://api.github.com";

function authHeaders() {
  const token = import.meta.env.VITE_GITHUB_TOKEN?.trim();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetch ALL repos across pages (per_page=100).
 * Returns array of repos owned by the user (public).
 */
export async function fetchAllRepos(username) {
  const perPage = 100;
  let page = 1;
  let repos = [];

  while (true) {
    const url = `${BASE}/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&type=owner&sort=updated&direction=desc`;
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json", ...authHeaders() }
    });

    if (!res.ok) {
      const msg = await safeError(res);
      throw new Error(msg || `GitHub API error ${res.status}`);
    }

    const batch = await res.json();
    repos = repos.concat(batch);
    if (batch.length < perPage) break; // last page
    page += 1;
  }
  return repos;
}

async function safeError(res) {
  try {
    const js = await res.json();
    return js?.message;
  } catch {
    return null;
  }
}
