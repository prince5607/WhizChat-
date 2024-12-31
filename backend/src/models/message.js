const{Schema,model} = require('mongoose');

const MsgSchema = new Schema({
    senderId : {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    recieverId : {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    text:{
        type:String
    },
    image:{
        type:String
    }
},{timestamps:true});

const Message = model('message',MsgSchema);

module.exports = Message;