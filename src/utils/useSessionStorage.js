import { useState } from "react";

const useSessionStorage = (storageKey, initialValue) => {
  const [sessionStorage, setSessionStorage] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setSessionStorageValue = (value) => {
    try {
      setSessionStorage(value);
      window.sessionStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };
  console.log(window.sessionStorage.getItem(storageKey));
  return [sessionStorage, setSessionStorageValue];
};

export default useSessionStorage;
