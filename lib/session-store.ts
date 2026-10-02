"use client";

/**
 * Tiny sessionStorage-backed stores shared by every component on the page.
 * Used for the code-tab language (FR-1) and the chosen model for sign-up (FR-7).
 * Server render and first client render use the fallback, so hydration matches.
 */
import { useCallback, useSyncExternalStore } from "react";

const EVENT = "synapse:session";

function read(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* private mode: the choice just won't persist */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useSessionValue<T extends string>(key: string, fallback: T, allowed?: readonly T[]): [T, (v: T) => void] {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const value = raw !== null && (!allowed || allowed.includes(raw as T)) ? (raw as T) : fallback;
  const set = useCallback((v: T) => writeSession(key, v), [key]);
  return [value, set];
}

export const LANG_KEY = "synapse.lang";
export const MODEL_KEY = "synapse.model";
export const LANDED_KEY = "synapse.landedAt";
