import { useState } from "react";
import styles from "../public/styles/index.module.css";
import CryptoJS from "crypto-js";
//require("dotenv").config();

export default function GetPassPage() {
  const SECRET_KEY = /*process.env.AES_SECRET_KEY ||*/ "1234567890abcdef1234567890abcdef"; // 32 bytes
  const IV = /*process.env.AES_IV ||*/ "abcdef1234567890"; // 16 bytes
  function decryptAES(encryptedText) {
    if (!encryptedText || typeof encryptedText !== "string") {
        throw new Error("Invalid encrypted text");
    }
    const key = CryptoJS.enc.Hex.parse(SECRET_KEY);
    const iv = CryptoJS.enc.Hex.parse(IV);
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedText) throw new Error("Invalid key or corrupted data");
        return decryptedText;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
  }


  const [pwd, setPwd] = useState(null);
  const [length, setLength] = useState("");
  const [notifi, setNotifi] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Ẩn thông báo sau 2 giây
  };

  const fetchData = () => {
    if (!length) {
      setNotifi("Vui lòng nhập độ dài chuỗi cuối mật khẩu!");
      return;
    }
    if (length < 5) {
      setNotifi("Vui lòng nhập số lớn hơn 4!");
      return;
    }

    fetch(`/api/getPass?length=${length}`)
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    setNotifi("");
    const decryptedpwd = decryptAES(data.result);
    console.log(decryptedpwd);
    setPwd(decryptedpwd);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });

  };

  return (
    <div className={styles.contain}>
      <input
        type="number"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        placeholder="Nhập độ dài chuỗi cuối mật khẩu"
        required
      />
      <button onClick={fetchData}>Tạo mật khẩu</button>
      {notifi && (
        <div className={styles.notification}>
          {notifi}
        </div>
      )}
      {pwd && (
        <div>
          <p>Mật khẩu: {pwd}<button onClick={handleCopy}>Copy</button>
          </p>
          {copied && <p>(Đã copy vào clipboard)</p>}
        </div>
      )}
    </div>
  );
}
