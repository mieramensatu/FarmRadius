import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

export function DecodeRole() {
  const [getRole, setGetRole] = useState("");

  useEffect(() => {
    const encryptedRole = Cookies.get("role");
    if (encryptedRole) {
      const decryptedRole = CryptoJS.AES.decrypt(
        encryptedRole,
        "your-secret-key"
      ).toString(CryptoJS.enc.Utf8);
      setGetRole(decryptedRole);
    }
  }, []);

  return { getRole };
}
