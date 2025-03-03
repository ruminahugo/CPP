import { useState } from "react";
import styles from "../public/styles/index.module.css";
import RuleBuilder from "../components/rule";
const crypto = require("crypto");
require("dotenv").config();

export default function GetPassPage() {
  const SECRET_KEY = process.env.AES_SECRET_KEY || "1234567890abcdef1234567890abcdef"; // 32 bytes
  const IV = process.env.AES_IV || "abcdef1234567890"; // 16 bytes
  function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY, "utf-8"), Buffer.from(IV, "utf-8"));
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
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
    const decryptedpwd = decrypt(data.result);
    setPwd(decryptedpwd);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });

  };

  return (
    <div className={styles.contain}>
      <RuleBuilder />
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
