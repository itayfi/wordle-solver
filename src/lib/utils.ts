import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeFinalLetters = (word: string) =>
  word
    .replace("ם", "מ")
    .replace("ף", "פ")
    .replace("ן", "נ")
    .replace("ך", "כ")
    .replace("ץ", "צ");
