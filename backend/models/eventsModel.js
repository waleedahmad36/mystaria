import mongoose from 'mongoose'


const eventSchema= new mongoose.Schema({
    text:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:''
    },
},{timestamps:true})


const Event = mongoose.model("Event", eventSchema);

export default Event;

