const express = require("express");
const ContactMessage = require("../models/ContactMessage");

const router = express.Router();

/* Send contact message */
router.post("/", async function (req, res) {
  try {
    const newMessage = new ContactMessage({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    });

    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({
      message: "Mesaj gönderilirken hata oluştu",
      error: error.message,
    });
  }
});

/* Get all contact messages */
router.get("/", async function (req, res) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Mesajlar getirilirken hata oluştu",
      error: error.message,
    });
  }
});
/* Update contact message status */
router.put("/:id/status", async function (req, res) {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Mesaj bulunamadı",
      });
    }

    message.status = req.body.status;

    const updatedMessage = await message.save();

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(400).json({
      message: "Mesaj durumu güncellenirken hata oluştu",
      error: error.message,
    });
  }
});
module.exports = router;
