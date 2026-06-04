import { NextResponse } from "next/server";

const API_BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Category API unavailable: ${error.message}` },
      { status: 502 },
    );
  }
}
