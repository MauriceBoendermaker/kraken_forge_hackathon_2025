export async function getWebSocketsToken(): Promise<any> {
  const res = await fetch("/api/get-websockets-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  console.log("Get WebSockets Token Response:", data);

  // Check for HTTP errors
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: Failed to get websockets token`);
  }

  // Check for Kraken API errors
  if (data.error && data.error.length > 0) {
    throw new Error(`Kraken API Error: ${data.error.join(", ")}`);
  }

  return data.result || data;
}
