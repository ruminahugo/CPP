"use client";
import { useState } from "react";

const RuleBuilder = () => {
  const [rules, setRules] = useState([{ id: Date.now(), type: "", value: "" }]);
  const [errors, setErrors] = useState({});

  const ruleTypes = {
    default: "Chuỗi mặc định",
    number: "Số",
    letters: "Chữ cái",
    alphanumeric: "Chữ và số",
    //special: "Ký tự đặc biệt",
    datetimenow: "Ngày hiện tại",
  };

  const addRule = () => {
    setRules([...rules, { id: Date.now(), type: "", value: "" }]);
  };

  const updateRule = (id, field, value) => {
    setRules(prevRules =>
      prevRules.map(rule => (rule.id === id ? { ...rule, [field]: value } : rule))
    );
    validateRule(id, field, value);
  };

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
      if (rule.type === "datetimenow" && !/^\d+$/.test(value)) error = "Vui lòng nhập số ký tự";
      if (rule.type === "default" && !value.trim()) error = "Không được để trống";
    }
    setErrors(prevErrors => ({ ...prevErrors, [id]: error }));
  };

  const isFormValid = () => {
    return rules.length > 0 && rules.every(rule => rule.type && rule.value && !errors[rule.id]);
  };

  const handleSubmit = async () => {
    if (isFormValid()) {
      const response = await fetch("/api/getPass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      });
      const data = await response.json();
      console.log("Kết quả:", data);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
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
            />
            <button
              className="px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => removeRule(rule.id)}
            >
              Xóa
            </button>
          </div>
          {errors[rule.id] && <span className="text-red-500 text-sm">{errors[rule.id]}</span>}
        </div>
      ))}
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        onClick={addRule}
        disabled={!isFormValid()}
      >
        + Thêm Rule
      </button>
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!isFormValid()}
      >
        Gửi
      </button>
    </div>
  );
};

export default RuleBuilder;
