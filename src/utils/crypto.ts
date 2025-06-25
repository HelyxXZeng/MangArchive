export async function generateRSAKeys(): Promise<{
  publicKey: string;
  privateKey: string;
}> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
    privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
  };
}

export async function encryptMessage(
  message: string,
  publicKeyBase64: string
): Promise<string> {
  const publicKeyBuffer = Uint8Array.from(atob(publicKeyBase64), (c) =>
    c.charCodeAt(0)
  ).buffer;

  const importedKey = await crypto.subtle.importKey(
    "spki",
    publicKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  const encodedMessage = new TextEncoder().encode(message);
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    importedKey,
    encodedMessage
  );

  return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}

export async function decryptMessage(
  encryptedTextBase64: string,
  privateKeyBase64: string
): Promise<string> {
  const privateKeyBuffer = Uint8Array.from(atob(privateKeyBase64), (c) =>
    c.charCodeAt(0)
  ).buffer;

  const importedKey = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );

  const encryptedData = Uint8Array.from(atob(encryptedTextBase64), (c) =>
    c.charCodeAt(0)
  ).buffer;
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    importedKey,
    encryptedData
  );

  return new TextDecoder().decode(decryptedBuffer);
}
