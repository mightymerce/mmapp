'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },

  productId: {
    type: String,
    default: '',
    trim: true,
    required: 'ProductID cannot be blank'
  },
  productTitle: {
    type: String,
    default: '',
    trim: true,
    required: 'Product title cannot be blank'
  },
  productDescription: {
    type: String,
    default: '',
    trim: true,
    required: 'Product description cannot be blank'
  },
  productPrice: {
    type: String,
    default: '',
    trim: true,
    required: 'Product price cannot be blank'
  },
  productTax: {
    type: Object,
    default: '',
    trim: true,
    required: 'Product tax cannot be blank'
  },
  productCurrency: {
    type: Object,
    default: '',
    trim: true,
    required: 'Product currency cannot be blank'
  },
  productSaleprice: {
    type: String,
    default: '',
    trim: true
  },
  productSalepricefrom: {
    type: Date,
    default: '',
    trim: true
  },
  productSalepriceuntil: {
    type: Date,
    default: '',
    trim: true
  },
  productShippingoption: {
    type: Object,
    default: '',
    trim: true,
    required: 'Product shipping option cannot be blank'
  },
  productItemInStock: {
    type: Number,
    default: 1,
    trim: true
  },
  productMainImageURL: {
    type: String,
    default: ''
  },
  productMainImageURLFacebook: {
    type: String,
    default: ''
  },
  productMainImageURLTwitter: {
    type: String,
    default: ''
  },
  productMainImageURLPinterest: {
    type: String,
    default: ''
  },
  productMainImageURLEtsy: {
    type: String,
    default: ''
  },
  productMainImageURLDawanda: {
    type: String,
    default: ''
  },
  productMainImageURLCode: {
    type: String,
    default: ''
  },
  productMainImageAlt: {
    type: String,
    default: ''
  },
  productFurtherImage1URL: {
    type: String,
    default: ''
  },
  productFurtherImage1URLFacebook: {
    type: String,
    default: ''
  },
  productFurtherImage1URLTwitter: {
    type: String,
    default: ''
  },
  productFurtherImage1URLPinterest: {
    type: String,
    default: ''
  },
  productFurtherImage1URLEtsy: {
    type: String,
    default: ''
  },
  productFurtherImage1URLDawanda: {
    type: String,
    default: ''
  },
  productFurtherImage1URLCode: {
    type: String,
    default: ''
  },
  productFurtherImage1Alt: {
    type: String,
    default: ''
  },
  productFurtherImage2URL: {
    type: String,
    default: ''
  },
  productFurtherImage2URLFacebook: {
    type: String,
    default: ''
  },
  productFurtherImage2URLTwitter: {
    type: String,
    default: ''
  },
  productFurtherImage2URLPinterest: {
    type: String,
    default: ''
  },
  productFurtherImage2URLEtsy: {
    type: String,
    default: ''
  },
  productFurtherImage2URLDawanda: {
    type: String,
    default: ''
  },
  productFurtherImage2URLCode: {
    type: String,
    default: ''
  },
  productFurtherImage2Alt: {
    type: String,
    default: ''
  },
  productFurtherImage3URL: {
    type: String,
    default: ''
  },
  productFurtherImage3URLFacebook: {
    type: String,
    default: ''
  },
  productFurtherImage3URLTwitter: {
    type: String,
    default: ''
  },
  productFurtherImage3URLPinterest: {
    type: String,
    default: ''
  },
  productFurtherImage3URLEtsy: {
    type: String,
    default: ''
  },
  productFurtherImage3URLDawanda: {
    type: String,
    default: ''
  },
  productFurtherImage3URLCode: {
    type: String,
    default: ''
  },
  productFurtherImage3Alt: {
    type: String,
    default: ''
  },
  productFurtherImage4URL: {
    type: String,
    default: ''
  },
  productFurtherImage4URLFacebook: {
    type: String,
    default: ''
  },
  productFurtherImage4URLTwitter: {
    type: String,
    default: ''
  },
  productFurtherImage4URLPinterest: {
    type: String,
    default: ''
  },
  productFurtherImage4URLEtsy: {
    type: String,
    default: ''
  },
  productFurtherImage4URLDawanda: {
    type: String,
    default: ''
  },
  productFurtherImage4URLCode: {
    type: String,
    default: ''
  },
  productFurtherImage4Alt: {
    type: String,
    default: ''
  },
  productFurtherImage5URL: {
    type: String,
    default: ''
  },
  productFurtherImage5URLFacebook: {
    type: String,
    default: ''
  },
  productFurtherImage5URLTwitter: {
    type: String,
    default: ''
  },
  productFurtherImage5URLPinterest: {
    type: String,
    default: ''
  },
  productFurtherImage5URLEtsy: {
    type: String,
    default: ''
  },
  productFurtherImage5URLDawanda: {
    type: String,
    default: ''
  },
  productFurtherImage5URLCode: {
    type: String,
    default: ''
  },
  productFurtherImage5Alt: {
    type: String,
    default: ''
  },
  instagramImageId: {
    type: String,
    default: ''
  },
  instagramImagesLow_resolutionUrl: {
    type: String,
    default: ''
  },
  instagramImagesStandard_resolutionUrl: {
    type: String,
    default: ''
  },
  instagramImagesThumbnailUrl: {
    type: String,
    default: ''
  },
  productActive: {
    type: String,
    default: 'active'
  },
  productCheckoutURL: {
    type: String,
    default: ''
  },
  productImport: {
    type: String,
    default: ''
  },
  productImportURL: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Product', ProductSchema);
