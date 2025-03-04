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

function execute(type, length){
    if (isNaN(length)) {
        return res.status(400).json({ error: "Missing or invalid parameters" });
    }

    const cppFile = path.join(process.cwd(), "randompass_vsc");

    if (!fs.existsSync(cppFile)) {
        return res.status(500).json({ error: "Executable file not found" });
    }
    exec(`${cppFile} ${type} ${length}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message || stderr || "Execution error" });
        }
        return stdout.trim();
    });

}
export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    
    
    var result = null;
    const rules = req.body;
    //return res.json(rules);
    rules.forEach((item, index)=>{
        if (item.type === "default")
            result += item.value;
        else{
            let type = item.type;
            let length = parseInt(item.value, 10) || 10;
            if (type === "number")
                result += execute(2, length);
            if (type === "character")
                result += execute(3, length);
            if (type === "alphanumeric")
                result += execute(4, length);
            if (type === "datetimenow")
                result += execute(5, length);
        }
    });
    return res.status(200).json({ result: encrypt(result) });
    
}
