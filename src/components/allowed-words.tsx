import { use } from "react";
import { checkWord } from "@/lib/check-word.ts";
import { useStore } from "@/lib/store.ts";
import { normalizeFinalLetters } from "@/lib/utils.ts";

const allWordsPromise = import("@/assets/word-list.json").then(
  ({ default: wordsList }) =>
    wordsList.map(
      (word) => [word, normalizeFinalLetters(word).split("")] as const,
    ),
);
const numberFormat = new Intl.NumberFormat("he");

export const AllowedWords = () => {
  const allWords = use(allWordsPromise);
  const constraints = useStore(({ constraints }) => constraints);
  const allowedWords = allWords.filter(([, word]) =>
    checkWord(word, constraints),
  );

  return (
    <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        פתרונות אפשריים ({numberFormat.format(allowedWords.length)})
      </h3>
      <ul className="my-6 ms-6 list-disc [&>li]:mt-2">
        {allowedWords.slice(0, 10).map(([word]) => (
          <li key={word}>{word}</li>
        ))}
        {allowedWords.length > 10 ? <li>...</li> : null}
      </ul>
    </>
  );
};
