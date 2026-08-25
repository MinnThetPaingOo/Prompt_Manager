import { NextResponse } from "next/server";

export function errorResponse(error: unknown) {
  if (error instanceof Error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
}
