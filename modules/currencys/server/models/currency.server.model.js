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
  created: {
    type: Date,
    default: Date.now
  },
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
  currencyStandard: {
    type: Boolean,
    trim: true,
    default: false
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
