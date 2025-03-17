"use client";
import { useState, useEffect } from "react";
const crypto = require("crypto");
require("dotenv").config();

const SECRET_KEY = process.env.AES_SECRET_KEY || "1234567890abcdef1234567890abcdef"; // 32 bytes
const IV = process.env.AES_IV || "abcdef1234567890"; // 16 bytes
function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY, "utf-8"), Buffer.from(IV, "utf-8"));
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

const RuleBuilder = () => {
  const [rules, setRules] = useState([{ id: Date.now(), type: "", value: "" }]);
  const [errors, setErrors] = useState({});
  const [pwd, setPwd] = useState(null);
  const [copied, setCopied] = useState(false);


  useEffect(() => {
    const saveToCookie = () => {
      const expires = new Date();
      expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // Lưu trong 7 ngày
      document.cookie = `rules=${encodeURIComponent(JSON.stringify(rules))}; expires=${expires.toUTCString()}; path=/`;
    };
    const loadFromCookie = () => {
      const cookies = document.cookie.split("; ");
      const rulesCookie = cookies.find(row => row.startsWith("rules="));
      if (rulesCookie) {
        const rulesData = decodeURIComponent(rulesCookie.split("=")[1]);
        try {
          const parsedRules = JSON.parse(rulesData);
          if (Array.isArray(parsedRules)) {
            setRules(parsedRules);
          }
        } catch (error) {
          console.error("Lỗi khi đọc dữ liệu từ cookie:", error);
        }
      }
    };
    loadFromCookie();        
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Ẩn thông báo sau 2 giây
  };

  const ruleTypes = {
    default: "Chuỗi mặc định",
    number: "Số",
    letters: "Chữ cái",
    alphanumeric: "Chữ và số",
    //special: "Ký tự đặc biệt",
    datenow: "Ngày hiện tại",
  };

  const addRule = () => {
    setRules([...rules, { id: Date.now(), type: "", value: "" }]);
  };

  const updateRule = (id, field, value) => {
    setRules(prevRules =>
      prevRules.map(rule =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };
  
  useEffect(() => {
    rules.forEach(rule => {
      validateRule(rule.id, "value", rule.value);
    });
  }, [rules]); // Chạy lại khi `rules` thay đổi

  const removeRule = id => {
    setRules(prevRules => prevRules.filter(rule => rule.id !== id));
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[id];
      return newErrors;
    });
  };

  const validateRule = (id, field, value) => {
    let error = "";
    const rule = rules.find(r => r.id === id);
    if (field === "value" && rule) {
      if (rule.type === "number" && !/^\d+$/.test(value)) error = "Vui lòng nhập số ký tự";
      if (rule.type === "letters" && !/^\d+$/.test(value)) error = "Vui lòng nhập số ký tự";
      if (rule.type === "alphanumeric" && !/^\d+$/.test(value)) error = "Vui lòng nhập số ký tự";
      //if (rule.type === "special" && !/^\d+$/.test(value)) error = "Vui lòng nhập số ký tự";
      //if (rule.type === "datenow" && !/^\d+$/.test(value)) error = "Vui lòng nhập số ký tự";
      if (rule.type === "default" && !value.trim()) error = "Không được để trống";
    }
    setErrors(prevErrors => ({ ...prevErrors, [id]: error }));
  };

  const isFormValid = () => {
    return rules.length > 0 && rules.every(rule => rule.type && (rule.value && !errors[rule.id] || rule.type === "datenow"));
  };

  const handleSubmit = async () => {
    if (isFormValid()) {
      const response = await fetch("/api/getPass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      });
      const data = await response.json();
      const decryptedpwd = decrypt(data.password);
      setPwd(decryptedpwd);
    }
  };

  return (
    <div className="w-fct m-at p-4 border rounded-lg bg-white shadow" id="container">
      {rules.map(rule => (
        <div key={rule.id} className="flex flex-col gap-1 mb-2">
          <div className="flex items-center gap-2">
            <select
              className="border px-3 py-1 rounded"
              onChange={e => updateRule(rule.id, "type", e.target.value)}
              value={rule.type}
            >
              <option value="">Chọn loại</option>
              {Object.entries(ruleTypes).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <input
              type="text"
              className={`border px-3 py-1 rounded ${errors[rule.id] ? "border-red-500" : ""}`}
              placeholder=""
              value={rule.value}
              onChange={e => updateRule(rule.id, "value", e.target.value)}
              disabled={!rule.type}
              hidden={rule.type === "datenow"}
            />
            <button
              className="px-2 py-1 bg-red-500 text-white rounded"
              disabled={rules.length<=1}
              onClick={() => removeRule(rule.id)}
            >
              Xóa
            </button>
          </div>
          {errors[rule.id] && <div className="flex items-center gap-2"><span className="w-9-3-rem"></span><span className="text-red-500 text-sm">{errors[rule.id]}</span></div>}
        </div>
      ))}
      <div>
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={addRule}
          disabled={!isFormValid()}
        >
          + Thêm Rule
        </button>
        <button
          className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          Tạo mật khẩu
        </button>
        <button
          className="mt-2 ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={saveToCookie}>Lưu tùy chỉnh
        </button>
      </div>
      {pwd && (
        <div>
          <p>Mật khẩu: {pwd}<button onClick={handleCopy}>Copy</button>
          </p>
          {copied && <p>(Đã copy vào clipboard)</p>}
        </div>
      )}
    </div>
  );
};

export default RuleBuilder;
