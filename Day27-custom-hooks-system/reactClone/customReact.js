export { useState } from './useState.js';
export { useEffect } from './useEffect.js';

export function resetHooks() {
  hookIndex = 0;
}

export let hookIndex = 0;
export const hooks = [];
