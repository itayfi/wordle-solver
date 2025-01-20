import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ForwardedRef, forwardRef, useRef } from "react";
import { Button } from "@/components/ui/button.tsx";
import { LetterMode } from "@/lib/types.ts";

const REGEX_HEBREW = "^[א-ת]+$";
const REGEX_HEBREW_SIGNLE = "^[א-ת]$";

export const Wordle = ({ className }: { className?: string }) => {
  const count = useStore(({ words }) => words.length);
  const reset = useStore(({ reset }) => reset);
  const lastWord = useStore(({ words }) => words[words.length - 1]);
  const shouldAddExtra = lastWord
    ? lastWord.some(({ letter, mode }) => letter !== null || mode !== null)
    : true;
  return (
    <div className={cn("space-y-5", className)}>
      {[...new Array(count + (shouldAddExtra ? 1 : 0))].map((_, i) => (
        <WordleRow key={i} index={i} />
      ))}
      <Button onClick={reset} className="block mx-auto" variant="outline">
        איפוס
      </Button>
    </div>
  );
};

const WordleRow = ({ index }: { index: number }) => {
  const letterInfos = useStore(({ words }) => words[index]);
  const setLetter = useStore(({ setLetter }) => setLetter);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const onInput = (data: string, letterIndex: number) => {
    if (data === "Backspace") {
      setLetter(index, letterIndex, { letter: null });
      if (letterIndex > 0) {
        inputs.current[letterIndex - 1]?.focus();
      }
    } else if (new RegExp(REGEX_HEBREW).test(data)) {
      if (
        index < 4 &&
        letterInfos?.[letterIndex]?.letter !== null &&
        letterInfos?.[letterIndex + 1]?.letter === null
      ) {
        setLetter(index, letterIndex + 1, { letter: data });
      } else {
        setLetter(index, letterIndex, { letter: data });
      }
      inputs.current[letterIndex + 1]?.focus();
    } else if (data === "ArrowRight") {
      if (letterIndex > 0) {
        inputs.current[letterIndex - 1]?.focus();
      }
    } else if (data === "ArrowLeft") {
      inputs.current[letterIndex + 1]?.focus();
    } else if (data === "0") {
      setLetter(index, letterIndex, { mode: "grey" });
    } else if (data === "1") {
      setLetter(index, letterIndex, { mode: "yellow" });
    } else if (data === "2") {
      setLetter(index, letterIndex, { mode: "green" });
    }
  };

  return (
    <div className="flex items-center justify-center">
      {[...new Array(5)].map((_, i) => (
        <WordleLetter
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          wordIndex={index}
          letterIndex={i}
          onInput={onInput}
        />
      ))}
    </div>
  );
};

const EMPTY_LETTER = { letter: null, mode: null };
const WordleLetter = forwardRef(
  (
    {
      wordIndex,
      letterIndex,
      onInput,
    }: {
      wordIndex: number;
      letterIndex: number;
      onInput: (data: string, letterIndex: number) => void;
    },
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const { letter, mode } = useStore(
      (state) => state.words[wordIndex]?.[letterIndex] ?? EMPTY_LETTER,
    );
    const setLetter = useStore(({ setLetter }) => setLetter);
    const setMode = (newMode: LetterMode) =>
      setLetter(wordIndex, letterIndex, { mode: newMode });

    return (
      <div className="relative group">
        <input
          ref={ref}
          onKeyDown={(event) => {
            if (["Backspace", "ArrowRight", "ArrowLeft"].includes(event.key)) {
              event.preventDefault();
              onInput(event.key, letterIndex);
            }
          }}
          onInput={(event) => {
            const nativeEvent = event.nativeEvent as InputEvent;
            if (nativeEvent.inputType === "deleteContentBackward") {
              onInput("Backspace", letterIndex);
              return;
            }
            if (
              !nativeEvent.inputType.startsWith("insert") ||
              nativeEvent.data === null
            )
              return;
            for (let i = 0; i < nativeEvent.data.length; i++) {
              onInput(nativeEvent.data.charAt(i), letterIndex + i);
            }
          }}
          value={letter ?? ""}
          type="text"
          pattern={REGEX_HEBREW_SIGNLE}
          className={cn(
            "relative peer bg-background flex size-12 text-center border-y border-e border-input text-xl font-bold shadow-sm transition-all duration-400 group-first:rounded-s-md group-first:border-s group-last:rounded-e-md focus:ring-1 focus:ring-ring focus:z-10",
            {
              "bg-emerald-700": mode === "green",
              "bg-yellow-400": mode === "yellow",
              "bg-neutral-500": mode === "grey",
              "text-white": mode !== null,
            },
          )}
        />
        <div className="absolute left-1/2 -translate-x-1/2 hidden peer-focus:flex group-hover:flex flex-row bg-background gap-1 border rounded-sm shadow-sm p-2 z-10">
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
  },
);

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
      "ring-2 ring-ring": isSelected,
      "hover:ring-2 hover:ring-border": !isSelected,
    })}
    onClick={onClick}
  >
    {mode === null ? <>&times;</> : null}
  </button>
);
