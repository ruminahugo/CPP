import { exec } from "child_process";
import path from "path";
const crypto = require("crypto");
require("dotenv").config();

export default function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { length } = req.query || 10;
    if (!length || length < 5) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    const SECRET_KEY = process.env.AES_SECRET_KEY || "1234567890abcdef1234567890abcdef"; // 32 bytes
    const IV = process.env.AES_IV || "abcdef1234567890"; // 16 bytes
    // Hàm mã hóa AES
    function encrypt(text) {
        const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), IV);
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
    }

    // Hàm giải mã AES
    function decrypt(encryptedText) {
        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), IV);
        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }

    const cppFile = path.join(process.cwd(), "randompass_vsc");

    exec(`${cppFile} ${length}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr || "Execution error" });
        }
        return res.status(200).json({ result: encrypt(stdout.trim()) });
    });
}
