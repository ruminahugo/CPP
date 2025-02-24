import { exec } from "child_process";
import path from "path";

export default function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { length } = req.query;
    if (!length || length < 5) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    // Đường dẫn tới file C++
    const cppFile = path.join(process.cwd(), "randompass_vsc");

    // Chạy file C++ với 2 tham số
    exec(`${cppFile} ${length}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr || "Execution error" });
        }
        return res.status(200).json({ result: stdout.trim() });
    });
}
