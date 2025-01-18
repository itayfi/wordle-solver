import { getAllWords } from "@/lib/all-words.ts";
import { use, useState } from "react";
import { useStore } from "@/lib/store.ts";
import { rateGuess } from "@/lib/rate-guess.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table.tsx";
import { checkWord } from "@/lib/check-word.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
  createLettersCounters,
  createYellowLettersCounter,
} from "@/lib/counter.ts";

const allWordsPromise = getAllWords();

export const SuggestedWords = ({ className }: { className?: string }) => {
  const [hardMode, setHardMode] = useState(false);
  const allWords = use(allWordsPromise);
  const constraints = useStore(({ constraints }) => constraints);
  const allowedWords = allWords.filter(([, letters]) =>
    checkWord(letters, constraints),
  );
  const greenLettersCounters = createLettersCounters(allowedWords);
  const yellowLettersCounter = createYellowLettersCounter(allowedWords);
  const ratedWords =
    allowedWords.length === 1
      ? [{ score: 1, word: allowedWords[0][0], letter: allowedWords[0][1] }]
      : (hardMode || allowedWords.length === 2 ? allowedWords : allWords)
          .map(([word, letters]) => ({
            score: rateGuess(
              letters,
              constraints,
              allowedWords.length,
              greenLettersCounters,
              yellowLettersCounter,
            ),
            word,
            letters,
          }))
          .sort((a, b) => b.score - a.score);

  return (
    <div className={className}>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        ניחושים מומלצים
      </h3>
      <div className="px-3">
        <div className="flex items-center gap-2 cursor-pointer my-2">
          <Checkbox
            id="hardMode"
            checked={hardMode}
            onCheckedChange={() => setHardMode(!hardMode)}
          />
          <label
            htmlFor="hardMode"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            מצב קשה
          </label>
        </div>
        <Table>
          <TableBody>
            {ratedWords.slice(0, 10).map(({ word, score }) => (
              <TableRow key={word}>
                <TableCell className="w-2/3">{word}</TableCell>
                <TableCell className="w-1/3">
                  {Math.round(score * 100)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
