// app/api/scores/route.js

import { NextResponse } from "next/server";
import { openDb } from "../../../lib/db";

export async function GET() {
  const db = await openDb();
  try {
    const scores = await db.all(
      "SELECT score FROM scores ORDER BY id DESC LIMIT 1"
    );
    return NextResponse.json(scores);
  } catch (error) {
    console.error("Error retrieving scores:", error);
    return NextResponse.json(
      { error: "Failed to retrieve scores" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { score } = await request.json();

    if (typeof score !== "number") {
      console.error("Invalid score received:", score);
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    const db = await openDb();
    await db.run("INSERT INTO scores (score) VALUES (?)", score);

    console.log("Score saved successfully:", score);
    return NextResponse.json(
      { message: "Score saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/scores:", error);
    return NextResponse.json(
      { error: "Failed to save score", details: error.message },
      { status: 500 }
    );
  }
}
