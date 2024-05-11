export interface Favorites {
    id: number;
    title: string;
    description: string;
    categoriesVideo: {
        "id": number,
        "nameCategory": string
      }
}