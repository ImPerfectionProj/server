const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
      eventId: String,
      moderatorId: String,
      title: String,
      pictureUrl: String,
      description: String,
      starttime: Date,
      endtime: Date

    },
    { timestamps: true },
);

const eventModel = mongoose.model('event', eventSchema);
module.exports = eventModel;