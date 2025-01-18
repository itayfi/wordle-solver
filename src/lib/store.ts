import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Constraints, LetterInfo } from "@/lib/types.ts";

type Store = {
  words: LetterInfo[][];
  constraints: Constraints;

  setLetter(
    wordIndex: number,
    letterIndex: number,
    data: Partial<LetterInfo>,
  ): void;
  reset(): void;
  //   setGreen(index: number, letter: string): void;
  //   setYellow(index: number, letter: string, count: number): void;
  //   setGrey(index: number, letter: string, count: number): void;
};

export const useStore = create(
  persist<Store>(
    (set) => ({
      words: [],
      constraints: {
        greens: [null, null, null, null, null],
        yellows: new Set(),
        greys: new Set(),
      },
      setLetter: (wordIndex, letterIndex, data) => {
        set(({ words }) => {
          const extendedWords =
            words.length <= wordIndex
              ? [
                  ...words,
                  [...new Array(5)].map(() => ({ letter: null, mode: null })),
                ]
              : words;
          const newWords = extendedWords.map((word, wIdx) =>
            wIdx === wordIndex
              ? word.map((letter, lIdx) =>
                  lIdx === letterIndex
                    ? {
                        ...letter,
                        ...data,
                      }
                    : letter,
                )
              : word,
          );
          return {
            words: newWords,
            constraints: calculateConstraints(newWords),
          };
        });
      },
      reset() {
        set({
          words: [],
          constraints: {
            greens: [null, null, null, null, null],
            yellows: new Set(),
            greys: new Set(),
          },
        });
      },
    }),
    {
      name: "wordle-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

function calculateConstraints(words: LetterInfo[][]): Store["constraints"] {
  const greens: (string | null)[] = [null, null, null, null, null];
  const yellows = new Set<string>();
  const greys = new Set<string>();

  for (const word of words) {
    for (const letterIndex in word) {
      const { letter, mode } = word[letterIndex];
      if (letter === null) continue;
      switch (mode) {
        case "green":
          greens[letterIndex] = letter;
          break;
        case "yellow":
          yellows.add(letter);
          break;
        case "grey":
          greys.add(letter);
      }
    }
  }

  return { greens, yellows, greys };
}
