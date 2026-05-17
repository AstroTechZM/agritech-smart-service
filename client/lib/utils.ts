import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^0-9.-]+/g, ''));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  if (typeof value === 'object' && value !== null) {
    const maybeNum = (value as any).balance ?? (value as any).amount ?? value;
    return safeNumber(maybeNum, fallback);
  }
  return fallback;
}

export function safeArray<T>(value: T | T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

