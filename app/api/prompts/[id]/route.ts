import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Prompt from "@/models/Prompt";

const languages = ["english", "burmese"];

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getOwnedPrompt(id: string, userId: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return Prompt.findOne({ _id: id, createdBy: userId });
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { user, response } = await requireUser();

  if (response) {
    return response;
  }

  const { id } = await context.params;
  await connectDB();

  const prompt = await getOwnedPrompt(id, user.userId);

  if (!prompt) {
    return NextResponse.json({ message: "Prompt not found" }, { status: 404 });
  }

  return NextResponse.json({ prompt });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireUser();

  if (response) {
    return response;
  }

  const { id } = await context.params;
  const { title, content, language } = await request.json();

  if (!title?.trim() || !content?.trim() || !languages.includes(language)) {
    return NextResponse.json(
      { message: "Title, content, and a valid language are required" },
      { status: 400 },
    );
  }

  await connectDB();

  const prompt = await Prompt.findOneAndUpdate(
    { _id: id, createdBy: user.userId },
    {
      title: title.trim(),
      content: content.trim(),
      language,
    },
    { new: true },
  );

  if (!prompt) {
    return NextResponse.json({ message: "Prompt not found" }, { status: 404 });
  }

  return NextResponse.json({ prompt });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { user, response } = await requireUser();

  if (response) {
    return response;
  }

  const { id } = await context.params;
  await connectDB();

  const prompt = await Prompt.findOneAndDelete({
    _id: id,
    createdBy: user.userId,
  });

  if (!prompt) {
    return NextResponse.json({ message: "Prompt not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Prompt deleted" });
}
