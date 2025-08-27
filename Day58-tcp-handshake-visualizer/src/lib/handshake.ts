export const randISN = () => Math.floor(Math.random() * 100000) + 1000;
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
