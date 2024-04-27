export interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  recommended: boolean;
  categoriesVideo: {
    "id": number,
    "nameCategory": string
  }
}