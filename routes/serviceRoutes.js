const express = require("express");
const Service = require("../models/Service");

const router = express.Router();

/* Get services by salon id */
router.get("/salon/:salonId", async function (req, res) {
  try {
    const services = await Service.find({
      salonId: req.params.salonId,
    }).sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: "Hizmetler getirilirken hata oluştu",
      error: error.message,
    });
  }
});

/* Add new service */
router.post("/", async function (req, res) {
  try {
    const newService = new Service({
      salonId: req.body.salonId,
      name: req.body.name,
      price: req.body.price,
      duration: req.body.duration,
    });

    const savedService = await newService.save();

    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({
      message: "Hizmet eklenirken hata oluştu",
      error: error.message,
    });
  }
});

/* Delete service */
router.delete("/:id", async function (req, res) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Hizmet bulunamadı",
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Hizmet silindi",
    });
  } catch (error) {
    res.status(500).json({
      message: "Hizmet silinirken hata oluştu",
      error: error.message,
    });
  }
});

module.exports = router;
