import { Choice } from "./Choice";

// Interface Utilisateur (Utilisateurs de l'application)
export type User = {
  userId: string;
  pseudo: string;
  mail: string;
  passwordHashed: string;
  contactPhone: string;
  Choices: Choice[];
};