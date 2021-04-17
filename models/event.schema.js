const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
      eventId: String,
      title: String,
      pictureUrl: String
    },
    { timestamps: true },
);

const eventModel = mongoose.model('event', eventSchema);
module.exports = eventModel;