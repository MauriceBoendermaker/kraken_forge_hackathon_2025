import { NextRequest, NextResponse } from "next/server";
import { getKrakenSignature } from "../api-signer";

const API_URL = process.env.API_URL;
const ADD_ORDER_PATH = "/0/private/AddOrder";

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();

    const API_KEY = process.env.KRAKEN_API_KEY;
    const PRIVATE_KEY = process.env.KRAKEN_PRIVATE_KEY;

    if (!API_KEY || !PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Missing Kraken API credentials" },
        { status: 500 }
      );
    }

    const nonce = Date.now().toString();

    const body: Record<string, string> = {
      nonce,
      ...params,
    };

    const signature = getKrakenSignature(
      ADD_ORDER_PATH,
      body,
      PRIVATE_KEY
    );

    const response = await fetch(`${API_URL}${ADD_ORDER_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "API-Key": API_KEY,
        "API-Sign": signature,
      },
      body: new URLSearchParams(body).toString(),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}