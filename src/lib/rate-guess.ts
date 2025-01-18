import { Constraints } from "@/lib/types.ts";

export const rateGuess = (guess: string[], constraints: Constraints) => {
  return guess.reduce((score, letter, index) => {
    if (
      constraints.greens.includes(letter) ||
      constraints.greys.has(letter) ||
      guess.slice(0, index).includes(letter)
    ) {
      return score;
    }
    if (constraints.yellows.has(letter)) {
      if (constraints.yellowByIndex.get(index)?.has(letter)) {
        return score;
      }
      return score + 0.1;
    }
    return score + 0.2;
  }, 0);
};
