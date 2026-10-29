import type { Message } from "./message";

export type Group = {
  id: string;
  name: string;
  image_url: string;
  messages: Message[];
};
