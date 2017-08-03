const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const DaysSchema = new Schema ();

const InternSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: Boolean, required: true },
    email: { type: String, required: true },
    photo: { type: String, required: true },
    tc: { type: String, required: true },
    dob: { type: Date, required: true },
    starteddate: { type: Date, required: true },
    endeddate: { type: Date, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    department: {type:String, required:true},
    days: [{
        date: Date,
        am: Boolean,
        pm: Boolean
}]
});
/*  BASIC DATA

    _id: ObjectId(7df78ad8902c),
    tc:"52342180926",
    firstname:"Tahsin",
    lastname:"Gül",
    gender:true,
    email:"tahsingul09@gmail.com",
    dob: ISODate("1997-10-15T06:01:17.171Z"),
    starteddate: ISODate("2017-04-03T06:01:17.171Z"),
    endeddate: ISODate("2017-05-11T06:01:17.171Z"),
    phone: "+9053429828",
    verified: false,
    img: "aasdasdasdasşldşlgafdgşfdalgşlfdglşfdgk",
    days:[{
        date:ISODate("2017-04-03T06:01:17.171Z"),
        am:true,
        pm:false,
    },{
        date:ISODate("2017-04-04T06:01:17.171Z"),
        am:true,
        pm:true
    },{
        date:ISODate("2017-04-05T06:01:17.171Z"),
        am:true,
        pm:true
    },{
        date:ISODate("2017-04-06T06:01:17.171Z"),
        am:false,
        pm:true
    }]

*/
// Gender true is MALE, false is FEMALE. false's f = female's f :D
module.exports = mongoose.model('interns', InternSchema, 'interns');