import CryptoJS from "crypto-js";

export function getKrakenSignature(
  path: string,
  data: Record<string, string | number>,
  privateKey: string
): string {

  const postData = new URLSearchParams(
    Object.entries(data).map(([k, v]) => [k, String(v)])
  ).toString();

  // 2. SHA256(nonce + postData)
  const nonce = data.nonce;
  if (!nonce) {
    throw new Error("Nonce is required for Kraken signature");
  }

  const sha256Hash = CryptoJS.SHA256(
    nonce.toString() + postData
  );

  // 3. Message = path + sha256Hash (binary)
  const message = CryptoJS.enc.Utf8.parse(path).concat(sha256Hash);

  // 4. Decode private key from base64
  const secret = CryptoJS.enc.Base64.parse(privateKey);

  // 5. HMAC-SHA512
  const hmac = CryptoJS.HmacSHA512(message, secret);

  // 6. Base64 encode signature
  return CryptoJS.enc.Base64.stringify(hmac);
}