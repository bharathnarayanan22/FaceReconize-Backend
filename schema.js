const mongoose = require("mongoose")


const face_recognizerSchema = new mongoose.Schema({
    name:{
        type: String
    },
    image : {
        type : String
    }
})

const faceUsers = mongoose.model('faceUsersDetails', face_recognizerSchema)

module.exports = { faceUsers }