import { hooks, hookIndex } from './customReact.js';

export function useState(initialValue) {
  const currentIndex = hookIndex;

  hooks[currentIndex] = hooks[currentIndex] ?? initialValue;

  function setState(newValue) {
    hooks[currentIndex] = newValue;
  }

  hookIndex++;

  return [hooks[currentIndex], setState];
}
