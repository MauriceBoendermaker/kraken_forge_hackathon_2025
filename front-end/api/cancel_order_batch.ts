export interface CancelOrderBatchParams {
  // Optional: Array of transaction IDs or user references (max 50 total)
  orders?: (string | number)[];
  
  // Optional: Array of client order identifiers (max 50 total)
  cl_ord_ids?: string[];
  label: "Cancel Order Batch"
}

export async function cancelOrderBatch(params: CancelOrderBatchParams): Promise<any> {
  const res = await fetch("/api/cancel-order-batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  console.log("Cancel Order Batch Response:", data);

  // Check for HTTP errors
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Failed to cancel order batch`);
  }

  // Check for Kraken API errors
  if (data.error && data.error.length > 0) {
    throw new Error(`Kraken API Error: ${data.error.join(", ")}`);
  }

  return data.result || data;
}