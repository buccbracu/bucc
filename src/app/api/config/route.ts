import { NextResponse } from "next/server";
import { getConfigValue } from "@/helpers/appConfigStore"; 
import { setConfigValue } from "@/helpers/appConfigStore";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key"); 
  const defaultValue = searchParams.get("defaultValue");

  if (!key || typeof key !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid config key" },
      { status: 400 },
    );
  }

  try {
    const value = await getConfigValue(key, defaultValue || null);
    return NextResponse.json({ key, value });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching config", details: error },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid config key" },
        { status: 400 },
      );
    }

    await setConfigValue(key, value);
    return NextResponse.json({
      key,
      value,
      message: "Config updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating config", details: error },
      { status: 500 },
    );
  }
}