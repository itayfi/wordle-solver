import { LetterMode, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { KeyboardEvent, MutableRefObject, useRef } from "react";
import { Button } from "@/components/ui/button.tsx";

const REGEX_HEBREW = "^[א-ת]+$";
const REGEX_HEBREW_SIGNLE = "^[א-ת]$";

export const Wordle = ({ className }: { className?: string }) => {
  const count = useStore(({ words }) => words.length);
  const reset = useStore(({ reset }) => reset);
  return (
    <div className={cn("space-y-5", className)}>
      {[...new Array(count + 1)].map((_, i) => (
        <WordleRow key={i} index={i} />
      ))}
      <Button onClick={reset} className="block mx-auto" variant="outline">
        איפוס
      </Button>
    </div>
  );
};

const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
  event.preventDefault();

const WordleRow = ({ index }: { index: number }) => {
  const setLetter = useStore(({ setLetter }) => setLetter);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const onKeyUp = (
    event: KeyboardEvent<HTMLInputElement>,
    letterIndex: number,
  ) => {
    event.preventDefault();
    if (event.key === "Backspace") {
      setLetter(index, letterIndex, { letter: null });
      if (letterIndex > 0) {
        inputs.current[letterIndex - 1]?.focus();
      }
    } else if (new RegExp(REGEX_HEBREW).test(event.key)) {
      setLetter(index, letterIndex, { letter: event.key });
      inputs.current[letterIndex + 1]?.focus();
    } else if (event.key === "ArrowRight") {
      if (letterIndex > 0) {
        inputs.current[letterIndex - 1]?.focus();
      }
    } else if (event.key === "ArrowLeft") {
      inputs.current[letterIndex + 1]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center">
      {[...new Array(5)].map((_, i) => (
        <WordleLetter
          key={i}
          inputs={inputs}
          wordIndex={index}
          letterIndex={i}
          onKeyUp={onKeyUp}
        />
      ))}
    </div>
  );
};

const EMPTY_LETTER = { letter: null, mode: null };
const WordleLetter = ({
  wordIndex,
  letterIndex,
  inputs,
  onKeyUp,
}: {
  wordIndex: number;
  letterIndex: number;
  inputs: MutableRefObject<(HTMLInputElement | null)[]>;
  onKeyUp: (
    event: KeyboardEvent<HTMLInputElement>,
    letterIndex: number,
  ) => void;
}) => {
  const { letter, mode } = useStore(
    (state) => state.words[wordIndex]?.[letterIndex] ?? EMPTY_LETTER,
  );
  const setLetter = useStore(({ setLetter }) => setLetter);
  const setMode = (newMode: LetterMode) =>
    setLetter(wordIndex, letterIndex, { mode: newMode });

  return (
    <div className="relative group">
      <input
        ref={(el) => (inputs.current[letterIndex] = el)}
        onKeyDown={onKeyDown}
        onChange={(event) => event.preventDefault()}
        onKeyUp={(event) => onKeyUp(event, letterIndex)}
        value={letter ?? ""}
        type="text"
        pattern={REGEX_HEBREW_SIGNLE}
        className={cn(
          "relative peer bg-background flex size-12 text-center border-y border-e border-input text-xl shadow-sm transition-all group-first:rounded-s-md group-first:border-s group-last:rounded-e-md focus:ring-1 focus:ring-ring focus:z-10",
          {
            "bg-emerald-700": mode === "green",
            "bg-yellow-400": mode === "yellow",
            "bg-neutral-500": mode === "grey",
          },
        )}
      />
      <div className="absolute hidden peer-focus:flex group-hover:flex flex-row bg-background gap-1 border rounded-sm shadow-sm p-2 z-10">
        <LetterModeButton
          mode="green"
          isSelected={mode === "green"}
          onClick={() => setMode("green")}
        />
        <LetterModeButton
          mode="yellow"
          isSelected={mode === "yellow"}
          onClick={() => setMode("yellow")}
        />
        <LetterModeButton
          mode="grey"
          isSelected={mode === "grey"}
          onClick={() => setMode("grey")}
        />
        <LetterModeButton
          mode={null}
          isSelected={mode === null}
          onClick={() => setMode(null)}
        />
      </div>
    </div>
  );
};

const LetterModeButton = ({
  mode,
  isSelected,
  onClick,
}: {
  mode: LetterMode;
  isSelected?: boolean;
  onClick?: () => void;
}) => (
  <button
    className={cn("size-6 rounded-full cursor-pointer", {
      "bg-emerald-700": mode === "green",
      "bg-yellow-400": mode === "yellow",
      "bg-neutral-500": mode === "grey",
      "ring-1 ring-ring": isSelected,
    })}
    onClick={onClick}
  >
    {mode === null ? <>&times;</> : null}
  </button>
);
