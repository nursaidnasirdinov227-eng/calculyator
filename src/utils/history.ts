/**
 * Calculation History Management
 * Provides persistence, deduplication, item removal, and export capabilities.
 */

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  mode: string;
  timestamp: number;
}

const STORAGE_KEY = 'cosmic_calculator_history';

export class HistoryManager {
  public static getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public static addEntry(expression: string, result: string, mode: string = 'Standard'): HistoryItem {
    const history = this.getHistory();
    const newItem: HistoryItem = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      expression,
      result,
      mode,
      timestamp: Date.now(),
    };

    // Keep up to 100 entries, most recent first
    const updated = [newItem, ...history].slice(0, 100);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return newItem;
  }

  public static removeEntry(id: string): HistoryItem[] {
    const history = this.getHistory().filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
    return history;
  }

  public static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  public static exportAsJSON(): string {
    const history = this.getHistory();
    return JSON.stringify(history, null, 2);
  }

  public static exportAsText(): string {
    const history = this.getHistory();
    return history
      .map(
        (item) =>
          `[${new Date(item.timestamp).toLocaleTimeString()}] (${item.mode}) ${item.expression} = ${item.result}`
      )
      .join('\n');
  }
}
