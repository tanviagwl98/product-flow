const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
},
  value: {
     type: Number, 
     required: true, 
     default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

async function nextOrderNumber(session) {
  const doc = await Counter.findOneAndUpdate(
    { 
        name: 'orderSequence'
     },
    { 
        $inc: { value: 1 }
     },
    { 
        new: true,
         upsert: true, 
         session }
  );
  return doc.value;
}

module.exports = { Counter, nextOrderNumber };
