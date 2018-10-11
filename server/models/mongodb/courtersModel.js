import Promise from 'bluebird';
import MongoDBConnection from '../connections/mongodb.connection';
const Mongoose = new MongoDBConnection();

const counterSchema = new Mongoose.Schema({
  _id: { type: String },
  sequence_value: { type: Number }
});

const counters = Mongoose.model('counters', counterSchema);

export async function incrementID(sequenceName) {
  const data = await counters.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true, select: { sequence_value: 1 }
    });
  return data;
}
