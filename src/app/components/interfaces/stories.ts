export interface Stories {
  id: number;
  title: string;
  description: string;
  categoriesStory: {
    "id": number,
    "nameCategory": string
  }
}