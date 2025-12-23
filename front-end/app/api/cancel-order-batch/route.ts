import { NextRequest, NextResponse } from "next/server";
import { URLSearchParams } from "url";
import { getKrakenSignature } from "../api-signer";

const KRAKEN_API_URL = process.env.API_URL;
const API_KEY = process.env.KRAKEN_API_KEY!;
const PRIVATE_KEY = process.env.KRAKEN_PRIVATE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();

    const path = "/0/private/CancelOrderBatch";
    const nonce = Date.now().toString();

    const body: Record<string, string> = {
      nonce,
    };

    // Add optional fields if present
    if (params.orders) body.orders = JSON.stringify(params.orders);
    if (params.cl_ord_ids) body.cl_ord_ids = JSON.stringify(params.cl_ord_ids);

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
      { error: err.message ?? "CancelOrderBatch failed" },
      { status: 500 }
    );
  }
}