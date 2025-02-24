import { useState } from "react";

export default function GetPassPage() {
  const [datas, setData] = useState(null);

  const fetchData = () => {
    fetch('/api/getPass')
      .then(res => res.json())
      .then(data => {
        setData(data.result);
        navigator.clipboard.writeText(data.result); // Copy vào clipboard
      });
  };

  return (
    <div>
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
