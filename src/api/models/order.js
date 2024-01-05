const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      color: {
        type: String,
      },
      size: {
        type: String,
      },
      gender: [{type: String}],
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    mobileNo: {
      type: Number,
      required: true,
    },
    houseAddress: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  shippingPrice: Number,
  status: {
    type: String,
    required: true,
    default: 'Pending',
  },
  statusForAdmin: {
    delivered: {type: Boolean, default: false},
    terminated: {type: Boolean, default: false},
    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',

      default: null,
    },
    terminatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',

      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: new Date(Number(Date.now().toString())).toString(),
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
