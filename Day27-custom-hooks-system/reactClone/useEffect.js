import { hooks, hookIndex } from './customReact.js';

export function useEffect(callback, deps) {
  const currentIndex = hookIndex;

  const oldDeps = hooks[currentIndex];
  let hasChanged = true;

  if (oldDeps) {
    hasChanged = deps.some((dep, i) => dep !== oldDeps[i]);
  }

  if (hasChanged) {
    callback();
    hooks[currentIndex] = deps;
  }

  hookIndex++;
}
