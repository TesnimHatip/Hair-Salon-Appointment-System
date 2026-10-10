const express = require("express");
const Review = require("../models/Review");
const Salon = require("../models/Salon");

const router = express.Router();

/* Add new review */
router.post("/", async function (req, res) {
  try {
    const oldReview = await Review.findOne({
      salonId: req.body.salonId,
      customerId: req.body.customerId,
    });

    if (oldReview) {
      return res.status(400).json({
        message: "Bu salon için daha önce değerlendirme yaptınız.",
      });
    }

    const newReview = new Review({
      salonId: req.body.salonId,
      customerId: req.body.customerId,
      customerName: req.body.customerName,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    const savedReview = await newReview.save();

    const reviews = await Review.find({
      salonId: req.body.salonId,
    });

    let totalRating = 0;

    reviews.forEach(function (review) {
      totalRating = totalRating + review.rating;
    });

    const averageRating = totalRating / reviews.length;

    await Salon.findByIdAndUpdate(req.body.salonId, {
      rating: Number(averageRating.toFixed(1)),
      reviewCount: reviews.length,
    });

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({
      message: "Değerlendirme eklenirken hata oluştu",
      error: error.message,
    });
  }
});

/* Get reviews by salon */
router.get("/salon/:salonId", async function (req, res) {
  try {
    const reviews = await Review.find({
      salonId: req.params.salonId,
    }).sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Değerlendirmeler getirilirken hata oluştu",
      error: error.message,
    });
  }
});

module.exports = router;
