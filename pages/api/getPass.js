import { exec } from "child_process";
import path from "path";
import fs from "fs";
const crypto = require("crypto");
require("dotenv").config();

export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    return req.body;
    const length = parseInt(req.query.length, 10) || 10;
    if (isNaN(length) || length < 5) {
        return res.status(400).json({ error: "Missing or invalid parameters" });
    }

    const SECRET_KEY = process.env.AES_SECRET_KEY; // 32 bytes
    const IV = process.env.AES_IV; // 16 bytes

    function encrypt(text) {
        const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY, "utf-8"), Buffer.from(IV, "utf-8"));
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
    }

    const cppFile = path.join(process.cwd(), "randompass_vsc");

    if (!fs.existsSync(cppFile)) {
        return res.status(500).json({ error: "Executable file not found" });
    }

    exec(`${cppFile} ${length}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message || stderr || "Execution error" });
        }
        return res.status(200).json({ result: encrypt(stdout.trim()) });
    });
}
