import { Text, Element } from "slate";

export interface CustomText extends Text {
  bold?: true;
}

export type CustomElement = {
  type: string;
  character?: string;
  children: CustomText[];
};

export interface EmojiElement extends CustomElement {
  type: "emoji";
  character: string;
}

export const isEmojiElement = (element: any): element is EmojiElement => {
  return element.type === "emoji";
};
