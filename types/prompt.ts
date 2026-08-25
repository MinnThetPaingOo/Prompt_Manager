export type PromptLanguage = "english" | "burmese";

export type PromptRecord = {
  _id: string;
  title: string;
  content: string;
  language: PromptLanguage;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};
