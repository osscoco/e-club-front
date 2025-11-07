import { Choice } from "./Choice";

// Interface Subchoice (Chanteur, Beatmaker, Ingé son ...)
export type SubChoice = {
  subChoiceId: string;
  name: string;
  choiceId: string;
  choice: Choice;

  // Seulement côté frontend
  checked: boolean;
};