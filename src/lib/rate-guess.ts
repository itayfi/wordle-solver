import { Constraints } from "@/lib/types.ts";

export const rateGuess = (
  guess: string[],
  constraints: Constraints,
  allowedWords: (readonly [string, string[]])[],
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
    const greenWords = allowedWords.reduce(
      (count, [, word]) => (word[index] === letter ? count + 1 : count),
      0,
    );
    const pGreen = greenWords / allowedWords.length;
    if (isYellow) {
      return 1 - pGreen * pGreen - (1 - pGreen) * (1 - pGreen);
    }
    const yellowWords = allowedWords.reduce(
      (count, [, word]) => (word.includes(letter) ? count + 1 : count),
      0,
    );
    const pYellow = yellowWords / allowedWords.length - pGreen;
    const pOther = 1 - pGreen - pYellow;
    return 1 - pGreen * pGreen - pYellow * pYellow - pOther * pOther;
  });
  return (
    scorePerLetter.reduce((acc, letter) => acc + letter, 0) /
    scorePerLetter.length /
    0.75
  );
};
