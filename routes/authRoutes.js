const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/* Register */
router.post("/register", async function (req, res) {
  try {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        message: "Bu e-posta zaten kayıtlı",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
      role: role,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "Kayıt başarılı",
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Kayıt sırasında hata oluştu",
      error: error.message,
    });
  }
});

/* Login */
router.post("/login", async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        message: "E-posta veya şifre hatalı",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "E-posta veya şifre hatalı",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      message: "Giriş başarılı",
      token: token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Giriş sırasında hata oluştu",
      error: error.message,
    });
  }
});
/* Get all users */
router.get("/users", async function (req, res) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Kullanıcılar getirilirken hata oluştu",
      error: error.message,
    });
  }
});
module.exports = router;
