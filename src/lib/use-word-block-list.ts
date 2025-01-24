import { useLocalStorage } from "@uidotdev/usehooks";
import { normalizeFinalLetters } from "@/lib/utils.ts";

export const useWordBlockList = () => {
  const [wordBlockList, setWordBlockList] = useLocalStorage<string[]>(
    "wordleBlockList",
    [],
  );
  const blockedSet = new Set(wordBlockList ?? []);

  return {
    isBlocked: (word: string) => blockedSet.has(normalizeFinalLetters(word)),
    blockWord: (word: string) => {
      setWordBlockList((list) => [...list, normalizeFinalLetters(word)]);
    },
  };
};
