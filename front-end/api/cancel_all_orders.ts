export async function cancelAllOrders(): Promise<any> {
  const res = await fetch("/api/cancel-all-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  console.log("Cancel All Orders Response:", data);

  // Check for HTTP errors
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Failed to cancel all orders`);
  }

  // Check for Kraken API errors
  if (data.error && data.error.length > 0) {
    throw new Error(`Kraken API Error: ${data.error.join(", ")}`);
  }

  return data.result || data;
}

export interface CancelAllOrdersAfterParams {
  timeout: number;
  label: "Cancel all orders after X"
}

export async function cancelAllOrdersAfterX(params: CancelAllOrdersAfterParams): Promise<any> {
  const res = await fetch("/api/cancel-all-orders-after", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  console.log("Cancel All Orders After Response:", data);

  // Check for HTTP errors
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Failed to set cancel all orders after timer`);
  }

  // Check for Kraken API errors
  if (data.error && data.error.length > 0) {
    throw new Error(`Kraken API Error: ${data.error.join(", ")}`);
  }

  return data.result || data;
}