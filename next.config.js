require("dotenv").config();
module.exports = {
    env: {
      AES_SECRET_KEY: process.env.AES_SECRET_KEY,
      AES_IV: process.env.AES_IV,
    },
  };
  