
import { useState, useEffect } from 'react';

function getValueFromStorage<T,>(key: string, initialValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(error);
    return initialValue;
  }
}

export function useLocalStorage<T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getValueFromStorage(key, initialValue);
  });

  useEffect(() => {
    try {
      const valueToStore = storedValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setStoredValue];
}
