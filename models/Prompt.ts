import mongoose, { Model, Schema } from "mongoose";

export interface IPrompt {
  title: string;
  content: string;
  language: "english" | "burmese";
  createdBy: mongoose.Types.ObjectId;
}

const PromptSchema = new Schema<IPrompt>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["english", "burmese"],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Prompt: Model<IPrompt> =
  mongoose.models.Prompt || mongoose.model<IPrompt>("Prompt", PromptSchema);

export default Prompt;
