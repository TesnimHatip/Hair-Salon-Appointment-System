const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

/* Add new appointment */
router.post("/", async function (req, res) {
  try {
    const newAppointment = new Appointment({
      salonId: req.body.salonId,
      salonName: req.body.salonName,
      customerId: req.body.customerId,
      customerName: req.body.customerName,
      serviceName: req.body.serviceName,
      date: req.body.date,
      time: req.body.time,
      note: req.body.note,
    });

    const savedAppointment = await newAppointment.save();

    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({
      message: "Randevu oluşturulurken hata oluştu",
      error: error.message,
    });
  }
});
/* Get appointments by salon id */
router.get("/salon/:salonId", async function (req, res) {
  try {
    const appointments = await Appointment.find({
      salonId: req.params.salonId,
    }).sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Salon randevuları getirilirken hata oluştu",
      error: error.message,
    });
  }
});

/* Get all appointments */
router.get("/", async function (req, res) {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Randevular getirilirken hata oluştu",
      error: error.message,
    });
  }
});
/* Get appointments by customer id */
router.get("/customer/:customerId", async function (req, res) {
  try {
    const appointments = await Appointment.find({
      customerId: req.params.customerId,
    }).sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Müşteri randevuları getirilirken hata oluştu",
      error: error.message,
    });
  }
});
/* Update appointment status */
router.put("/:id/status", async function (req, res) {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Randevu bulunamadı",
      });
    }

    appointment.status = req.body.status;

    const updatedAppointment = await appointment.save();

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(400).json({
      message: "Randevu durumu güncellenirken hata oluştu",
      error: error.message,
    });
  }
});

module.exports = router;
