import { useState } from "react";
import styles from "../public/styles/index.module.css";

export default function GetPassPage() {
  const [datas, setData] = useState(null);
  const [length, setLength] = useState("");
  const [notifi, setNotifi] = useState("");

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
    setData(data.result);
    navigator.clipboard.writeText(data.result); // Copy vào clipboard
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
        <div>
          {notifi}
        </div>
      )}
      {datas && (
        <div>
          <p>Mật khẩu: {datas}</p>
          <p>(Đã copy vào clipboard)</p>
        </div>
      )}
    </div>
  );
}
