export interface AddOrderBatchOrder {
  // Optional: User reference id for grouping orders
  userref?: number;
  
  // Optional: Client order identifier either this or userref
  // Formats: Long UUID (with dashes), Short UUID (no dashes)
  cl_ord_id?: string;
  
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
  
  // Optional: For iceberg orders only - quantity to show in book (min 1/15 of volume)
  displayvol?: string;
  
  // Optional: Limit price or trigger price depending on order type
  // Can use +, -, or # prefix for relative prices, % suffix for percentage
  price?: string;
  
  // Optional: Secondary price for stop-loss-limit and take-profit-limit
  price2?: string;
  
  // Optional: Price signal for trigger orders - "index" or "last" (default: "last")
  trigger?: "index" | "last";
  
  // Optional: Amount of leverage desired
  leverage?: string;
  
  // Optional: If true, order will only reduce open position (default: false)
  reduce_only?: boolean;
  
  // Optional: Self trade prevention - cancel-newest, cancel-oldest, or cancel-both (default: cancel-newest)
  stptype?: "cancel-newest" | "cancel-oldest" | "cancel-both";
  
  // Optional: Comma delimited order flags (e.g. "post", "fcib", "fciq", "viqc")
  oflags?: string;
  
  // Optional: Time-in-force - GTC, IOC, or GTD (default: GTC)
  timeinforce?: "GTC" | "IOC" | "GTD";
  
  // Optional: Scheduled start time (0=now, +n=seconds from now, n=unix timestamp)
  starttm?: string;
  
  // Optional: Expiry time for GTD orders (0=no expiration, +n=seconds from now, n=unix timestamp)
  expiretm?: string;
}

export interface AddOrderBatchParams {
  orders: AddOrderBatchOrder[];
  
  pair: string;
  
  // Optional: Required for non-crypto pairs (e.g. tokenized stocks)
  asset_class?: "tokenized_asset";
  
  // Optional: RFC3339 timestamp for order rejection deadline (min now()+2s, max now()+60s)
  deadline?: string;
  
  // Optional: Validate inputs only, do not submit (default: false)
  validate?: boolean;
  label: "Add Order Batch"
}

export async function addOrderBatch(params: AddOrderBatchParams): Promise<any> {
  const res = await fetch("/api/add-order-batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  console.log("Add Order Batch Response:", data);

  // Check for HTTP errors
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Failed to add order batch`);
  }

  // Check for Kraken API errors
  if (data.error && data.error.length > 0) {
    throw new Error(`Kraken API Error: ${data.error.join(", ")}`);
  }

  return data.result || data;
}