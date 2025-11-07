import { User } from "./User";

enum TypePromo {
  CLIP,       // = 0
  PROD        // = 1
}

// Interface Promotions (Page d'accueil liens youtube ou soundcloud)
export type Promo = {
  promoId: string;
  userId: string;
  user: User;
  link: string;
  typePromo: TypePromo;
  dateStart: Date;
  dateEnd: Date;
  durationDays: number;
  tarif: number;
};