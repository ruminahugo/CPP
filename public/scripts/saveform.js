 // Lưu HTML vào cookie (bao gồm input)
 function saveToCookie() {
    let container = document.getElementById("container");
    let inputs = container.querySelectorAll("input");

    // Lưu giá trị input vào thuộc tính data-value
    inputs.forEach(input => input.setAttribute("data-value", input.value));

    // Lưu toàn bộ nội dung vào cookie
    document.cookie = "savedContent=" + encodeURIComponent(container.innerHTML) + ";path=/;max-age=86400"; 
}

// Đọc cookie
function getCookie(name) {
    let cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [key, value] = cookie.split("=");
        if (key === name) return decodeURIComponent(value);
    }
    return "";
}

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