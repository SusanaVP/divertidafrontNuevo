import { User } from "./user";

export interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
  heart: number;
  user: User;
  validado: boolean;
}