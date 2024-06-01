export interface Riddles {
  id: number;
  title: string;
  description: string;
  solution: string;
  categoriesRiddles: {
    "id": number,
    "nameCategory": string
  }
}