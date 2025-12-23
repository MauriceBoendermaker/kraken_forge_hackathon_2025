export interface AddOrderParams {
  ordertype:
    | "market"
    | "limit"
    | "iceberg"
    | "stop-loss"
    | "take-profit"
    | "stop-loss-limit"
    | "take-profit-limit"
    | "trailing-stop"
    | "trailing-stop-limit"
    | "settle-position";
  type: "buy" | "sell";
  volume: string;
  pair: string;
  price?: string;
  cl_ord_id?: string;
  /** displayvol is For iceberg orders only: quantity to show in the book while the rest remains hidden.
   * Minimum value is 1/15 of volume.
   */
  displayvol?: string;
  /** asset_class Required for non-crypto pairs. Only possible value: "tokenized_asset" */
  asset_class?: "tokenized_asset";
  label: "Place Order"
}

export async function addOrder(params: AddOrderParams): Promise<any> {
  const res = await fetch("/api/add-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  console.log("Add Order Response:", data);

  // Check for HTTP errors
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Failed to place order`);
  }

  // Check for Kraken API errors
  if (data.error && data.error.length > 0) {
    throw new Error(`Kraken API Error: ${data.error.join(", ")}`);
  }

  return data.result || data;
}