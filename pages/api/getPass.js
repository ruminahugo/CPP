import { exec } from "child_process";
import path from "path";
import fs, { lutimes } from "fs";
const crypto = require("crypto");
require("dotenv").config();

const SECRET_KEY = process.env.AES_SECRET_KEY; // 32 bytes
const IV = process.env.AES_IV; // 16 bytes

function encrypt(text) {
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY, "utf-8"), Buffer.from(IV, "utf-8"));
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

function execute(type, length) {
    return new Promise((resolve, reject) => {
        if (isNaN(length)) {
            return reject("Missing or invalid parameters");
        }
        const cppFile = path.join(process.cwd(), "randompass_vsc");
        if (!fs.existsSync(cppFile)) {
            return reject("Executable file not found");
        }
        exec(`${cppFile} ${type} ${length}`, (error, stdout, stderr) => {
            if (error) {
                return reject(error.message || stderr || "Execution error");
            }
            resolve(stdout.trim());
        });
    });
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const rules = req.body.rules; // Fix lấy `rules`
        if (!Array.isArray(rules)) {
            return res.status(400).json({ error: "Invalid request format" });
        }

        let result = "";
        for (const item of rules) {
            if (item.type === "default") {
                result += item.value;
            }else if( item.type === "datenow"){
                result += await execute(5, 1);
            } else {
                let type = item.type;
                let length = parseInt(item?.value, 10) || 10;
                let passPart = "";
                if (type === "number") passPart = await execute(2, length);
                if (type === "letters") passPart = await execute(3, length);
                if (type === "alphanumeric") passPart = await execute(4, length);
                result += passPart;
            }
        }

        return res.status(200).json({ password: encrypt(result) });
    } catch (error) {
        console.error("Lỗi xử lý:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
