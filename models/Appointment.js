const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: true,
    },

    salonName: {
      type: String,
      required: true,
    },

    customerId: {
      type: String,
    },

    customerName: {
      type: String,
      required: true,
    },

    serviceName: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    note: {
      type: String,
    },

    status: {
      type: String,
      default: "Beklemede",
    },
  },
  {
    timestamps: true,
  },
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
