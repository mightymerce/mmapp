'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Taxe Schema
 */
var TaxeSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  taxCountry: {
    type: String,
    default: '',
    trim: true,
    required: 'Country cannot be blank'
  },
  taxRate: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Taxe', TaxeSchema);
