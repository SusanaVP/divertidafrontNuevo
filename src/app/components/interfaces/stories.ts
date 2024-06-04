export interface Stories {
  id: number;
  title: string;
  description: string;
  image: string;
  categoriesStory: {
    "id": number,
    "nameCategory": string
  }
}