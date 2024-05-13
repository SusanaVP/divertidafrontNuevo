export interface Event {
    id: number;
    title: string;
    description: string;
    image: string;
    info: string;
    date: Date;
    latitude: number;
    longitude: number;
    url: string;
    expand: boolean;
  }