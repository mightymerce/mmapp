'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Legal Schema
 */
var LegalSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  legalPrivacyPolicy: {
    type: String,
    trim: true,
    default: ''
  },
  legalReturnPolicy: {
    type: String,
    trim: true,
    default: ''
  },
  legalTermsandConditions: {
    type: String,
    trim: true,
    default: ''
  },
  legalImprint: {
    type: String,
    trim: true,
    default: ''
  },
  legalCopyright: {
    type: String,
    trim: true,
    default: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Legal', LegalSchema);
