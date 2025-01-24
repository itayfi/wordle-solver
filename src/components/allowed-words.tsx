import { use } from "react";
import { checkWord } from "@/lib/check-word.ts";
import { useStore } from "@/lib/store.ts";
import { getAllWords } from "@/lib/all-words.ts";
import { useWordBlockList } from "@/lib/use-word-block-list.ts";

const allWordsPromise = getAllWords();
const numberFormat = new Intl.NumberFormat("he");

export const AllowedWords = () => {
  const allWords = use(allWordsPromise);
  const constraints = useStore(({ constraints }) => constraints);
  const { isBlocked } = useWordBlockList();
  const allowedWords = allWords.filter(
    ([, word]) => !isBlocked(word.join("")) && checkWord(word, constraints),
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
