export function parseUsername(input) {
  if (!input) return "";
  const trimmed = input.trim();
  try {
    // If it's a URL like https://github.com/user or http://github.com/user?tab=repos
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const u = new URL(trimmed);
      if (u.hostname !== "github.com") return "";
      const parts = u.pathname.split("/").filter(Boolean);
      return parts?.[0] || "";
    }
  } catch {}
  // Otherwise assume it's the username
  return trimmed.replace(/^@/, ""); // allow @username
}
