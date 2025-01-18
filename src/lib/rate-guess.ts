import { Constraints } from "@/lib/types.ts";

export const rateGuess = (
  guess: string[],
  constraints: Constraints,
  allowedWords: number,
  greenLettersCounters: Map<string, number>[],
  yellowOrGreenLettersCounter: Map<string, number>,
) => {
  const scorePerLetter = guess.map((letter, index) => {
    if (
      constraints.greens.includes(letter) ||
      constraints.greys.has(letter) ||
      guess.slice(0, index).includes(letter)
    ) {
      return 0;
    }
    const isYellow = constraints.yellows.has(letter);
    if (isYellow && constraints.yellowByIndex.get(index)?.has(letter)) {
      return 0;
    }
    const greenWords = greenLettersCounters[index].get(letter) ?? 0;
    const pGreen = greenWords / allowedWords;
    if (isYellow) {
      return entropy(pGreen, 1 - pGreen);
    }
    const yellowOrGreenWords = yellowOrGreenLettersCounter.get(letter) ?? 0;
    const pYellow = yellowOrGreenWords / allowedWords - pGreen;
    return entropy(pGreen, pYellow); //, 1 - pGreen - pYellow);
  });
  return (
    scorePerLetter.reduce((acc, letter) => acc + letter, 0) /
    scorePerLetter.length
  );
};

const entropy = (...args: number[]) => {
  if (args.every((x) => x === 0)) return 0;
  return -args
    .filter((x) => x !== 0)
    .reduce((sum, p) => sum + p * Math.log2(p), 0);
};
