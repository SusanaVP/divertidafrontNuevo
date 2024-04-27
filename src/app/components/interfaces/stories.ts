export interface Stories {
    id: number;
    title: string;
    description: string;
    categoriesVideo: {
        "id": number,
        "nameCategory": string
      }
}