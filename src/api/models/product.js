const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  colors: [{color: String, displayName: String}],
  sizes: [{size: String, displayName: String}],
  details: {
    brand: String,
    material: String,
    condition: String,
    colors: String,
    sizes: String,
  },
  stock: {
    type: Number,
  },
  gender: [{type: String}],
  category: {type: String},
  subCategory: {
    type: String,
  },
  subCategoryChild: {
    type: String,
  },

  isDealActive: {
    type: Boolean,
  },

  usersThatLiked: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],

  usersThatRated: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],

  totalLikes: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    totalUsers: {
      type: Number,

      default: 0,
    },
    averageRating: {
      type: Number,

      default: 0,
    },
  },

  totalSales: {
    type: Number,

    default: 0,
  },
  discountPrice: {
    type: Number,

    default: undefined,
  },
});

const Product = mongoose.model('Product', productsSchema);
module.exports = Product;
