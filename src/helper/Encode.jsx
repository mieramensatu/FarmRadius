import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

export function EncodeRole(role) {
  const secretKey = "your-secret-key";
  const encryptedRole = CryptoJS.AES.encrypt(role, secretKey).toString();
  Cookies.set("role", encryptedRole);
  return encryptedRole;
}
