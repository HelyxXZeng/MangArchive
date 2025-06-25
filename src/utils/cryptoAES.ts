// Hàm tạo AES Key + IV
export async function generateAESKey(): Promise<{ key: string; iv: string }> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 }, //AES có độ dài 256 bit
    true, //cho phép export dữ liệu
    ["encrypt", "decrypt"] //cho phép mã hóa lẫn giải mã
  );

  const rawKey = await crypto.subtle.exportKey("raw", key); //khóa ban đầu dạng raw Buffe dữ liệu
  const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(rawKey))); //Lưu trữ dưới dạng base64

  const iv = crypto.getRandomValues(new Uint8Array(12)); //Initialization Vector dài 12 byte (96 bit).
  const ivBase64 = btoa(String.fromCharCode(...iv)); //Lưu trữ Base64

  return { key: keyBase64, iv: ivBase64 };
}

// Hàm mã hóa tin nhắn
export async function encryptMessage(
  message: string,
  keyBase64: string,
  ivBase64: string
): Promise<string> {
  const keyBuffer = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0)); // chuyển khóa từ base64 sang Uint8Array để dùng WebCryptoAPI
  const ivBuffer = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0)); //tương tự như trên
  //import khóa về dạng có thể dùng được
  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const encodedMessage = new TextEncoder().encode(message); //Chuyển chuỗi tin nhắn thành Uint8Array (dữ liệu nhị phân).
  //Thực hiện mã hóa AES-GCM với IV đã cho.
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: ivBuffer },
    key,
    encodedMessage
  );
  //Chuyển kết quả mã hóa sang Base64 để dễ truyền đi.
  return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}

// Hàm giải mã tin nhắn
export async function decryptMessage(
  encryptedTextBase64: string,
  keyBase64: string,
  ivBase64: string
): Promise<string> {
  //Chuyển khóa & IV từ Base64 → Uint8Array.
  const keyBuffer = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));
  const ivBuffer = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));
  //Import khóa AES để giải mã.
  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  //Chuyển dữ liệu mã hóa từ Base64 → ArrayBuffer.
  const encryptedData = Uint8Array.from(atob(encryptedTextBase64), (c) =>
    c.charCodeAt(0)
  ).buffer;
  //Giải mã tin nhắn bằng AES-GCM.
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuffer },
    key,
    encryptedData
  );
  //Chuyển kết quả từ dạng Uint8Array → chuỗi gốc.
  return new TextDecoder().decode(decryptedBuffer);
}
