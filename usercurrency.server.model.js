'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Currency Schema
 */
var CurrencySchema = new Schema({
  currencyCode: {
    type: String,
    trim: true,
    default: ''
  },
  currencyValue: {
    type: String,
    trim: true,
    default: ''
  },
  currencyActive: {
    type: String,
    trim: true,
    default: 'false'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Currency', CurrencySchema);
