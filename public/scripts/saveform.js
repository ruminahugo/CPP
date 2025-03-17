 // Lưu HTML vào cookie (bao gồm input)
 const saveToCookie = () => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // Lưu trong 7 ngày
    document.cookie = `rules=${encodeURIComponent(JSON.stringify(rules))}; expires=${expires.toUTCString()}; path=/`;
  };
  

// Đọc cookie
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
  

// Khôi phục nội dung khi tải trang
window.onload = function () {
    let savedContent = getCookie("savedContent");
    if (savedContent) {
        document.getElementById("container").innerHTML = savedContent;

        // Khôi phục giá trị của input
        let inputs = document.querySelectorAll("#container input");
        inputs.forEach(input => {
            if (input.hasAttribute("data-value")) {
                input.value = input.getAttribute("data-value");
                input.removeAttribute("data-value"); // Xóa thuộc tính sau khi khôi phục
            }
        });
    }
};