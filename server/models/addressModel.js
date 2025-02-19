import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  address_line: { 
    type: String,
    default: ''
  },
  city: { 
    type: String,
    default: ''
  },
  state: { 
    type: String,
    default: ''
  },
  pincode: { 
    type: Number,
    default: null
  },
  mobile: { 
    type: Number,
    default: null
  }
}, {
  timestamps: true
})

const addressModel = mongoose.model('address', addressSchema)

export default addressSchema