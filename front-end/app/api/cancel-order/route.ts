import { NextRequest, NextResponse } from "next/server";
import { URLSearchParams } from "url";
import { getKrakenSignature } from "../api-signer";

const KRAKEN_API_URL = process.env.API_URL;
const API_KEY = process.env.KRAKEN_API_KEY!;
const PRIVATE_KEY = process.env.KRAKEN_PRIVATE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();

    const path = "/0/private/CancelOrder";
    const nonce = Date.now().toString();

    const body: Record<string, string> = {
      nonce,
      ...params,
    };

    const bodyString = new URLSearchParams(body).toString();

    const signature = getKrakenSignature(path, body, PRIVATE_KEY);

    const krakenRes = await fetch(KRAKEN_API_URL + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "API-Key": API_KEY,
        "API-Sign": signature,
      },
      body: bodyString,
    });

    const data = await krakenRes.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "CancelOrder failed" },
      { status: 500 }
    );
  }
}