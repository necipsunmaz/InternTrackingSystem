const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {type:String},
    lastname: {type:String},
    email : {type:String},
    photo: {data:Buffer, contentType:String},
    username: {type:String},
    password: {type:String},
    phone: {type:String},
    department: Schema.Types.ObjectId,
    isEnabled: {type: Boolean, default: false},
    role: {type: Number, default: 2}
});

// if role is true then user's role READ and WRITE, else its just READ.

UserSchema.pre('save', function (next) {
  const users = this,
    SALT_FACTOR = 5;

  if (!users.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(users.password, salt, null, (err, hash) => {
      if (err) return next(err);
      users.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('users', UserSchema, 'users');

// Example user data with mongo
// Mongo db name: internshipdb
// Mongo db collection name: users
/*{
    "firstname" : "Super",
    "lastname" : "Admin",
    "email" : "super@admin.com",
    "username" : "superadmin",
    "password" : "$2a$06$VaLoa.sn/TmzTObHFSh52OLAFVFeMVB8kXIpDfhPzrUdyn5UwvJf2", // SuperAdmin
    "phone" : "5079053564",
    "role" : 0,
    "__v" : 1,
    "isEnabled" : true
}*/