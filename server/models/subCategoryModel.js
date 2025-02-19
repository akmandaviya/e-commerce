import mongoose from 'mongoose'

const subCategorySchema = new mongoose.Schema({
  name: { 
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  category_id: [
    { 
      type: mongoose.Schema.ObjectId,
      ref: 'category'
    }
  ]
}, {  
  timestamps: true
})

const subCategoryModel = mongoose.model('subCategory', subCategorySchema )

export default subCategoryModel