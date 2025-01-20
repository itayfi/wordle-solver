import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import { Constraints, LetterInfo } from "@/lib/types.ts";
import { normalizeFinalLetters } from "@/lib/utils.ts";

type Store = {
  words: LetterInfo[][];
  constraints: Constraints;

  setLetter(
    wordIndex: number,
    letterIndex: number,
    data: Partial<LetterInfo>,
  ): void;
  addWord(words: LetterInfo[]): void;
  reset(): void;
};

export const useStore = create(
  persist<Store>(
    (set) => ({
      words: [],
      constraints: {
        greens: [null, null, null, null, null],
        yellows: new Set(),
        yellowByIndex: new Map(),
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
              : words.slice(
                  0,
                  words.reduce(
                    (acc, word, index) =>
                      word.some(
                        ({ letter, mode }) => letter !== null || mode !== null,
                      )
                        ? index + 1
                        : acc,
                    1,
                  ),
                );
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
      addWord(word: LetterInfo[]) {
        set(({ words }) => ({
          words: [...words, word],
        }));
      },
      reset() {
        set({
          words: [],
          constraints: {
            greens: [null, null, null, null, null],
            yellows: new Set(),
            yellowByIndex: new Map(),
            greys: new Set(),
          },
        });
      },
    }),
    {
      name: "wordle-store",
      storage: {
        getItem(name: string) {
          const raw = sessionStorage.getItem(name);
          if (!raw) {
            return null;
          }
          const existing = JSON.parse(raw) as StorageValue<Store>;
          const constraints = calculateConstraints(existing.state.words);
          return {
            ...existing,
            state: { words: existing.state.words, constraints },
          } as StorageValue<Store>;
        },
        setItem(name: string, data: StorageValue<Store>) {
          const str = JSON.stringify({
            ...data,
            state: {
              words: data.state.words,
            },
          });
          sessionStorage.setItem(name, str);
        },
        removeItem(name: string) {
          sessionStorage.removeItem(name);
        },
      },
    },
  ),
);

function calculateConstraints(words: LetterInfo[][]): Store["constraints"] {
  const greens: (string | null)[] = [null, null, null, null, null];
  const yellows = new Set<string>();
  const yellowByIndex = new Map<number, Set<string>>();
  const greys = new Set<string>();

  for (const word of words) {
    for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
      const { letter, mode } = word[letterIndex];
      if (letter === null) continue;
      const normalizedLetter = normalizeFinalLetters(letter);
      switch (mode) {
        case "green":
          greens[letterIndex] = normalizedLetter;
          break;
        case "yellow":
          yellows.add(normalizedLetter);
          yellowByIndex.set(
            letterIndex,
            yellowByIndex.get(letterIndex) ?? new Set(),
          );
          yellowByIndex.get(letterIndex)?.add(normalizedLetter);
          break;
        case "grey":
          if (!yellows.has(normalizedLetter)) {
            greys.add(normalizedLetter);
          }
      }
    }
  }

  return { greens, yellows, yellowByIndex, greys };
}
