import { useState } from "react";

export default function GetPassPage() {
  const [datas, setData] = useState(null);
  const [length, setLength] = useState("");

  const fetchData = () => {
    if (!length || length <= 0) {
      alert("Vui lòng nhập độ dài hợp lệ!");
      return;
    }

    fetch(`/api/getPass?length=${length}`) // Gửi length lên server
      .then(res => res.json())
      .then(data => {
        setData(data.result);
        navigator.clipboard.writeText(data.result); // Copy vào clipboard
      }).error(res.error);
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
    </div>
  );
}
