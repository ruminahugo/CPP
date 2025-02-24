import { useState } from "react";

export default function GetPassPage() {
  const [datas, setData] = useState(null);
  const [length, setLength] = useState("");

  const fetchData = () => {
    if (!length || length <= 0) {
      alert("Vui lòng nhập độ dài hợp lệ!");
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
    <div>
      <input
        type="number"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        placeholder="Nhập độ dài mật khẩu"
        required
      />
      <button onClick={fetchData}>Tạo mật khẩu</button>
      {datas && (
        <div>
          <p>Mật khẩu: {datas}</p>
          <p>(Đã copy vào clipboard)</p>
        </div>
      )}
      {length < 4 && (
        <div>
          Vui lòng nhập giá trị lớn hơn 4!
        </div>
      )}
    </div>
  );
}
