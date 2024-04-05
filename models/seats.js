const mongoose = require('mongoose');

const seatSchema = mongoose.Schema(
    {
        labID: {type: Number},
        seatID: {type: String},
        day: {type: String},
        startTime: {type: String},
        endTime: {type: String},
        status: {type: String},
        reservedBy: 
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            require: false
        }
    },
)

const seat = mongoose.model("Seat", seatSchema);

module.exports = seat;