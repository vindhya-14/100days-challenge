import { formatDistanceToNowStrict, parseISO } from "date-fns";

export function timeAgo(iso) {
  try {
    return formatDistanceToNowStrict(parseISO(iso), { addSuffix: true });
  } catch {
    return "unknown";
  }
}

export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
