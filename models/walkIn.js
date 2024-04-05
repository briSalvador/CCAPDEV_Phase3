const mongoose = require('mongoose')

const walkinSchema = mongoose.Schema(
    {
        labID: {type: Number},
        seatID: {type: String},
        day: {type: String},
        startTime: {type: String},
        endTime: {type: String},
        status: {type: String},
        reservedBy: {type: String}
    }
)

const walkIn = mongoose.model("walkIn", walkinSchema);
module.exports = walkIn;