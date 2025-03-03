import { useState } from "react";
import { Button } from "./components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Input } from "./components/ui/input";

const RuleBuilder = () => {
  const [rules, setRules] = useState([{ id: Date.now(), type: "", value: "" }]);
  const [errors, setErrors] = useState({});

  const addRule = () => {
    if (isFormValid()) {
      setRules([...rules, { id: Date.now(), type: "", value: "" }]);
    }
  };

  const updateRule = (id, field, value) => {
    setRules(prevRules => prevRules.map(rule => rule.id === id ? { ...rule, [field]: value } : rule));
    validateRule(id, field, value);
  };

  const removeRule = (id) => {
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
      if (rule.type && rule.type !== "default") {
        if (!/^[0-9]+$/.test(value)) {
          error = "Giá trị phải là số ký tự";
        }
      } else if (rule.type === "default" && !value.trim()) {
        error = "Chuỗi mặc định không được để trống";
      }
    }
    setErrors(prevErrors => ({ ...prevErrors, [id]: error }));
  };

  const isFormValid = () => {
    return rules.length > 0 && rules.every(rule => rule.type && rule.value && !errors[rule.id]);
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      alert(`Rules submitted: ${JSON.stringify(rules, null, 2)}`);
      console.log("Rules submitted:", rules);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      {rules.map(rule => (
        <div key={rule.id} className="flex flex-col gap-1 mb-2">
          <div className="flex items-center gap-2">
            <Select onValueChange={(value) => updateRule(rule.id, "type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Chuỗi mặc định</SelectItem>
                <SelectItem value="number">Số</SelectItem>
                <SelectItem value="uppercase">Chữ hoa</SelectItem>
                <SelectItem value="lowercase">Chữ thường</SelectItem>
                <SelectItem value="special">Ký tự đặc biệt</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Value" 
              value={rule.value}
              onChange={(e) => updateRule(rule.id, "value", e.target.value)}
              className={errors[rule.id] ? "border-red-500" : ""}
              disabled={!rule.type} 
            />
            <Button onClick={() => removeRule(rule.id)} variant="destructive">Xóa</Button>
          </div>
          {errors[rule.id] && <span className="text-red-500 text-sm">{errors[rule.id]}</span>}
        </div>
      ))}
      <Button onClick={addRule} variant="outline">+ Thêm Rule</Button>
      <Button onClick={handleSubmit} variant="primary" className="mt-4" disabled={!isFormValid()}>Gửi</Button>
    </div>
  );
};

export default RuleBuilder;
