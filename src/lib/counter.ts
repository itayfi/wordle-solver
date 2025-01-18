const createCounter = (items: string[]) => {
  const result = new Map<string, number>();
  for (const item of items) {
    result.set(item, (result.get(item) ?? 0) + 1);
  }
  return result;
};

export const createLettersCounters = (words: (readonly [string, string[]])[]) =>
  [...new Array(5)].map((_, i) =>
    createCounter(words.map(([, letters]) => letters[i])),
  );

export const createYellowLettersCounter = (
  words: (readonly [string, string[]])[],
) => {
  const result = new Map<string, number>();
  for (const [, letters] of words) {
    const lettersSet = new Set(letters);
    lettersSet.forEach((letter) =>
      result.set(letter, (result.get(letter) ?? 0) + 1),
    );
  }
  return result;
};
