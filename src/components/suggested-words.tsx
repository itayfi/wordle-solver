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
import { Button } from "@/components/ui/button.tsx";
import { PlusCircle } from "lucide-react";
import { LetterMode } from "@/lib/types.ts";
import { normalizeFinalLetters } from "@/lib/utils.ts";

const allWordsPromise = getAllWords();

export const SuggestedWords = ({ className }: { className?: string }) => {
  const [hardMode, setHardMode] = useState(false);
  const allWords = use(allWordsPromise);
  const constraints = useStore(({ constraints }) => constraints);
  const addWord = useStore(({ addWord }) => addWord);
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
  const getMode = (letter: string, index: number): LetterMode => {
    const normalizedLetter = normalizeFinalLetters(letter);
    if (constraints.greens[index] === normalizedLetter) {
      return "green";
    }
    if (constraints.greys.has(normalizedLetter)) {
      return "grey";
    }
    if (constraints.yellowByIndex.get(index)?.has(normalizedLetter)) {
      return "yellow";
    }
    return null;
  };
  const onAddWord = (word: string) => {
    const letterInfos = word
      .split("")
      .map((letter, index) => ({ letter, mode: getMode(letter, index) }));
    addWord(letterInfos);
  };

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
        {allowedWords.length === 0 ? (
          <p className="leading-7 mt-6">אין כאן מילים, אולי טעית?</p>
        ) : (
          <Table>
            <TableBody>
              {ratedWords.slice(0, 10).map(({ word, score }) => (
                <TableRow key={word}>
                  <TableCell className="w-20">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="-my-1.5"
                      onClick={() => onAddWord(word)}
                    >
                      <PlusCircle />
                    </Button>
                  </TableCell>
                  <TableCell className="text-base w-2/3">{word}</TableCell>
                  <TableCell className="text-base w-1/3">
                    {Math.round(score * 100)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
