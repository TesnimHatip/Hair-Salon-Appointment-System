const express = require("express");
const Salon = require("../models/Salon");

const router = express.Router();

/* Get all salons */
router.get("/", async function (req, res) {
  try {
    const salons = await Salon.find();

    res.status(200).json(salons);
  } catch (error) {
    res.status(500).json({
      message: "Salonlar getirilirken hata oluştu",
      error: error.message,
    });
  }
});
/* Get salon by owner id */
router.get("/owner/:ownerId", async function (req, res) {
  try {
    const salon = await Salon.findOne({
      ownerId: req.params.ownerId,
    });

    if (!salon) {
      return res.status(404).json({
        message: "Bu kullanıcıya ait salon bulunamadı",
      });
    }

    res.status(200).json(salon);
  } catch (error) {
    res.status(500).json({
      message: "Salon bilgisi getirilirken hata oluştu",
      error: error.message,
    });
  }
});
/* Get one salon by id */
router.get("/:id", async function (req, res) {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({
        message: "Salon bulunamadı",
      });
    }

    res.status(200).json(salon);
  } catch (error) {
    res.status(500).json({
      message: "Salon detayı getirilirken hata oluştu",
      error: error.message,
    });
  }
});

/* Add new salon */
router.post("/", async function (req, res) {
  try {
    const newSalon = new Salon({
      name: req.body.name,
      district: req.body.district,
      city: req.body.city,
      phone: req.body.phone,
      address: req.body.address,
      description: req.body.description,
      image: req.body.image,
    });

    const savedSalon = await newSalon.save();

    res.status(201).json(savedSalon);
  } catch (error) {
    res.status(400).json({
      message: "Salon eklenirken hata oluştu",
      error: error.message,
    });
  }
});
/* Update salon */
router.put("/:id", async function (req, res) {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({
        message: "Salon bulunamadı",
      });
    }

    salon.name = req.body.name;
    salon.district = req.body.district;
    salon.city = req.body.city;
    salon.phone = req.body.phone;
    salon.address = req.body.address;
    salon.description = req.body.description;
    salon.image = req.body.image;

    const updatedSalon = await salon.save();

    res.status(200).json(updatedSalon);
  } catch (error) {
    res.status(400).json({
      message: "Salon güncellenirken hata oluştu",
      error: error.message,
    });
  }
});

module.exports = router;
