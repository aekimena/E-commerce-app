const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {type: String, required: true, default: 'customer'},
  profileUrl: {type: String},
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  deviceToken: String,

  likedProducts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
  ratedProducts: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      rating: {type: Number},
    },
  ],
  addresses: [
    {
      mobileNo: String,
      street: String,
      city: String,
      landmark: String,
      houseAddress: String,
      postalCode: String,
    },
  ],

  notifications: [
    {
      header: String,
      message: String,
      sender: String,
      seen: {type: Boolean, default: false},
      timestamp: {type: Date, default: Date.now},
    },
  ],
  orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
