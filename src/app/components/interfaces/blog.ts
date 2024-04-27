import { User } from "./user";

export interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
  heart: number;
  user: User;/*solo la id o algo más quiero aquí???*/
}