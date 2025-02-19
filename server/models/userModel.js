import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({ 
  name: { 
    type: String,
    required: [true, 'Name Required']
  },
  email: { 
    type: String,
    required: [true, 'Email Required'],
    unique: true
  },
  password: { 
    type: String,
    required: [true, 'Password Required']
  },
  avatar: { 
    type: String,
    default: ''
  },
  mobile: { 
    type: Number,
    default: null
  },
  refresh_token: { 
    type: String,
    default: ''
  },
  verify_email: { 
    type: Boolean,
    default: false
  },
  last_login_date: { 
    type: Date,
    default: ''
  },
  status: { 
    type: String,
    enum: [ 'Active', 'Inactive', 'Suspended' ],
    default: 'Active'
  },
  address_detail: [
    { 
      type: mongoose.Schema.ObjectId,
      ref: 'address'
    }
  ],
  shopping_cart: [
    { 
      type: mongoose.Schema.ObjectId,
      ref: 'cartProduct'
    }
  ],
  order_history: [
    { 
      type: mongoose.Schema.ObjectId,
      ref: 'order'
    }
  ],
  forgot_password_otp: { 
    type: String, 
    default: null
  },
  forgot_password_expire: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: [ 'Admin', 'User' ],
    default: 'User'
  }
}, { 
  timestamps: true
})

const userModel = mongoose.model( 'user', userSchema )

export default userModel