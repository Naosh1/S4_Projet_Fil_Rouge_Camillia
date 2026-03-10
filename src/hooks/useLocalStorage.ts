import { useState, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (val: T) => {
      try {
        setValue(val);
        window.localStorage.setItem(key, JSON.stringify(val));
      } catch {
        // silently fail (private browsing, etc.)
      }
    },
    [key],
  );

  return [value, setStoredValue];
}

export default useLocalStorage;
