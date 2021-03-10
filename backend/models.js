var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

//User Model
var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
});

var UserSchema =  mongoose.model('User', UserSchema)

var ContactSchema = new Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    rel: String,
});

var ContactSchema =  mongoose.model('Contact', ContactSchema)

var EventSchema = new Schema({
  location: String,
  contacts: Array
});

var EventSchema = mongoose.model('Event', EventSchema)

module.exports = {
  User: UserSchema,
  Contact: ContactSchema,
  Event: EventSchema
}
