import { DrinkEntry } from '../types';

const STORAGE_KEY = 'sipsmart_logs';

export const getLogs = (): DrinkEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse logs", e);
    return [];
  }
};

export const saveLog = (entry: DrinkEntry): DrinkEntry[] => {
  const logs = getLogs();
  const newLogs = [entry, ...logs];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
  return newLogs;
};

export const deleteLog = (id: string): DrinkEntry[] => {
  const logs = getLogs();
  const newLogs = logs.filter(log => log.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
  return newLogs;
};
