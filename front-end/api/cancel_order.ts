export interface CancelOrderParams {
  txid?: string | number;
  cl_ord_id?: string;
  label: "Cancel Order"
}

export async function cancelOrder(params: CancelOrderParams): Promise<any> {
  const res = await fetch("/api/cancel-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  console.log("Cancel Order Response:", data);

  // Check for HTTP errors
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Failed to cancel order`);
  }

  // Check for Kraken API errors
  if (data.error && data.error.length > 0) {
    throw new Error(`Kraken API Error: ${data.error.join(", ")}`);
  }

  return data.result || data;
}
