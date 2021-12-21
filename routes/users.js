const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

//Route Sign UP

router.post("/user/signup", async (req, res) => {
  console.log("SignUp road");
  const userExists = await User.findOne({ email: req.fields.email });
  try {
    if (req.fields.password) {
      if (userExists === null) {
        const password = req.fields.password;
        const salt = uid2(16);
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid2(16);

        const newUser = new User({
          email: req.fields.email,

          apiAccount: {
            apiEmail: req.fields.apiAccount.apiEmail,
            apiEncryptPassword: req.fields.apiAccount.apiEncryptPassword,
          },
          token: token,
          hash: hash,
          salt: salt,
        });

        await newUser.save();
        res.json({
          _id: newUser._id,
          token: token,
          account: {
            email: req.fields.email,
          },
        });
      } else {
        res.json({ message: "This email allready has an account" });
      }
    } else {
      res.json({ message: "Missing parameter(s)" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//route login

router.post("/user/login", async (req, res) => {
  console.log("login road");
  const user = await User.findOne({ email: req.fields.email });
  if (user) {
    try {
      const password = req.fields.password;

      const hashFromDb = user.hash;
      const saltFromDb = user.salt;

      const newHash = SHA256(password + saltFromDb).toString(encBase64);

      if (newHash === hashFromDb) {
        res.json({
          message: "Success",
          _id: user.id,
          token: user.token,
        });
      } else {
        res.json({ message: "wrong password" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.json({ message: "user does not exists" });
  }
});

module.exports = router;
