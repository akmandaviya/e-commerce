import mongoose from 'mongoose'

const cartProductSchema = new mongoose.Schema({
  product_id: { 
    type: mongoose.Schema.ObjectId,
    default: 'product'
  },
  quantity: {
    type: Number,
    default: 1
  },
  user_id: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'user'    
      }
    ], 
}, {  
// for createdAt and updatedAt
  timestamps: true
})

const cartProductModel = mongoose.model('cartProduct', cartProductSchema )

export default cartProductModel