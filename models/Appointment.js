const mongoose = require('mongoose');
var Schema = mongoose.Schema;



var AppointmentSchema = new Schema({
  housemaidId: { type: String },
  houseownerId: { type: String },
  appointmentDescription: { type: String },
  appointmentDateandTime: { type: Date }
  // appointmentDateAndTime: { type: String },
  // appointmentTime: { type: Date }
}, { versionKey: false });







const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;