import { SubChoice } from "./SubChoice";
import { User } from "./User";

// Interface Choix de l'utilisateur
export type UserChoice = {
    userChoiceId: string;
    user: User;
    userId: string;
    subChoice: SubChoice;
    subChoiceId: string;
};