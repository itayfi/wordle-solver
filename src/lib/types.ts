export type LetterMode = "green" | "yellow" | "grey" | null;
export type LetterInfo = {
  letter: string | null;
  mode: "green" | "yellow" | "grey" | null;
};
export type Constraints = {
  greens: (string | null)[];
  yellows: Set<string>;
  yellowByIndex: Map<number, Set<string>>;
  greys: Set<string>;
};
