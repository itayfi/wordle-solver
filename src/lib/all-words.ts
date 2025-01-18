import { normalizeFinalLetters } from "@/lib/utils.ts";

export async function getAllWords() {
  const { default: wordsList } = await import("@/assets/word-list.json");
  return wordsList.map(
    (word) => [word, normalizeFinalLetters(word).split("")] as const,
  );
}
