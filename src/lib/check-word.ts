import { Constraints } from "@/lib/types.ts";

export function checkWord(word: string[], constraints: Constraints) {
  for (let i = 0; i < 5; i++) {
    if (constraints.greens[i] !== null && constraints.greens[i] !== word[i]) {
      return false;
    }
    if (constraints.greys.has(word[i])) {
      return false;
    }
  }
  for (const letter of constraints.yellows.keys()) {
    if (!word.includes(letter)) {
      return false;
    }
  }
  return true;
}
