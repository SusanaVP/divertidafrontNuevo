export interface Riddles {
  id: number;
  title: string;
  description: string;
  categoriesRiddles: {
    "id": number,
    "nameCategory": string
  }
}