import CryptoJS from "crypto-js";
import { USER_SECRECTKEY } from "@/config/config";

// Encrypts an ID and makes it URL-safe
export const encryptId = (id: number): string => {
  const encrypted = CryptoJS.AES.encrypt(id.toString(), USER_SECRECTKEY).toString();
  
  // Convert to URL-safe Base64
  const urlSafeEncrypted = encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  console.log("Encrypted ID (URL-safe):", urlSafeEncrypted);
  
  return urlSafeEncrypted;
};

// Decrypts a URL-safe Base64 encrypted ID
export const decryptId = (encryptedId: string): number | null => {
  try {
    if (!encryptedId) {
      console.error("No ID provided for decryption.");
      return null;
    }

    // Convert from URL-safe Base64 to standard Base64
    let base64 = encryptedId.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding to make length a multiple of 4
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    console.log("Final Base64 for decryption:", base64);

    // Decrypt using the secret key
    const bytes = CryptoJS.AES.decrypt(base64, USER_SECRECTKEY);
    const decryptedId = bytes.toString(CryptoJS.enc.Utf8);

    console.log("Decrypted ID (string):", decryptedId);

    // Check if decryption resulted in a valid number
    const numericId = parseInt(decryptedId, 10);
    if (isNaN(numericId)) {
      console.error("Decrypted ID is not a valid integer:", decryptedId);
      return null;
    }

    return numericId;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
