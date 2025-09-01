export const sampleRows = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  key: Math.floor(Math.random() * 100),
  value: `Record-${i + 1}`,
})).sort((a, b) => a.key - b.key);
