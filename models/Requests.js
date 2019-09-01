const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema

const StatusesSchema = new Schema({
  id : {
    type: String
  },
  approvedAmount : {
    type: Number
  },
  rejectReasons : {
    type: [String],
    default: void 0
  },
  approvedAmount : {
    type: Date
  },
})


const RequestsSchema = new Schema({
  statuses: {
    type: [StatusesSchema]
  },
  amount: {
    type: Number
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
})


const Requests = mongoose.model('Requests', RequestsSchema, 'requests_sample');

module.exports = Requests;
