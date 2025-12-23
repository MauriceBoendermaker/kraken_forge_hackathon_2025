export interface AmendOrderParams {
  /** Kraken order id (either txid or cl_ord_id is required) */
  txid?: string;

  /** Client order id (either txid or cl_ord_id is required) */
  cl_ord_id?: string;

  /** New order quantity (base asset) */
  order_qty?: string;

  /** Iceberg orders only */
  display_qty?: string;

  /** New limit price (supports + / - / %) */
  limit_price?: string;

  /** New trigger price (supports + / - / %) */
  trigger_price?: string;

  /** Required for non-crypto pairs (e.g. xstocks) */
  pair?: string;

  /** Post-only flag for limit price amends */
  post_only?: boolean;

  /** RFC3339 timestamp */
  deadline?: string;
  label: "Amend Order"
}

export async function amendOrder(params: AmendOrderParams): Promise<any> {
  const res = await fetch("/api/amend-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  console.log("Amend Order Response:", data);

  // Check for HTTP errors
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Failed to amend order`);
  }

  // Check for Kraken API errors
  if (data.error && data.error.length > 0) {
    throw new Error(`Kraken API Error: ${data.error.join(", ")}`);
  }

  return data.result || data;
}
