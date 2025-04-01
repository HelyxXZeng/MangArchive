// Hàm tạo AES Key + IV
export async function generateAESKey(): Promise<{ key: string; iv: string }> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const rawKey = await crypto.subtle.exportKey("raw", key);
  const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(rawKey)));

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ivBase64 = btoa(String.fromCharCode(...iv));

  return { key: keyBase64, iv: ivBase64 };
}

// Hàm mã hóa tin nhắn
export async function encryptMessage(
  message: string,
  keyBase64: string,
  ivBase64: string
): Promise<string> {
  const keyBuffer = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));
  const ivBuffer = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const encodedMessage = new TextEncoder().encode(message);
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: ivBuffer },
    key,
    encodedMessage
  );

  return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}

// Hàm giải mã tin nhắn
export async function decryptMessage(
  encryptedTextBase64: string,
  keyBase64: string,
  ivBase64: string
): Promise<string> {
  const keyBuffer = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));
  const ivBuffer = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const encryptedData = Uint8Array.from(atob(encryptedTextBase64), (c) =>
    c.charCodeAt(0)
  ).buffer;

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuffer },
    key,
    encryptedData
  );

  return new TextDecoder().decode(decryptedBuffer);
}
