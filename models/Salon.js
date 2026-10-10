const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    district: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      default: 0
    },

    reviewCount: {
      type: Number,
      default: 0
    },

    phone: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    ownerId: {
      type: String
    },

    ownerName: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Salon = mongoose.model("Salon", salonSchema);

module.exports = Salon;
