import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schemaUser = new Schema({
  _id: { type: Number },
  username: { type: String },
  email: { type: String },
  password: { type: String }
});

export default schemaUser;

