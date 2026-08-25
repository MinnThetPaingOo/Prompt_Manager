import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Prompt from "@/models/Prompt";

const languages = ["english", "burmese"];

export async function GET() {
  const { user, response } = await requireUser();

  if (response) {
    return response;
  }

  await connectDB();

  const prompts = await Prompt.find({ createdBy: user.userId })
    .sort({ createdAt: 1 })
    .lean();

  return NextResponse.json({ prompts });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireUser();

  if (response) {
    return response;
  }

  const { title, content, language } = await request.json();

  if (!title?.trim() || !content?.trim() || !languages.includes(language)) {
    return NextResponse.json(
      { message: "Title, content, and a valid language are required" },
      { status: 400 },
    );
  }

  await connectDB();

  const prompt = await Prompt.create({
    title: title.trim(),
    content: content.trim(),
    language,
    createdBy: new mongoose.Types.ObjectId(user.userId),
  });

  return NextResponse.json({ prompt }, { status: 201 });
}
